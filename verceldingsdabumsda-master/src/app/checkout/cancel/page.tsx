'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, ShoppingCart, Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CheckoutCancel() {
  const router = useRouter();

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
            <XCircle className="h-20 w-20 text-red-500 dark:text-red-400" />
          </motion.div>
        </div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white"
        >
          Zahlung abgebrochen
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 dark:text-gray-300 mb-8 text-center"
        >
          Ihre Zahlung wurde abgebrochen. Keine Sorge, Ihr Warenkorb wurde gespeichert und Sie können den Checkout-Prozess jederzeit fortsetzen.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
        >
          <Link 
            href="/"
            className="flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300 shadow-sm"
          >
            <Home className="h-5 w-5 mr-2" />
            Startseite
          </Link>
          
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center py-2.5 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors duration-300 shadow-sm"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Warenkorb
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-200 dark:border-gray-700 pt-5"
        >
          <div className="flex justify-center">
            <Link
              href="/shop"
              className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Weiter einkaufen</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md"
        >
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Benötigen Sie Hilfe?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Falls Sie Probleme bei der Zahlung haben, kontaktieren Sie uns bitte unter{' '}
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