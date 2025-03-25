/**
 * Stripe Storage Helper
 * Hilft bei der Verwaltung des LocalStorage für die Stripe-Integration
 * und verhindert QuotaExceededError-Fehler, insbesondere auf Mobilgeräten
 */

// Überprüfen, ob localStorage verfügbar ist
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Stripe-spezifische Speicherelemente identifizieren
const getStripeStorageItems = (): string[] => {
  const stripeKeys: string[] = [];
  if (!isLocalStorageAvailable()) return stripeKeys;
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('stripe') || 
        key.includes('pk_live_') || 
        key.includes('pk_test_') ||
        key.includes('stripe-js') ||
        key.includes('__stripe')
      )) {
        stripeKeys.push(key);
      }
    }
  } catch (err) {
    console.error('Fehler beim Identifizieren von Stripe-Elementen:', err);
  }
  
  return stripeKeys;
};

// Schätzung des verfügbaren Speicherplatzes
const estimateAvailableStorage = (): number => {
  if (!isLocalStorageAvailable()) return 0;
  
  try {
    let usedSpace = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        usedSpace += key.length + value.length;
      }
    }
    
    // Vereinfachte Schätzung: Mobile Browser haben ~5MB (~5.000.000 Zeichen)
    // Wenn 90% voll, betrachten wir es als kritisch
    const totalEstimated = 5000000;
    const available = Math.max(0, totalEstimated - usedSpace);
    
    return available;
  } catch (err) {
    console.error('Fehler bei der Speicherschätzung:', err);
    return 0;
  }
};

// Speicher für Stripe optimieren
export const optimizeStorageForStripe = (): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    // Verfügbaren Speicher prüfen
    const availableStorage = estimateAvailableStorage();
    const isLow = availableStorage < 500000; // Unter 500KB betrachten wir als niedrig
    
    console.log(`[Stripe Storage] Verfügbarer Speicher: ~${Math.round(availableStorage/1024)}KB`);
    
    if (isLow) {
      // Bei niedrigem Speicher alte Stripe-Elemente entfernen
      const stripeItems = getStripeStorageItems();
      console.log(`[Stripe Storage] ${stripeItems.length} Stripe-Elemente gefunden`);
      
      // Nur die älteren Einträge löschen (z.B. die Hälfte)
      const itemsToRemove = stripeItems.slice(0, Math.ceil(stripeItems.length / 2));
      
      itemsToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          // Einzelne Fehler ignorieren
        }
      });
      
      console.log(`[Stripe Storage] ${itemsToRemove.length} alte Stripe-Elemente entfernt`);
      
      // Session Storage auch bereinigen als zusätzliche Maßnahme
      try {
        const stripeSessionItems = Object.keys(sessionStorage)
          .filter(key => key.includes('stripe') || key.includes('__stripe'));
        
        stripeSessionItems.forEach(key => sessionStorage.removeItem(key));
      } catch (e) {
        // Ignorieren
      }
      
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('[Stripe Storage] Optimierungsfehler:', err);
    return false;
  }
};

