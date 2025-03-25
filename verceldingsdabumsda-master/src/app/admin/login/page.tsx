'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Bitte gib deine E-Mail-Adresse und dein Passwort ein.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError('Ungültige Anmeldedaten. Bitte versuche es erneut.');
        setLoading(false);
        return;
      }
      
      // Bei erfolgreicher Anmeldung zum Dashboard weiterleiten
      router.push('/admin/dashboard');
    } catch (error) {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-24 h-24 relative mx-auto">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={96} 
                height={96} 
                className="rounded-full border-4 border-blue-500 p-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgOC4yNUM5Ljk0IDguMjUgOC4yNSA5Ljk0IDguMjUgMTJDOC4yNSAxNC4wNiA5Ljk0IDE1Ljc1IDEyIDE1Ljc1QzE0LjA2IDE1Ljc1IDE1Ljc1IDE0LjA2IDE1Ljc1IDEyQzE1Ljc1IDkuOTQgMTQuMDYgOC4yNSAxMiA4LjI1Wk0yMC43MSAxMy42OEMyMC4zMiAxMy4zMyAxOS42OCAxMi45IDE5LjY4IDEyQzE5LjY4IDExLjEgMjAuMzIgMTAuNjcgMjAuNzEgMTAuMzJDMjAuOTkgMTAuMDggMjEuMSA5LjcgMjAuOTYgOS4zNkMyMC42NCA4LjQ2IDIwLjE1IDcuNjMgMTkuNTMgNi45MUMxOS4yOSA2LjYzIDE4Ljg5IDYuNTMgMTguNTIgNi43M0MxOC4xMiA2Ljk3IDE3LjU2IDcuMjQgMTYuNzMgNi45NUMxNS45IDYuNjggMTUuNjQgNi4wNyAxNS40MyA1LjY1QzE1LjIxIDUuMjQgMTQuOTcgNS4wMyAxNC41IDUuMDNDMTMuNTQgNC43NSAxMi41MiA0Ljc1IDExLjU2IDUuMDNDMTEuMDkgNS4wMyAxMC44NSA1LjI0IDEwLjYzIDUuNjVDMTAuNDMgNi4wNyAxMC4xNiA2LjY4IDkuMzMgNi45NUM4LjUgNy4yNCA3Ljk0IDYuOTcgNy41NCA2LjczQzcuMTcgNi41MyA2Ljc3IDYuNjMgNi41MyA2LjkxQzUuODMgNy42MyA1LjM0IDguNDggNS4wNCA5LjM2QzQuOSA5LjcgNS4wMSAxMC4wOCA1LjI5IDEwLjMyQzUuNjggMTAuNjcgNi4zMiAxMS4xIDYuMzIgMTJDNi4zMiAxMi45IDUuNjggMTMuMzMgNS4yOSAxMy42OEM1LjAxIDEzLjkyIDQuOSAxNC4zIDUuMDQgMTQuNjRDNS4zNiAxNS41NCA1Ljg1IDE2LjM3IDYuNDcgMTcuMDlDNi43MSAxNy4zNyA3LjExIDE3LjQ3IDcuNDggMTcuMjdDNy44OCAxNy4wMyA4LjQ0IDE2Ljc2IDkuMjcgMTcuMDVDMTAuMSAxNy4zMiAxMC4zNiAxNy45MyAxMC41NyAxOC4zNUMxMC43OSAxOC43NiAxMS4wMyAxOC45NyAxMS41IDE4Ljk3QzEyLjQ2IDE5LjI1IDEzLjQ4IDE5LjI1IDE0LjQ0IDE4Ljk3QzE0LjkxIDE4Ljk3IDE1LjE1IDE4Ljc2IDE1LjM3IDE4LjM1QzE1LjU3IDE3LjkzIDE1Ljg0IDE3LjMyIDE2LjY3IDE3LjA1QzE3LjUgMTYuNzYgMTguMDYgMTcuMDMgMTguNDYgMTcuMjdDMTguODMgMTcuNDcgMTkuMjMgMTcuMzcgMTkuNDcgMTcuMDlDMjAuMTcgMTYuMzcgMjAuNjYgMTUuNTIgMjAuOTYgMTQuNjRDMjEuMSAxNC4zIDIwLjk5IDEzLjkyIDIwLjcxIDEzLjY4WiIgZmlsbD0iIzNiODJmNiIvPjwvc3ZnPg==';
                }}
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin-Bereich</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Melde dich an, um auf den Admin-Bereich zuzugreifen</p>
        </div>
        
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Passwort
              </label>
              <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Passwort vergessen?
              </a>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
              required
            />
          </div>
          
          {/* Demo-Anmeldung Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@example.com');
                setPassword('admin1234');
              }}
              className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              Demo: Admin-Anmeldedaten ausfüllen
            </button>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Anmelden...
              </div>
            ) : (
              'Anmelden'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Zurück zur Website
          </Link>
        </div>
      </div>
    </div>
  );
} 