import React from 'react';
import { useCartStore, CartItem } from '@/lib/store/cart';

export type AddToCartOptions = {
  showNotification?: boolean;
  quantity?: number;
};

export function useAddToCart() {
  const [isAdding, setIsAdding] = React.useState(false);
  const [notification, setNotification] = React.useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });
  
  const addItem = useCartStore((state) => state.addItem);
  
  const addToCart = async (product: Omit<CartItem, 'quantity'>, options: AddToCartOptions = {}) => {
    const { showNotification = true, quantity = 1 } = options;
    
    setIsAdding(true);
    
    try {
      // Hier könnten zusätzliche Validierungen oder API-Aufrufe stattfinden
      // z.B. um zu prüfen, ob das Produkt noch auf Lager ist
      
      // Produkt zum Warenkorb hinzufügen
      addItem({ ...product, quantity });
      
      // Benachrichtigung anzeigen, wenn gewünscht
      if (showNotification) {
        setNotification({
          visible: true,
          message: `${product.name} wurde zum Warenkorb hinzugefügt`,
          type: 'success',
        });
        
        // Benachrichtigung nach 3 Sekunden ausblenden
        setTimeout(() => {
          setNotification((prev) => ({ ...prev, visible: false }));
        }, 3000);
      }
      
      return true;
    } catch (error) {
      // Fehlerbehandlung
      console.error('Fehler beim Hinzufügen zum Warenkorb:', error);
      
      if (showNotification) {
        setNotification({
          visible: true,
          message: 'Fehler beim Hinzufügen zum Warenkorb',
          type: 'error',
        });
        
        setTimeout(() => {
          setNotification((prev) => ({ ...prev, visible: false }));
        }, 3000);
      }
      
      return false;
    } finally {
      setIsAdding(false);
    }
  };
  
  return {
    addToCart,
    isAdding,
    notification,
    hideNotification: () => setNotification((prev) => ({ ...prev, visible: false })),
  };
} 