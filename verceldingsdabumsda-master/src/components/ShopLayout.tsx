'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from './Footer';
import { CartProvider } from './shop/CartProvider';
import { Menu, X } from 'lucide-react';

interface ShopLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export default function ShopLayout({ children, showHeader = false }: ShopLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#111827]">
        {/* Shop-Header, nur wenn showHeader true ist */}
        {showHeader && (
          <header className="bg-[#111827] border-b border-gray-800 sticky top-0 z-10 py-4">
            <div className="container mx-auto px-4 md:px-8">
              <div className="flex justify-between items-center">
                <Link href="/shop" className="text-2xl font-bold text-[#6366F1] hover:text-violet-400 transition">
                  NEUJE Shop
                </Link>
                
                {/* Mobile Menu Button */}
                <button 
                  className="md:hidden p-2 text-white focus:outline-none"
                  onClick={toggleMobileMenu}
                  aria-label="Menü öffnen"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                  <Link href="/shop" className="text-white hover:text-[#6366F1] transition">
                    Produkte
                  </Link>
                  <Link href="/shop/cart" className="text-white hover:text-[#6366F1] transition">
                    Warenkorb
                  </Link>
                  <Link href="/" className="text-white hover:text-[#6366F1] transition">
                    Zurück zur Website
                  </Link>
                </div>
              </div>
              
              {/* Mobile Navigation */}
              {mobileMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden mt-4"
                >
                  <div className="flex flex-col space-y-4 py-3">
                    <Link 
                      href="/shop" 
                      className="text-white hover:text-[#6366F1] transition px-2 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Produkte
                    </Link>
                    <Link 
                      href="/shop/cart" 
                      className="text-white hover:text-[#6366F1] transition px-2 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Warenkorb
                    </Link>
                    <Link 
                      href="/" 
                      className="text-white hover:text-[#6366F1] transition px-2 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Zurück zur Website
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </header>
        )}

        {/* Hauptinhalt */}
        <motion.main 
          className="flex-grow py-8 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto">
            {children}
          </div>
        </motion.main>

        {/* Shop-Footer */}
        <Footer />
      </div>
    </CartProvider>
  );
} 