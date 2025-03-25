'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useAddToCart } from '@/lib/hooks/useAddToCart';
import { Notification } from '@/components/ui/Notification';

// In einer realen Anwendung würden diese Daten aus der Datenbank kommen
const mockProducts = [
  {
    id: '1',
    name: 'Basis Website',
    description: 'Eine grundlegende Website für kleine Unternehmen mit bis zu 5 Seiten.',
    longDescription: `
      Die Basis-Website ist perfekt für kleine Unternehmen und Startups, die ihre Online-Präsenz aufbauen möchten. Das Paket umfasst:
      
      - Professionelles, responsives Design
      - Bis zu 5 individuelle Seiten
      - Kontaktformular
      - Integration mit sozialen Medien
      - Grundlegende SEO-Optimierung
      - Mobile Optimierung
      - Hosting für 1 Jahr inklusive
      
      Alle unsere Websites werden mit modernsten Technologien entwickelt und sind vollständig responsive, um auf allen Geräten optimal dargestellt zu werden.
    `,
    price: 999,
    imageUrl: '/images/product-website-basic.jpg',
    featured: true,
    category: 'Websites',
    features: [
      'Responsives Design',
      'Bis zu 5 Seiten',
      'Kontaktformular',
      'Social Media Integration',
      'Grundlegende SEO',
      'Mobile Optimierung',
      '1 Jahr Hosting inklusive',
    ],
  },
  // Weitere Produkte...
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const { addToCart, isAdding, notification, hideNotification } = useAddToCart();
  
  React.useEffect(() => {
    // In einer realen Anwendung würde hier ein API-Aufruf erfolgen
    const foundProduct = mockProducts.find(p => p.id === params.id);
    
    if (foundProduct) {
      setProduct(foundProduct);
    }
    
    setIsLoading(false);
  }, [params.id]);
  
  // Wenn das Produkt nicht gefunden wurde, 404-Seite anzeigen
  if (!isLoading && !product) {
    notFound();
  }
  
  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    setQuantity(value);
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(
      {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.imageUrl,
      },
      { quantity }
    );
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Zurück-Button */}
        <div className="mb-8">
          <Link 
            href="/shop" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zum Shop
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Produktbild */}
            <div className="md:w-1/2 relative h-96 md:h-auto bg-gray-200">
              {/* Placeholder Bild für die Entwicklung */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100">
                <div className="text-center">
                  <ShoppingCart className="h-20 w-20 mx-auto mb-4" />
                  <span className="text-xl font-medium">{product.name}</span>
                </div>
              </div>
              
              {product.featured && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  Empfohlen
                </div>
              )}
            </div>
            
            {/* Produktinfos */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-2xl font-bold text-blue-600 mb-6">{product.price.toFixed(2)} €</p>
                <div className="prose max-w-none mb-6">
                  <p>{product.description}</p>
                </div>
              </div>
              
              {/* Menge und Warenkorb */}
              <div className="mb-8">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Menge
                </label>
                <div className="flex items-center mb-4">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="p-2 w-16 text-center border-t border-b border-gray-300 focus:outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`w-full flex items-center justify-center py-3 px-8 rounded-md text-white font-medium ${
                    isAdding ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isAdding ? (
                    <span className="inline-block h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></span>
                  ) : (
                    <ShoppingCart className="h-5 w-5 mr-2" />
                  )}
                  In den Warenkorb
                </button>
              </div>
              
              {/* Features */}
              {product.features && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Funktionen & Vorteile</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Produktbeschreibung */}
          {product.longDescription && (
            <div className="p-6 md:p-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Produktbeschreibung</h2>
              <div className="prose max-w-none whitespace-pre-line">
                {product.longDescription}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Benachrichtigung */}
      <Notification 
        visible={notification.visible} 
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
    </div>
  );
} 