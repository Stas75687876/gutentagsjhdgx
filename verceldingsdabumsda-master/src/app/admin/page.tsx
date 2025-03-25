'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const [initializingDb, setInitializingDb] = React.useState(false);
  const [dbInitialized, setDbInitialized] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    // Automatische Weiterleitung zum Dashboard (nach kurzer Verzögerung)
    const timeoutId = setTimeout(() => {
      router.push('/admin/dashboard');
    }, 3000);
    
    return () => clearTimeout(timeoutId);
  }, [router]);

  const initializeProducts = async () => {
    setInitializingDb(true);
    setError(null);
    
    try {
      // Demo-Produkte
      const products = [
        {
          name: 'Basic Website',
          description: 'Perfekt für kleine Unternehmen und Selbstständige. Eine einfache aber effektive Website mit allen Grundfunktionen.',
          price: 499,
          images: ['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80'],
          features: [
            'Responsive Design',
            'Bis zu 5 Seiten',
            'Kontaktformular',
            'SEO-Grundlagen',
            '1 Monat Support'
          ],
          isPopular: true,
          isPremium: false
        },
        {
          name: 'Business Website',
          description: 'Ideal für wachsende Unternehmen. Eine professionelle Website mit erweiterten Funktionen und CMS-Integration.',
          price: 999,
          images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80'],
          features: [
            'Alles aus Basic',
            'Bis zu 15 Seiten',
            'Content Management System',
            'Blog-Integration',
            'Erweiterte SEO-Optimierung',
            '3 Monate Support'
          ],
          isPopular: false,
          isPremium: false
        },
        {
          name: 'Premium E-Commerce',
          description: 'Die komplette E-Commerce-Lösung für Ihr Online-Geschäft. Vollständiger Online-Shop mit Zahlungsintegration.',
          price: 1999,
          images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80'],
          features: [
            'Alles aus Business',
            'Unbegrenzte Produktseiten',
            'Online-Shop mit Warenkorb',
            'Zahlungsintegration',
            'Kundenverwaltung',
            'Analytics-Integration',
            '12 Monate Support'
          ],
          isPopular: false,
          isPremium: true
        }
      ];
      
      // Produkte nacheinander in die Datenbank einfügen
      for (const product of products) {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Produkte konnten nicht initialisiert werden');
        }
      }
      
      setDbInitialized(true);
      
      // Kurze Verzögerung, dann zum Dashboard navigieren
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Fehler bei der Initialisierung:', err);
      setError(err.message || 'Fehler bei der Datenbankinitialisierung');
    } finally {
      setInitializingDb(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin-Bereich</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
            {error}
          </div>
        )}
        
        {dbInitialized ? (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
            Datenbank erfolgreich initialisiert! Sie werden weitergeleitet...
          </div>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Sie werden zum Admin-Dashboard weitergeleitet...
            </p>
            
            <div className="flex flex-col space-y-4">
              <Link
                href="/admin/dashboard"
                className="inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Direkt zum Dashboard
              </Link>
              
              <button
                onClick={initializeProducts}
                disabled={initializingDb}
                className="inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {initializingDb ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                    Initialisiere Datenbank...
                  </>
                ) : (
                  'Demo-Produkte initialisieren'
                )}
              </button>
              
              <Link
                href="/"
                className="inline-flex justify-center items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Zurück zur Website
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 