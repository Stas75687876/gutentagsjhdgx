import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    const hasPublicKey = !!process.env.STRIPE_PUBLIC_KEY;
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    let error: string | null = null;
    let stripeMode = "undefined";

    console.log('Überprüfe Stripe-Konfiguration...');
    console.log(`- Public Key: ${hasPublicKey ? 'Vorhanden' : 'Fehlt'}`);
    console.log(`- Secret Key: ${hasSecretKey ? 'Vorhanden' : 'Fehlt'}`);

    if (hasPublicKey) {
      // Überprüfe, ob es sich um einen Live- oder Test-Schlüssel handelt
      const pkPrefix = process.env.STRIPE_PUBLIC_KEY!.substring(0, 3);
      stripeMode = pkPrefix === 'pk_' 
        ? (process.env.STRIPE_PUBLIC_KEY!.startsWith('pk_test_') ? 'TEST' : 'LIVE')
        : 'UNGÜLTIG';
      
      console.log(`- Stripe-Modus: ${stripeMode}`);
    }

    if (!hasSecretKey) {
      return NextResponse.json({
        hasPublicKey,
        hasSecretKey,
        stripeMode,
        error: 'Stripe Secret Key fehlt'
      });
    }

    // Teste die Verbindung zu Stripe
    try {
      console.log('Testen der Stripe-Verbindung...');
      
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2023-10-16', // Neueste stabile API-Version
        typescript: true,
      });
      
      // Einfache API-Anfrage zum Testen
      const result = await stripe.paymentMethods.list({ limit: 1 });
      console.log(`✅ Stripe-Verbindung erfolgreich (${result.data.length} Zahlungsmethoden gefunden)`);
    } catch (err: any) {
      console.error('❌ Stripe Verbindungsfehler:', err);
      error = `Stripe API-Fehler: ${err.message}`;
    }

    return NextResponse.json({
      hasPublicKey,
      hasSecretKey,
      stripeMode,
      publicKeyPrefix: hasPublicKey ? process.env.STRIPE_PUBLIC_KEY!.substring(0, 7) + '...' : null,
      error
    });
  } catch (err: any) {
    console.error('Interner Server-Fehler:', err);
    return NextResponse.json(
      { error: err.message || 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
} 