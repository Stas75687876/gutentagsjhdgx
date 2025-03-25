'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';

// Dynamisches Laden der Icons mit No-SSR, um Hydration-Fehler zu vermeiden
const Menu = dynamic(() => import('lucide-react').then(mod => mod.Menu), { ssr: false });
const Bell = dynamic(() => import('lucide-react').then(mod => mod.Bell), { ssr: false });
const Sun = dynamic(() => import('lucide-react').then(mod => mod.Sun), { ssr: false });
const Moon = dynamic(() => import('lucide-react').then(mod => mod.Moon), { ssr: false });

interface AdminNavbarProps {
  toggleSidebar?: () => void;
}

export default function AdminNavbar({ toggleSidebar }: AdminNavbarProps) {
  const { theme, setTheme } = useTheme();
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Nur clientseitig rendern, um Hydration-Fehler zu vermeiden
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Während des ersten Renderns auf dem Server nichts anzeigen, was vom Client abweichen könnte
  if (!mounted) {
    return (
      <div className="sticky top-0 z-30 flex h-16 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between w-full px-4">
          {/* Platzhalter für SSR */}
        </div>
      </div>
    );
  }
  
  return (
    <div className="sticky top-0 z-30 flex h-16 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between w-full px-4">
        {/* Linke Seite - Logo und Toggle */}
        <div className="flex items-center">
          {toggleSidebar && (
            <button 
              onClick={toggleSidebar}
              className="p-2 mr-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
              aria-label="Seitenleiste umschalten"
            >
              <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          )}
          
          <Link href="/admin/dashboard" className="flex items-center">
            <span className="sr-only">Admin Dashboard</span>
            <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text hidden md:block">
              Admin Dashboard
            </span>
          </Link>
        </div>
        
        {/* Rechte Seite - Aktionen */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            aria-label="Theme umschalten"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {/* Benachrichtigungen */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none relative"
              aria-label="Benachrichtigungen"
            >
              <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Benachrichtigungen</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-start">
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Neue Bestellung</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Bestellung #1234 wurde soeben aufgegeben.</p>
                        <p className="mt-1 text-xs text-gray-400">vor 5 Minuten</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-start">
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Neuer Kundenkommentar</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Max Mustermann hat einen Kommentar hinterlassen.</p>
                        <p className="mt-1 text-xs text-gray-400">vor 1 Stunde</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center">
                  <button 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setIsNotificationsOpen(false)}
                  >
                    Alle Benachrichtigungen
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Benutzer-Avatar */}
          <div className="relative">
            <button
              className="flex items-center text-sm rounded-full focus:outline-none"
              aria-label="Benutzerprofil"
            >
              <span className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300">
                A
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 