'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { AnimatePresence } from 'framer-motion';
import AnimationProvider from './ui/animation-provider';
import { CartProvider } from './shop/CartProvider';
import Cart from './shop/Cart';

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <AnimationProvider>
        <CartProvider>
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
          <Cart />
        </CartProvider>
      </AnimationProvider>
    </ThemeProvider>
  );
} 