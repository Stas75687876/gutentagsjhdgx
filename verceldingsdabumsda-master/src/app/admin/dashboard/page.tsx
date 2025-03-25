'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  return (
    <div className="p-8 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Willkommen im Admin-Bereich deiner Website. Hier kannst du Produkte, Bestellungen und Einstellungen verwalten.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">Produkte</h2>
            <p className="text-white/80 mb-4">Verwalte deine Produkte im Shop</p>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold">4</span>
              <Link href="/admin/products" className="text-white/90 hover:text-white">Verwalten →</Link>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">Bestellungen</h2>
            <p className="text-white/80 mb-4">Übersicht aller Bestellungen</p>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold">0</span>
              <Link href="/admin/orders" className="text-white/90 hover:text-white">Verwalten →</Link>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">Einnahmen</h2>
            <p className="text-white/80 mb-4">Übersicht deiner Einnahmen</p>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold">0,00 €</span>
              <Link href="/admin/finances" className="text-white/90 hover:text-white">Details →</Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Schnellzugriff</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/admin/products/new" 
              className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Neues Produkt</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">Erstelle ein neues Produkt im Shop</p>
              </div>
            </Link>
            
            <Link 
              href="/shop" 
              className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              target="_blank"
            >
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Shop anzeigen</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">Besuche deinen Shop</p>
              </div>
            </Link>
            
            <Link 
              href="/admin/settings" 
              className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="bg-gray-200 dark:bg-gray-600 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Einstellungen</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">Konfiguriere deine Website</p>
              </div>
            </Link>
            
            <Link 
              href="/" 
              className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Zurück zur Website</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">Verlasse den Admin-Bereich</p>
              </div>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 