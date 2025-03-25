'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCart, CartItem } from './CartProvider';

export default function Cart() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const [isClient, setIsClient] = React.useState(false);

  // Workaround für hydration mismatch mit localStorage
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Schließe den Warenkorb mit ESC-Taste
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isClient) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Warenkorb ({totalItems})
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Warenkorb schließen"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-lg font-medium">Dein Warenkorb ist leer</p>
                  <p className="text-sm mt-1">Füge Produkte hinzu, um sie zu kaufen</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                  >
                    Weiter einkaufen
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item: CartItem) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      updateQuantity={updateQuantity}
                      removeFromCart={removeFromCart}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Total and Checkout */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {/* Summary */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Zwischensumme:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{totalPrice.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">MwSt.:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{(totalPrice * 0.19).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Gesamt:</span>
                    <span className="text-gray-900 dark:text-white">{totalPrice.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  <Link 
                    href="/checkout"
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-md transition-all duration-200 flex items-center justify-center"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Zur Kasse
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-2 px-4 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md transition-all duration-200 border border-gray-300 dark:border-gray-600"
                  >
                    Weiter einkaufen
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface CartItemCardProps {
  item: CartItem;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
}

function CartItemCard({ item, updateQuantity, removeFromCart }: CartItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex p-2 border border-gray-100 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
    >
      {/* Product Image */}
      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</h3>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            aria-label="Produkt entfernen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">{item.description}</p>
        
        {/* Quantity and Price */}
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {(item.price * item.quantity).toFixed(2)} €
          </span>
          
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Menge verringern"
            >
              -
            </button>
            <span className="px-2 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm min-w-[24px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Menge erhöhen"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 