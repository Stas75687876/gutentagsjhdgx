'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Icons
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  Home,
  LogOut
} from 'lucide-react';

// Prop-Definition für AdminSidebar
interface AdminSidebarProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

const navItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Produkte',
    href: '/admin/products',
    icon: ShoppingBag
  },
  {
    name: 'Kunden',
    href: '/admin/customers',
    icon: Users
  },
  {
    name: 'Bestellungen',
    href: '/admin/orders',
    icon: FileText
  },
  {
    name: 'Einstellungen',
    href: '/admin/settings',
    icon: Settings
  }
];

export default function AdminSidebar({ isOpen = false, toggleSidebar }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`h-full ${isOpen ? 'fixed inset-y-0 left-0 z-40 md:relative' : 'hidden md:block'} w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all`}>
      {/* Mobile Close Button - nur anzeigen wenn Sidebar geöffnet ist */}
      {isOpen && (
        <button
          className="absolute right-4 top-4 md:hidden"
          onClick={toggleSidebar}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      {/* Logo und Überschrift */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
        <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Admin-Bereich
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
              `}
            >
              <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer-Links */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Link
          href="/"
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Home className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
          Zur Website
        </Link>

        <button
          onClick={() => {
            // Hier später die Logout-Funktion implementieren
            console.log('Logout');
          }}
          className="w-full flex items-center px-4 py-2 mt-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
          Abmelden
        </button>
      </div>
    </div>
  );
} 