'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminAuthCheckProps {
  children: React.ReactNode;
}

export default function AdminAuthCheck({ children }: AdminAuthCheckProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  // Debug-Modus für die Entwicklung (auf false setzen für Produktion)
  const isDevMode = true;
  
  React.useEffect(() => {
    console.log('AdminAuthCheck:', { 
      status, 
      pathname, 
      isDevMode,
      session: session ? 'Vorhanden' : 'Nicht vorhanden'
    });
    
    if (isDevMode) {
      // In der Entwicklung erlauben wir den Zugriff ohne Authentifizierung
      return;
    }
    
    // Wenn nicht angemeldet und nicht auf der Login-Seite, zur Login-Seite weiterleiten
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      console.log('Weiterleitung zur Login-Seite');
      router.push('/admin/login');
    }
    
    // Wenn angemeldet und auf der Login-Seite, zum Dashboard weiterleiten
    if (status === 'authenticated' && pathname === '/admin/login') {
      console.log('Weiterleitung zum Dashboard');
      router.push('/admin/dashboard');
    }
  }, [status, router, pathname, session]);
  
  // Auf Login-Seite Kinder direkt anzeigen
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // Im Entwicklungsmodus immer die Kinder anzeigen
  if (isDevMode) {
    return <>{children}</>;
  }
  
  // Wenn wir gerade laden, zeigen wir eine Lade-Animation
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Wenn nicht authentifiziert und nicht auf Login-Seite, nichts anzeigen (wird weitergeleitet)
  if (status === 'unauthenticated' && pathname !== '/admin/login') {
    return null;
  }
  
  // Wenn authentifiziert, Kinder rendern
  return <>{children}</>;
} 