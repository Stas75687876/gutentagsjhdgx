import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

// Überprüfe den Stripe-Schlüssel
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('ACHTUNG: STRIPE_SECRET_KEY ist nicht in der Umgebung definiert!');
}

// Optimierte Stripe-Konfiguration für Live-Schlüssel
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Neueste stabile API-Version
  typescript: true,
});

const prisma = new PrismaClient();

// Um raw body in Next.js 14 zu bekommen, müssen wir die richtige Konfiguration verwenden
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
// Die alte config wird nicht mehr unterstützt in Next.js 14 App Router

// POST /api/webhook - Stripe-Webhook empfangen
export async function POST(req: Request) {
  const body = await req.text();
  
  // Zugriff auf Header in Next.js App Router
  const headersList = headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Fehlende Stripe-Signatur' },
      { status: 400 }
    );
  }
  
  let event: Stripe.Event;
  
  try {
    // Verifiziere die Signatur mit dem Webhook-Secret
    // Prüfe, ob ein Webhook-Secret konfiguriert ist
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.warn('⚠️ STRIPE_WEBHOOK_SECRET ist nicht konfiguriert. Verwende Standard-Test-Secret.');
    }
    
    // Verwende das konfigurierte Secret oder ein Test-Secret
    const secretToUse = webhookSecret || 'whsec_test';
    
    event = stripe.webhooks.constructEvent(body, signature, secretToUse);
    console.log('✅ Webhook-Signatur verifiziert');
  } catch (err: any) {
    console.error(`❌ Webhook-Fehler: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook-Fehler: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    // Verarbeite verschiedene Event-Typen
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Finde und aktualisiere die Bestellung in der Datenbank
        if (session.metadata?.orderId) {
          await prisma.order.update({
            where: { id: session.metadata.orderId },
            data: { 
              status: 'PAID',
            },
          });
          
          console.log(`🎉 Zahlung für Bestellung ${session.metadata.orderId} erfolgreich`);
        }
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`❌ Zahlung fehlgeschlagen: ${paymentIntent.id}`);
        break;
      }
      
      default:
        // Unbekanntes Event ignorieren
        console.log(`Unbekanntes Stripe-Event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Fehler bei der Webhook-Verarbeitung:', error);
    return NextResponse.json(
      { error: `Fehler bei der Webhook-Verarbeitung: ${error.message}` },
      { status: 500 }
    );
  }
} 