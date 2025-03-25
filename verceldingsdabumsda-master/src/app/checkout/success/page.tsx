'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { motion } from 'framer-motion';

// Separate Client-Komponente mit useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);
  
  React.useEffect(() => {
    // Warenkorb leeren, nachdem die Zahlung erfolgreich war
    clearCart();
    
    // Optional: Bestellung in der Datenbank speichern
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      saveOrder(sessionId);
    }
  }, [clearCart, searchParams]);
  
  // Diese Funktion würde in einer realen Implementierung die Bestellung speichern
  const saveOrder = async (sessionId: string) => {
    try {
      // API-Aufruf, um die Bestellung zu speichern
      // await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ sessionId })
      // });
      console.log('Bestellung mit Session-ID gespeichert:', sessionId);
    } catch (error) {
      console.error('Fehler beim Speichern der Bestellung:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 15 
            }}
          >
            <CheckCircle className="h-20 w-20 text-green-500 dark:text-green-400" />
          </motion.div>
        </div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white"
        >
          Zahlung erfolgreich!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 dark:text-gray-300 mb-6 text-center"
        >
          Vielen Dank für Ihren Einkauf. Ihre Bestellung wurde erfolgreich aufgenommen und wird umgehend bearbeitet.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md mb-6"
        >
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Bestellbestätigung</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
            Eine Bestätigungs-E-Mail wird in Kürze an Ihre angegebene E-Mail-Adresse gesendet.
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Bestellnummer: <span className="font-medium">{searchParams.get('session_id')?.substring(0, 8) || 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
        >
          <Link 
            href="/"
            className="flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300 shadow-sm"
          >
            <Home className="h-5 w-5 mr-2" />
            Startseite
          </Link>
          
          <Link 
            href="/shop"
            className="flex items-center justify-center py-2.5 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors duration-300 shadow-sm"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Weiter einkaufen
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md"
        >
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Haben Sie Fragen?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Falls Sie Fragen zu Ihrer Bestellung haben, kontaktieren Sie uns bitte unter{' '}
            <a href="mailto:kundenservice@ct-studio.de" className="text-blue-600 dark:text-blue-400 hover:underline">
              kundenservice@ct-studio.de
            </a>
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        © {new Date().getFullYear()} Krasse Websites • Flurweg 13, 94527 Aholming • <a href="mailto:kundenservice@ct-studio.de" className="hover:underline">kundenservice@ct-studio.de</a> • <a href="tel:+4915167270985" className="hover:underline">+49 15167270985</a>
      </motion.div>
    </div>
  );
}

// Loading-Komponente für Suspense
function SuccessLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-700 dark:text-gray-300">Transaktion wird verarbeitet...</p>
      </div>
    </div>
  );
}

// Hauptkomponente mit Suspense-Boundary
export default function CheckoutSuccess() {
  return (
    <React.Suspense fallback={<SuccessLoading />}>
      <SuccessContent />
    </React.Suspense>
  );
} 