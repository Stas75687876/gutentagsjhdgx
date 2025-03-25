'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ProductCard, { Product } from './ProductCard';
import CartButton from './CartButton';

// Fallback-Produkte für den Fall, dass die API nicht erreichbar ist
const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Basic Website',
    description: 'Perfekt für kleine Unternehmen und Selbstständige. Eine einfache aber effektive Website mit allen Grundfunktionen.',
    price: 499,
    images: ['/images/product-basic.jpg'],
    features: [
      'Responsive Design',
      'Bis zu 5 Seiten',
      'Kontaktformular',
      'SEO-Grundlagen',
      '1 Monat Support'
    ],
    isPopular: true
  },
  {
    id: '2',
    name: 'Business Website',
    description: 'Ideal für wachsende Unternehmen. Eine professionelle Website mit erweiterten Funktionen und CMS-Integration.',
    price: 999,
    images: ['/images/product-business.jpg'],
    features: [
      'Alles aus Basic',
      'Bis zu 15 Seiten',
      'Content Management System',
      'Blog-Integration',
      'Erweiterte SEO-Optimierung',
      '3 Monate Support'
    ]
  },
  {
    id: '3',
    name: 'Premium E-Commerce',
    description: 'Die komplette E-Commerce-Lösung für Ihr Online-Geschäft. Vollständiger Online-Shop mit Zahlungsintegration.',
    price: 1999,
    images: ['/images/product-premium.jpg'],
    features: [
      'Alles aus Business',
      'Unbegrenzte Produktseiten',
      'Online-Shop mit Warenkorb',
      'Zahlungsintegration',
      'Kundenverwaltung',
      'Analytics-Integration',
      '12 Monate Support'
    ],
    isPremium: true
  }
];

interface ShopSectionProps {
  title?: string;
  subtitle?: string;
}

export default function ShopSection({ 
  title = "Unsere Webdesign-Pakete", 
  subtitle = "Finden Sie das perfekte Paket für Ihren Online-Erfolg" 
}: ShopSectionProps) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // API-Aufruf für Produkte
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Produkte konnten nicht geladen werden');
        }
        
        const data = await response.json();
        console.log('Produkte von API geladen:', data);
        
        // Prüfen, ob Daten vorhanden sind
        if (data && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          console.warn('Keine Produktdaten von API erhalten, verwende Fallback-Daten');
          setError('Keine Produkte gefunden. Wir zeigen Beispiel-Produkte.');
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error('Fehler beim Laden der Produkte:', err);
        setError('Produkte konnten nicht geladen werden. Wir zeigen Beispiel-Produkte.');
        // Fallback zu Beispiel-Produkten, wenn API nicht verfügbar
        setProducts(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section id="shop" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {subtitle}
          </p>
          
          {error && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center max-w-xl mx-auto">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">{error}</p>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: Product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 