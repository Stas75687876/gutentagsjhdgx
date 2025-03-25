'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCart } from './CartProvider';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  features: string[];
  isPopular?: boolean;
  isPremium?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleAddToCart = () => {
    // Validiere die Bild-URL vor dem Hinzufügen zum Warenkorb
    let validImage: string | undefined = undefined;
    if (product.images && product.images.length > 0) {
      try {
        const imageUrl = product.images[0];
        // Teste, ob die URL gültig ist
        new URL(imageUrl);
        // Verwende nur HTTPS-URLs
        if (imageUrl.startsWith('https://')) {
          validImage = imageUrl;
        }
      } catch (err) {
        console.warn(`Ungültige Bild-URL für Produkt ${product.name}: ${product.images[0]}`);
      }
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: validImage,
    });
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col h-full transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.2)' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Produkt-Bild */}
      <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700">
        {product.images && product.images.length > 0 ? (
          // Prüfe, ob die Bild-URL gültig ist
          (() => {
            try {
              const imageUrl = product.images[0];
              // Teste, ob die URL gültig ist
              new URL(imageUrl);
              
              // Verwende nur HTTPS-URLs oder lokale Pfade, die mit / beginnen
              if (imageUrl.startsWith('https://') || imageUrl.startsWith('/')) {
                return (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                );
              }
              // Bei ungültigen URLs Fallback-Bild anzeigen
              throw new Error('Keine gültige Bild-URL');
            } catch (err) {
              // Fallback für ungültige URLs
              return (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              );
            }
          })()
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badges für populäre/premium Produkte */}
        <div className="absolute top-2 left-2 flex space-x-2">
          {product.isPopular && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
              Beliebt
            </span>
          )}
          {product.isPremium && (
            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
              Premium
            </span>
          )}
        </div>
      </div>

      {/* Produktdetails */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        {/* Features-Liste */}
        <div className="mb-4 flex-1">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Features:</h4>
          <ul className="space-y-1">
            {product.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Preis und Kaufen-Button */}
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{product.price.toFixed(2)} €</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">inkl. MwSt.</span>
          </div>
          
          <motion.button
            onClick={handleAddToCart}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-md transition-all duration-200 flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            In den Warenkorb
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
} 