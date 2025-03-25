'use client';

import React from 'react';

/**
 * StripeProvider
 * Diese Komponente behebt das QuotaExceededError-Problem auf Mobilgeräten
 * für die Stripe-Integration, indem sie sicherstellt, dass genügend Speicherplatz
 * vorhanden ist und Fehler beim localStorage-Zugriff abfängt.
 */
export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Speicherbereinigung durchführen
  React.useEffect(() => {
    // Speicher für Stripe vorbereiten
    const prepareStorageForStripe = () => {
      try {
        console.log('[StripeProvider] Optimiere Speicher für Stripe...');
        
        // Unwichtige Daten im localStorage identifizieren und entfernen
        const keysToKeep = [
          'cart', 'theme', 'user', 'checkout', 'session'
        ];
        
        // Sammle Schlüssel, die gelöscht werden können
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && !keysToKeep.some(keepKey => key.includes(keepKey))) {
            keysToRemove.push(key);
          }
        }
        
        // Lösche unnötige Daten
        const removedCount = keysToRemove.length;
        keysToRemove.forEach(key => {
          try {
            localStorage.removeItem(key);
          } catch (e) {
            // Fehler ignorieren
          }
        });
        
        console.log(`[StripeProvider] ${removedCount} unnötige Einträge entfernt`);
      } catch (err) {
        console.error('[StripeProvider] Fehler bei der Speicheroptimierung:', err);
      }
    };
    
    // localStorage-Patching (um Fehler abzufangen)
    const patchLocalStorage = () => {
      if (typeof window === 'undefined') return;
      
      try {
        // Original-Methoden speichern
        const originalSetItem = localStorage.setItem;
        const originalGetItem = localStorage.getItem;
        
        // setItem überschreiben, um QuotaExceededError abzufangen
        localStorage.setItem = function(key, value) {
          try {
            // Versuche normal zu speichern
            originalSetItem.apply(this, [key, value]);
          } catch (e) {
            console.warn(`[StripeProvider] localStorage.setItem Fehler für ${key}:`, e);
            
            // Bei Fehler versuche Speicherplatz freizugeben
            try {
              // Stripe-bezogene alte Einträge finden und entfernen
              const stripeKeys: string[] = [];
              for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && (k.includes('stripe') || k.includes('pk_'))) {
                  stripeKeys.push(k);
                }
              }
              
              // Die ersten 5 Einträge entfernen
              const keysToDelete = stripeKeys.slice(0, 5);
              keysToDelete.forEach(k => {
                try { localStorage.removeItem(k); } catch (e) { /* ignorieren */ }
              });
              
              // Erneut versuchen
              originalSetItem.apply(this, [key, value]);
              console.log(`[StripeProvider] Erfolgreich ${keysToDelete.length} alte Einträge entfernt und neu gespeichert`);
            } catch (retryError) {
              // Wenn immer noch Fehler, aufgeben und still weitermachen
              console.error('[StripeProvider] Konnte keine Daten speichern, auch nach Bereinigung');
            }
          }
        };
        
        // getItem überschreiben, um Fehler abzufangen
        localStorage.getItem = function(key) {
          try {
            return originalGetItem.apply(this, [key]);
          } catch (e) {
            console.warn(`[StripeProvider] localStorage.getItem Fehler für ${key}:`, e);
            return null;
          }
        };
        
        console.log('[StripeProvider] localStorage erfolgreich gepacht');
      } catch (e) {
        console.error('[StripeProvider] Fehler beim Patchen von localStorage:', e);
      }
    };
    
    // Beide Optimierungen durchführen
    prepareStorageForStripe();
    patchLocalStorage();
    
    // Nach 5 Sekunden erneut auf wenig Speicher prüfen
    const checkTimer = setTimeout(() => {
      prepareStorageForStripe();
    }, 5000);
    
    return () => {
      clearTimeout(checkTimer);
    };
  }, []);
  
  return <>{children}</>;
};

export default StripeProvider; 