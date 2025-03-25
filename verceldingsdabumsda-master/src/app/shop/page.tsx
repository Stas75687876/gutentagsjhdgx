'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import CartButton from '@/components/shop/CartButton';
import { useCart } from '@/components/shop/CartProvider';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

// Dynamisches Laden der Icons mit No-SSR, um Hydration-Fehler zu vermeiden
const ShoppingCart = dynamic(() => import('lucide-react').then(mod => mod.ShoppingCart), { ssr: false });
const Eye = dynamic(() => import('lucide-react').then(mod => mod.Eye), { ssr: false });

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  features: string[];
  isPopular: boolean;
  isPremium: boolean;
}

export default function ShopPage() {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // Nur clientseitig rendern, um Hydration-Fehler zu vermeiden
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Funktion zum Abrufen der Produkte
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error(`Fehler beim Laden der Produkte: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        setError('Keine Produkte verfügbar. Bitte versuchen Sie es später erneut.');
      } else {
        setProducts(data);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Produkte:', err);
      setError('Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  // Produkte beim ersten Laden abrufen
  React.useEffect(() => {
    fetchProducts();
  }, []);

  // Produkte beim Zurückkehren zur Seite aktualisieren
  React.useEffect(() => {
    // Funktion zum Aktualisieren der Produkte, wenn die Seite sichtbar wird
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Seite ist wieder im Fokus, aktualisiere Produkte...');
        fetchProducts();
      }
    };

    // Ereignislistener für Sichtbarkeitsänderungen hinzufügen
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Bereinigungsfunktion
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Filtere Produkte basierend auf Suchbegriff
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">Unsere Dienste</h1>
          <CartButton className="ml-4" />
        </div>
        
        {products.length > 0 && (
          <div className="mb-8">
            <div className="relative max-w-md mx-auto md:mx-0">
              <input
                type="text"
                className="w-full p-4 pl-12 pr-4 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Suche nach Diensten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  onClick={() => setSearchTerm('')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Produkte werden geladen...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Fehler beim Laden</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Erneut versuchen
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id} 
                variants={item}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="overflow-hidden rounded-lg border bg-gray-100 h-48 relative">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0] || '/images/placeholder.jpg'}
                      alt={product.name}
                      className="object-cover transition-transform hover:scale-105"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                        console.log('Bild konnte nicht geladen werden, verwende Platzhalter:', product.images[0]);
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Image
                        src="/images/placeholder.jpg"
                        alt="Platzhalter"
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
                  
                  {/* Preisanzeige für die Produktkarte */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {product.price.toFixed(2)} €
                    </span>
                    {(product.isPopular || product.isPremium) && (
                      <div className="flex space-x-1">
                        {product.isPopular && (
                          <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs font-medium px-2 py-0.5 rounded">
                            Beliebt
                          </span>
                        )}
                        {product.isPremium && (
                          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-medium px-2 py-0.5 rounded">
                            Premium
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Features:</h3>
                    <ul className="space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="p-6 pt-0 mt-auto">
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={() => addToCart({ 
                        id: product.id.toString(), 
                        name: product.name, 
                        price: product.price,
                        description: product.description,
                        image: product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg',
                        quantity: 1 
                      })}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      In den Warenkorb
                    </button>
                    <Link
                      href={`/shop/${product.id}`}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Keine Ergebnisse gefunden</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Wir konnten keine Produkte finden, die deiner Suche entsprechen.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Filter zurücksetzen
            </button>
          </motion.div>
        )}
      </div>
      <Footer />
    </>
  );
} 