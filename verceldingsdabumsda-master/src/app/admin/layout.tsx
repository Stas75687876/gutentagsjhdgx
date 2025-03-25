'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import AdminAuthCheck from './components/AdminAuthCheck';
import AdminNavbar from './components/AdminNavbar';
import AdminSidebar from './components/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SessionProvider>
      <AdminAuthCheck>
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
          <AdminNavbar />
          <div className="flex flex-1">
            <AdminSidebar />
            <main className="flex-1 p-6 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </AdminAuthCheck>
    </SessionProvider>
  );
} 