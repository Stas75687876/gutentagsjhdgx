'use client';

import React from 'react';

export default function Debug() {
  const [stripeInfo, setStripeInfo] = React.useState<{
    publicKey: string | null;
    hasSecretKey: boolean;
    stripeMode: string | null;
    error: string | null;
  }>({
    publicKey: null,
    hasSecretKey: false,
    stripeMode: null,
    error: null
  });

  React.useEffect(() => {
    const checkStripeConfig = async () => {
      try {
        // Prüfe, ob Stripe-Keys verfügbar sind
        // Wir prüfen beide möglichen Variablennamen, da es unterschiedliche Konventionen gibt
        const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || 
                         process.env.STRIPE_PUBLIC_KEY || null;
        
        setStripeInfo({
          publicKey: publicKey ? `${publicKey.substring(0, 8)}...` : null,
          hasSecretKey: false, // Kann clientseitig nicht geprüft werden
          stripeMode: publicKey?.startsWith('pk_live_') ? 'LIVE' : (publicKey?.startsWith('pk_test_') ? 'TEST' : null),
          error: null
        });

        // Prüfe Verbindung zu Stripe mit der Backend-API
        console.log('Überprüfe Stripe-Konfiguration vom Backend...');
        const response = await fetch('/api/stripe/check', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStripeInfo(prev => ({
            ...prev,
            hasSecretKey: data.hasSecretKey,
            stripeMode: data.stripeMode || prev.stripeMode,
            error: data.error
          }));
        }
      } catch (err: any) {
        console.error('Debug-Fehler:', err);
        setStripeInfo(prev => ({
          ...prev,
          error: err.message
        }));
      }
    };

    checkStripeConfig();
  }, []);

  if (process.env.NODE_ENV === 'production') return null;

  const isConfigValid = stripeInfo.publicKey && stripeInfo.hasSecretKey && !stripeInfo.error;
  const bgColor = isConfigValid 
    ? 'bg-green-900/80' 
    : (stripeInfo.error ? 'bg-red-900/80' : 'bg-black/80');

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white p-3 rounded-lg text-xs z-50 max-w-[300px]`}>
      <h3 className="font-bold mb-1">Stripe Debug-Info</h3>
      <div className="space-y-1">
        <p>Public Key: {stripeInfo.publicKey || 'Nicht gefunden'}</p>
        <p>Secret Key: {stripeInfo.hasSecretKey ? 'Vorhanden' : 'Nicht gefunden'}</p>
        {stripeInfo.stripeMode && (
          <p>Modus: <span className={stripeInfo.stripeMode === 'LIVE' ? 'text-green-400 font-bold' : 'text-yellow-400'}>
            {stripeInfo.stripeMode}
          </span></p>
        )}
        {stripeInfo.error && (
          <p className="text-red-400">Fehler: {stripeInfo.error}</p>
        )}
      </div>
      
      {isConfigValid ? (
        <div className="mt-2 pt-2 border-t border-white/20 text-green-300">
          <p>✅ Stripe-Konfiguration korrekt</p>
          {stripeInfo.stripeMode === 'LIVE' ? (
            <p className="mt-1 text-yellow-300">Live-Modus: Echte Zahlungen werden verarbeitet!</p>
          ) : (
            <p className="mt-1">Testkarte: 4242 4242 4242 4242</p>
          )}
        </div>
      ) : (
        <div className="mt-2 pt-2 border-t border-white/20 text-yellow-400">
          <p>⚠️ Stripe-Konfiguration unvollständig</p>
          <p className="text-gray-300 mt-1">Überprüfe die API-Schlüssel in der .env-Datei</p>
        </div>
      )}
    </div>
  );
} 