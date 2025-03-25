'use client';

import React from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  // Lade den Warenkorb aus dem localStorage beim ersten Rendern
  React.useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error('Fehler beim Laden des Warenkorbs:', err);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Speichere den Warenkorb im localStorage wenn er sich ändert
  React.useEffect(() => {
    if (loaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, loaded]);

  // Berechne die Gesamtanzahl der Artikel im Warenkorb
  const totalItems = cart.reduce((total: number, item: CartItem) => total + item.quantity, 0);

  // Berechne den Gesamtpreis aller Artikel im Warenkorb
  const totalPrice = cart.reduce(
    (total: number, item: CartItem) => total + item.price * item.quantity, 
    0
  );

  // Füge ein Produkt zum Warenkorb hinzu (oder erhöhe die Menge, wenn es bereits existiert)
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart: CartItem[]) => {
      const existingItemIndex = prevCart.findIndex(
        (item: CartItem) => item.id === product.id
      );

      if (existingItemIndex !== -1) {
        // Produkt existiert bereits, erhöhe die Menge
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
        return updatedCart;
      } else {
        // Neues Produkt, füge es mit Menge 1 hinzu
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    // Öffne den Warenkorb beim Hinzufügen
    setIsCartOpen(true);
  };

  // Entferne ein Produkt aus dem Warenkorb
  const removeFromCart = (id: string) => {
    setCart((prevCart: CartItem[]) => prevCart.filter((item: CartItem) => item.id !== id));
  };

  // Aktualisiere die Menge eines Produkts im Warenkorb
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart: CartItem[]) =>
      prevCart.map((item: CartItem) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Lösche den gesamten Warenkorb
  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    totalItems,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
} 