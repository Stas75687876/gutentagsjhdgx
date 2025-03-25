'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../components/shop/CartProvider';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CartItem } from '../../components/shop/CartProvider';
import { loadStripe } from '@stripe/stripe-js';

// Typ-Definitionen für die Zahlungsmethode
interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// Typ-Definitionen für das Formular
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, totalPrice } = useCart();
  const [formData, setFormData] = React.useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'DE',
    notes: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [availablePaymentMethods, setAvailablePaymentMethods] = React.useState<string[]>(['card']);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string>('card');
  
  // Zahlungsmethoden-Icons und Namen mit ihren IDs
  const paymentMethodsData: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Kreditkarte',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-blue-600 dark:text-blue-400">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      )
    },
    {
      id: 'klarna',
      name: 'Klarna',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-pink-600 dark:text-pink-400">
          <path d="M6 9h12" />
          <path d="M6 12h12" />
          <path d="M6 15h12" />
          <path d="M2 8v8a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2z" />
        </svg>
      )
    },
    {
      id: 'revolut_pay',
      name: 'Revolut Pay',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-purple-600 dark:text-purple-400">
          <path d="M3.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
          <path d="M14 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
          <path d="M3.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
          <path d="M14 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
          <path d="M20.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
          <path d="M20.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0-3Z" />
        </svg>
      )
    },
    {
      id: 'alipay',
      name: 'Alipay',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-blue-500 dark:text-blue-400">
          <path d="M9 13h6m-3-3v6M7 7H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3m10 0h3a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-3" />
        </svg>
      )
    },
    {
      id: 'bancontact',
      name: 'Bancontact',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-yellow-600 dark:text-yellow-400">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M7 15h0M2 9.5h20" />
        </svg>
      )
    },
    {
      id: 'eps',
      name: 'EPS',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-red-600 dark:text-red-400">
          <path d="M21 12H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1Z" />
          <path d="M7 12V6a7 7 0 0 1 10 0v6" />
        </svg>
      )
    },
    {
      id: 'link',
      name: 'Link',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-green-600 dark:text-green-400">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      )
    },
    {
      id: 'p24',
      name: 'Przelewy24',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-indigo-600 dark:text-indigo-400">
          <path d="M18.5 5.5 5.5 18.5" />
          <path d="M5.5 5.5v13h13" />
        </svg>
      )
    },
    {
      id: 'acss_debit',
      name: 'ACH-Lastschrift',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-gray-800 dark:text-gray-200">
          <path d="M8 9h8" />
          <path d="M8 13h6" />
          <path d="M18 16.5a2.5 2.5 0 1 1-5 0v-1.5h5v1.5z" />
          <rect width="16" height="16" x="4" y="5" rx="2" />
        </svg>
      )
    },
    {
      id: 'blik',
      name: 'BLIK',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-blue-600 dark:text-blue-400">
          <path d="M4 11h16" />
          <rect width="20" height="14" x="2" y="7" rx="2" />
          <circle cx="12" cy="15" r="2" />
        </svg>
      )
    },
    {
      id: 'ideal',
      name: 'iDEAL',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-green-500 dark:text-green-400">
          <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          <path d="M12 8.5V12h3.5" />
          <path d="M8 16h0" />
        </svg>
      )
    },
    {
      id: 'giropay',
      name: 'giropay',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-blue-800 dark:text-blue-300">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
          <path d="M6 15h4" />
          <path d="M12 15h6" />
        </svg>
      )
    },
    {
      id: 'sepa_debit',
      name: 'SEPA-Lastschrift',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-blue-700 dark:text-blue-300">
          <path d="M8 9h8" />
          <path d="M8 13h10" />
          <path d="M11 17h5" />
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        </svg>
      )
    },
    {
      id: 'sofort',
      name: 'Sofort',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1 text-teal-600 dark:text-teal-400">
          <path d="M5 7h14" />
          <path d="M5 12h14" />
          <path d="M5 17h10" />
          <path d="M19 17h.01" />
        </svg>
      )
    }
  ];

  React.useEffect(() => {
    // Leerer Warenkorb, zur Startseite zurückleiten
    if (cart.length === 0) {
      router.push('/');
      return;
    }
    
    // Verfügbare Zahlungsmethoden vom Server abrufen
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('/api/stripe/available-payment-methods');
        if (response.ok) {
          const data = await response.json();
          setAvailablePaymentMethods(data.availablePaymentMethods);
          console.log('Verfügbare Zahlungsmethoden:', data.availablePaymentMethods);
        } else {
          console.error('Fehler beim Abrufen der Zahlungsmethoden');
          setAvailablePaymentMethods(['card']); // Fallback zu Kreditkarte
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Zahlungsmethoden:', error);
        setAvailablePaymentMethods(['card']); // Fallback zu Kreditkarte
      }
    };
    
    fetchPaymentMethods();
  }, [cart, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validiere das Bild-URL für jeden Artikel im Warenkorb
      const cartItemsWithValidImages = cart.map((item: CartItem) => {
        let validImage = item.image;
        
        // Wenn ein Bild vorhanden ist, validiere es
        if (item.image) {
          try {
            const url = new URL(item.image);
            // Stelle sicher, dass es eine HTTPS-URL ist
            if (url.protocol !== 'https:') {
              console.warn(`Bild-URL muss https sein: ${item.image}`);
              validImage = undefined;
            }
          } catch (e) {
            console.warn(`Ungültige Bild-URL: ${item.image}`);
            validImage = undefined;
          }
        }
        
        return {
          ...item,
          image: validImage
        };
      });
      
      // Bereite Kundeninformationen vor
      const customerInfo = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        notes: formData.notes
      };
      
      // Erstelle die Checkout-Session mit den validierten Bildern
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItemsWithValidImages,
          customerInfo: customerInfo,
          paymentMethod: selectedPaymentMethod,
          successUrl: window.location.origin + '/checkout/success',
          cancelUrl: window.location.origin + '/checkout/cancel',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler bei der Checkout-Verarbeitung');
      }

      // Wenn alles erfolgreich war, zum Stripe Checkout weiterleiten
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Checkout-Fehler:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtere die Zahlungsmethoden nach den verfügbaren
  const filteredPaymentMethods = paymentMethodsData.filter(method => 
    availablePaymentMethods.includes(method.id)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white"
      >
        Checkout
      </motion.h1>
      
      {cart.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Ihr Warenkorb ist leer</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Fügen Sie Produkte hinzu, um fortzufahren.</p>
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300">
            Zurück zum Shop
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Zusammenfassung des Warenkorbs */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white pb-2 border-b dark:border-gray-700">Bestellübersicht</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item: CartItem) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    {item.image && (
                      <div className="relative w-12 h-12 rounded-md overflow-hidden mr-4 bg-gray-100 dark:bg-gray-700">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Menge: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium dark:text-white">
                    {(item.price * item.quantity).toFixed(2)}€
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-300">Zwischensumme</span>
                <span className="font-medium dark:text-white">{totalPrice.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-300">Versandkosten</span>
                <span className="font-medium dark:text-white">{0.00.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="dark:text-white">Gesamtsumme</span>
                <span className="dark:text-white">{totalPrice.toFixed(2)}€</span>
              </div>
            </div>
          </motion.div>
          
          {/* Checkout-Formular */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white pb-2 border-b dark:border-gray-700">Persönliche Daten</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vorname</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nachname</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-Mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label htmlFor="postal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PLZ</label>
                    <input
                      type="text"
                      id="postal"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stadt</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                    />
                  </div>
                </div>
              
                <div className="bg-white dark:bg-gray-800 rounded-lg mt-8">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white pb-2 border-b dark:border-gray-700">Zahlungsmethoden</h2>
                  
                  {loading ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-500 dark:text-red-400">
                      {error}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                      {filteredPaymentMethods.map((method) => {
                        const isAvailable = availablePaymentMethods.includes(method.id);
                        return isAvailable && (
                          <div
                            key={method.id}
                            className={`relative border rounded-lg p-3 cursor-pointer transition-all ${
                              selectedPaymentMethod === method.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                          >
                            <div className="flex flex-col items-center h-full">
                              <div className="h-8 w-12 flex items-center justify-center mb-2">
                                {method.icon}
                              </div>
                              <span className="text-sm text-center dark:text-gray-300">{method.name}</span>
                              {selectedPaymentMethod === method.id && (
                                <div className="absolute top-2 right-2">
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5 text-blue-500 dark:text-blue-400" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path 
                                      fillRule="evenodd" 
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                      clipRule="evenodd" 
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors duration-300
                      ${loading 
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                      }`}
                  >
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verarbeite...
                      </div>
                    ) : (
                      'Jetzt bezahlen'
                    )}
                  </button>
                </div>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
                    {error}
                  </div>
                )}
              </form>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-600 dark:text-gray-300">Sichere Bezahlung durch Stripe</p>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-600 dark:text-gray-300">Ihre Daten werden verschlüsselt übertragen</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 