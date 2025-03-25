'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ShopLayout from '@/components/ShopLayout';
import { useCart } from '@/components/shop/CartProvider';
import dynamic from 'next/dynamic';

// Dynamisches Laden des Icons, um Hydration-Fehler zu vermeiden
const ArrowLeft = dynamic(() => import('lucide-react').then(mod => mod.ArrowLeft), { ssr: false });

// Produkt-Interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  isPopular: boolean;
  isPremium: boolean;
  features: string[];
  longDescription?: string;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const { addToCart } = useCart();
  const [mounted, setMounted] = React.useState(false);

  // Nur clientseitig rendern, um Hydration-Fehler zu vermeiden
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Funktion zum Abrufen der Produktdetails
  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Produkt nicht gefunden');
        }
        throw new Error(`Fehler beim Abrufen der Produktdetails: ${response.status}`);
      }
      const data = await response.json();
      console.log('Produkt geladen:', data);
      setProduct(data);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Produktdetails:', err);
      setError('Produktdetails konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };

  // Produktdetails beim ersten Laden abrufen
  React.useEffect(() => {
    fetchProductDetails();
  }, [params.id]);

  // Zum nächsten Bild wechseln
  const nextImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  // Zum vorherigen Bild wechseln
  const prevImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  // Produkt zum Warenkorb hinzufügen
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'
    });
    
    alert('Produkt wurde zum Warenkorb hinzugefügt!');
  };

  return (
    <ShopLayout>
      <div className="py-6 relative">
        {/* Zurück-Button */}
        {mounted && (
          <Link 
            href="/shop" 
            className="absolute top-0 left-0 flex items-center px-4 py-2 bg-[#6366F1]/10 text-[#6366F1] rounded-lg hover:bg-[#6366F1]/20 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            <span>Zurück zum Shop</span>
          </Link>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 mt-12">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64 mt-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]"></div>
          </div>
        ) : !product ? (
          <div className="bg-gray-800 rounded-lg shadow p-6 text-center mt-12">
            <p className="text-gray-300">Produkt nicht gefunden.</p>
          </div>
        ) : (
          <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden mt-12">
            <div className="md:flex">
              {/* Produkt-Bilder */}
              <div className="md:w-1/2 relative">
                <div className="relative h-96 w-full">
                  <Image
                    src={product.images && product.images.length > 0 
                      ? (product.images[currentImageIndex] || '/images/placeholder.jpg') 
                      : '/images/placeholder.jpg'}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      console.error('Bild konnte nicht geladen werden:', product.images?.[currentImageIndex]);
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                    }}
                    className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    unoptimized={true}
                    priority={true}
                    key={`product-image-${product.id}-${currentImageIndex}`}
                  />
                </div>
                
                {product.images && product.images.length > 1 && (
                  <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-4">
                    <button
                      onClick={prevImage}
                      className="bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 text-white"
                    >
                      &lt;
                    </button>
                    <button
                      onClick={nextImage}
                      className="bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 text-white"
                    >
                      &gt;
                    </button>
                  </div>
                )}
                
                {product.images && product.images.length > 1 && (
                  <div className="flex justify-center mt-2 space-x-2 p-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 w-2 rounded-full ${
                          index === currentImageIndex ? 'bg-[#6366F1]' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Produkt-Details */}
              <div className="md:w-1/2 p-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
                  <div className="flex space-x-2">
                    {product.isPopular && (
                      <span className="bg-yellow-900/30 text-yellow-300 text-xs font-medium px-2.5 py-0.5 rounded">
                        Beliebt
                      </span>
                    )}
                    {product.isPremium && (
                      <span className="bg-purple-900/30 text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-2xl font-bold text-[#6366F1] mb-4">
                  {product.price.toFixed(2)} €
                </p>
                
                <div className="mb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                
                {product.longDescription && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Beschreibung</h2>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {product.longDescription}
                    </p>
                  </div>
                )}
                
                {product.features && product.features.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Features</h2>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-8">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#6366F1] hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                  >
                    In den Warenkorb
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ShopLayout>
  );
} 