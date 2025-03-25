import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In einer echten Anwendung müssten wir hier die Authentifizierung prüfen
  // und nicht authentifizierte Benutzer umleiten
  const isAuthenticated = true; // Dies sollte durch einen echten Auth-Check ersetzt werden
  
  if (!isAuthenticated) {
    redirect('/panel/login');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link 
                href="/panel" 
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/panel/products" 
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
              >
                Produkte
              </Link>
            </li>
            <li>
              <Link 
                href="/panel/orders" 
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
              >
                Bestellungen
              </Link>
            </li>
            <li>
              <Link 
                href="/panel/analytics" 
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
              >
                Analysen
              </Link>
            </li>
            <li>
              <Link 
                href="/panel/settings" 
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
              >
                Einstellungen
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 