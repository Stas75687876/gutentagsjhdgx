import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

// Zustand Store ohne expliziten Typparameter für create
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex((i) => i.id === item.id);
          
          if (existingItemIndex !== -1) {
            // Das Produkt ist bereits im Warenkorb, erhöhen wir die Menge
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity || 1;
            return { items: newItems };
          } else {
            // Neues Produkt zum Warenkorb hinzufügen
            return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
          }
        });
      },
      
      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      updateQuantity: (id: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) => 
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity, 
          0
        );
      },
    }),
    {
      name: 'cart-storage', // Name für die Speicherung im localStorage
    }
  )
); 