// Sicherer localStorage Wrapper
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[Stripe Storage] Fehler beim Lesen von ${key}:`, e);
      return null;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      // Vor dem Speichern optimieren, wenn der Schlüssel mit Stripe zu tun hat
      if (key.includes('stripe') || key.includes('pk_')) {
        optimizeStorageForStripe();
      }
      
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error(`[Stripe Storage] Fehler beim Speichern von ${key}:`, e);
      
      // Wenn Fehler auftritt, aggressivere Bereinigung durchführen
      try {
        // Alle älteren Stripe-Elemente entfernen
        const stripeItems = getStripeStorageItems();
        stripeItems.forEach(k => localStorage.removeItem(k));
        
        // Erneut versuchen
        localStorage.setItem(key, value);
        return true;
      } catch (retryError) {
        console.error('[Stripe Storage] Auch nach Bereinigung fehlgeschlagen:', retryError);
        return false;
      }
    }
  },
  
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`[Stripe Storage] Fehler beim Entfernen von ${key}:`, e);
      return false;
    }
  }
};

// Speicherbereinigung und -optimierung vor Stripe-Ladevorgang durchführen
export const prepareStorageForStripe = (): void => {
  console.log('[Stripe Storage] Vorbereitung des Speichers für Stripe...');
  
  try {
    // Verfügbaren Speicher prüfen und optimieren
    optimizeStorageForStripe();
    
    // localStorage.clear() würde alle Daten löschen - das wollen wir vermeiden
    // Stattdessen nur unnötige Daten löschen
    
    // Wichtige Schlüssel, die wir behalten wollen
    const keysToKeep = [
      'cart', 'user', 'theme', 'checkout',
      // Aktuelle Stripe-Session behalten
      'stripe.checkout-session'
    ];
    
    // Alle Schlüssel durchgehen und nicht benötigte löschen
    if (isLocalStorageAvailable()) {
      const allKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) allKeys.push(key);
      }
      
      // Filter anwenden und unnötige Elemente löschen
      const keysToRemove = allKeys.filter(key => 
        !keysToKeep.some(keepKey => key.includes(keepKey))
      );
      
      if (keysToRemove.length > 0) {
        console.log(`[Stripe Storage] Entferne ${keysToRemove.length} nicht wesentliche Elemente`);
        keysToRemove.forEach(key => {
          try { localStorage.removeItem(key); } catch (e) { /* ignorieren */ }
        });
      }
    }
    
    console.log('[Stripe Storage] Speicheroptimierung abgeschlossen');
  } catch (err) {
    console.error('[Stripe Storage] Fehler bei der Speichervorbereitung:', err);
  }
};

// Wrapper für die Initialisierung von Stripe
export const initializeStripeWithStorage = (): void => {
  prepareStorageForStripe();
  
  // Patch für Stripe's LocalStorage-Zugriffe
  if (typeof window !== 'undefined') {
    try {
      // Originalen localStorage speichern
      const originalLocalStorage = window.localStorage;
      
      // Monkey-Patching von localStorage
      Object.defineProperty(window, 'localStorage', {
        get: function() {
          return {
            getItem: function(key: string) {
              try {
                return originalLocalStorage.getItem(key);
              } catch (e) {
                console.warn('[Stripe Storage Patched] getItem Fehler abgefangen:', e);
                return null;
              }
            },
            setItem: function(key: string, value: string) {
              try {
                if (key.includes('stripe') || key.includes('pk_')) {
                  optimizeStorageForStripe();
                }
                originalLocalStorage.setItem(key, value);
              } catch (e) {
                console.warn('[Stripe Storage Patched] setItem Fehler abgefangen:', e);
                // Versuchen, Platz zu schaffen
                try {
                  const stripeItems = getStripeStorageItems();
                  if (stripeItems.length > 0) {
                    stripeItems.slice(0, 3).forEach(k => originalLocalStorage.removeItem(k));
                    originalLocalStorage.setItem(key, value);
                  }
                } catch (e2) {
                  // Aufgeben, wenn auch das fehlschlägt
                }
              }
            },
            removeItem: function(key: string) {
              try {
                originalLocalStorage.removeItem(key);
              } catch (e) {
                console.warn('[Stripe Storage Patched] removeItem Fehler abgefangen:', e);
              }
            },
            clear: function() {
              try {
                originalLocalStorage.clear();
              } catch (e) {
                console.warn('[Stripe Storage Patched] clear Fehler abgefangen:', e);
              }
            },
            key: function(index: number) {
              try {
                return originalLocalStorage.key(index);
              } catch (e) {
                console.warn('[Stripe Storage Patched] key Fehler abgefangen:', e);
                return null;
              }
            },
            get length() {
              try {
                return originalLocalStorage.length;
              } catch (e) {
                console.warn('[Stripe Storage Patched] length Fehler abgefangen:', e);
                return 0;
              }
            }
          };
        }
      });
      
      console.log('[Stripe Storage] localStorage erfolgreich für Stripe gepacht');
    } catch (e) {
      console.error('[Stripe Storage] Patching fehlgeschlagen:', e);
    }
  }
}; 