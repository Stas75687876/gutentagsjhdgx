'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartProvider';

interface CartButtonProps {
  className?: string;
  variant?: 'desktop' | 'mobile' | 'both';
}

export default function CartButton({ 
  className = '',
  variant = 'both' 
}: CartButtonProps) {
  const { isCartOpen, setIsCartOpen, totalItems } = useCart();
  
  // Keine Anzeige, wenn der Warenkorb bereits geöffnet ist
  if (isCartOpen) return null;
  
  // Keine Anzeige, wenn der Warenkorb leer ist
  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCartOpen(true)}
        className={`
          flex items-center justify-center relative
          ${variant === 'desktop' ? 'hidden md:flex' : ''}
          ${variant === 'mobile' ? 'md:hidden flex' : ''}
          ${className}
        `}
        aria-label="Warenkorb öffnen"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
          {totalItems}
        </span>
      </motion.button>
    </AnimatePresence>
  );
} 