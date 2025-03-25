import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Überprüfe den Stripe-Schlüssel
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('ACHTUNG: STRIPE_SECRET_KEY ist nicht in der Umgebung definiert!');
}

// Optimierte Stripe-Konfiguration für Live-Schlüssel
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Neueste stabile API-Version
  typescript: true,
});

// Funktion zum Abrufen der verfügbaren Zahlungsmethoden
async function getAvailablePaymentMethods() {
  try {
    // Standardwährung für den Shop
    const defaultCurrency = 'eur';
    
    // Liste der Zahlungsmethoden mit ihren unterstützten Währungen
    const paymentMethodCurrencies: Record<string, string[]> = {
      'card': ['eur', 'usd', 'gbp', 'pln', 'chf'],
      'klarna': ['eur', 'usd', 'gbp', 'dkk', 'nok', 'sek'],
      'revolut_pay': ['eur', 'usd', 'gbp'],
      'alipay': ['eur', 'usd', 'gbp', 'cny'],
      'bancontact': ['eur'],
      'eps': ['eur'],
      'link': ['eur', 'usd'],
      'p24': ['eur', 'pln'],
      'acss_debit': ['cad', 'usd'],
      'blik': ['pln'], // BLIK unterstützt nur PLN
      'ideal': ['eur'],
      'giropay': ['eur'],
      'sepa_debit': ['eur'],
      'sofort': ['eur']
    };
    
    // Rufe die Account-Einstellungen von Stripe ab
    const account = await stripe.accounts.retrieve();
    
    // Hole die aktivierten Zahlungsmethoden für dieses Konto
    const capabilities = account.capabilities || {};
    
    // Liste der zu überprüfenden Zahlungsmethoden
    const supportedPaymentMethods = [
      'card', // Kreditkarte ist immer verfügbar
      'klarna',
      'revolut_pay',
      'alipay',
      'bancontact',
      'eps',
      'link',
      'p24',
      'acss_debit',
      'blik',
      'ideal',
      'giropay',
      'sepa_debit',
      'sofort'
    ];
    
    // Filtere die Zahlungsmethoden basierend auf den Capabilities und Währungskompatibilität
    const availablePaymentMethods = supportedPaymentMethods.filter(method => {
      // Überprüfe, ob die Methode die Standardwährung unterstützt
      const supportedCurrencies = paymentMethodCurrencies[method] || [];
      const supportsDefaultCurrency = supportedCurrencies.includes(defaultCurrency);
      
      if (!supportsDefaultCurrency) {
        console.log(`Zahlungsmethode ${method} wird übersprungen, da sie EUR nicht unterstützt`);
        return false;
      }
      
      // Card ist immer verfügbar
      if (method === 'card') return true;
      
      // Überprüfe, ob die Methode in den Capabilities aktiviert ist
      const capability = `${method}_payments` as keyof typeof capabilities;
      const isActive = capabilities[capability] === 'active';
      
      if (!isActive) {
        console.log(`Zahlungsmethode ${method} wird übersprungen, da sie nicht aktiviert ist`);
      }
      
      return isActive;
    });
    
    console.log('Verfügbare EUR-kompatible Zahlungsmethoden:', availablePaymentMethods);
    return availablePaymentMethods;
  } catch (error) {
    console.error('Fehler beim Abrufen der verfügbaren Zahlungsmethoden:', error);
    // Bei einem Fehler geben wir zumindest die Kreditkartenzahlung zurück
    return ['card'];
  }
}

// POST-Methode für den Checkout-Prozess
export async function POST(request: Request) {
  try {
    // Stripe-Schlüssel validieren
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe Secret Key ist nicht konfiguriert');
    }

    // Anfrage-Body parsen
    const body = await request.json();
    const { items, customerInfo, successUrl, cancelUrl, paymentMethod } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Keine Produkte im Warenkorb' }, { status: 400 });
    }

    // URLs validieren und korrigieren
    if (!successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Success- und Cancel-URLs sind erforderlich' },
        { status: 400 }
      );
    }

    // FIXED: Immer vollständige, absolute URLs verwenden und den Platzhalter korrekt setzen
    // Stripe erfordert absolute URLs mit korrekter Platzhalter-Syntax
    const formattedSuccessUrl = "https://ct-studio.store/checkout/success?session_id={CHECKOUT_SESSION_ID}";
    const formattedCancelUrl = "https://ct-studio.store/checkout/cancel";

    // Kundeninformationen validieren
    if (!customerInfo || !customerInfo.email || !customerInfo.name) {
      return NextResponse.json(
        { error: 'Kundendaten sind unvollständig' },
        { status: 400 }
      );
    }

    // Bereite die Line-Items für Stripe vor
    const lineItems = items.map((item: any) => {
      // Validierungslogik für Produkte hinzufügen
      if (!item.price || !item.name) {
        console.warn('Ungültiges Produkt übersprungen:', item);
        return null;
      }

      // Prüfe, ob ein Bild vorhanden ist und validiere es
      let validImageUrl = null;
      if (item.image) {
        try {
          const url = new URL(item.image);
          // Stelle sicher, dass das Bild eine https-URL ist (Stripe-Anforderung)
          if (url.protocol === 'https:') {
            validImageUrl = item.image;
          } else {
            console.warn(`Bild-URL muss https sein: ${item.image}`);
          }
        } catch (e) {
          console.warn(`Ungültige Bild-URL: ${item.image}`);
        }
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            description: item.description || '',
            images: validImageUrl ? [validImageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100), // Umrechnung in Cent
        },
        quantity: item.quantity,
      };
    })
    .filter((item: any): item is Exclude<typeof item, null> => item !== null); // Entferne ungültige Items
    
    // Überprüfen, ob noch gültige Line-Items vorhanden sind
    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: 'Keine gültigen Produkte im Warenkorb' },
        { status: 400 }
      );
    }

    console.log('Gültige Line-Items:', lineItems);
    console.log('Erstelle Stripe-Session mit:', {
      successUrl: formattedSuccessUrl,
      cancelUrl: formattedCancelUrl
    });

    // Verfügbare Zahlungsmethoden abrufen
    const availablePaymentMethods = await getAvailablePaymentMethods();
    
    // Wenn eine spezifische Zahlungsmethode ausgewählt wurde und diese verfügbar ist, 
    // nur diese verwenden, ansonsten alle verfügbaren Methoden anbieten
    const paymentMethodTypes = paymentMethod && availablePaymentMethods.includes(paymentMethod)
      ? [paymentMethod]
      : availablePaymentMethods;
    
    console.log('Verwendete Zahlungsmethoden:', paymentMethodTypes);

    // Checkout-Session erstellen
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      success_url: formattedSuccessUrl,
      cancel_url: formattedCancelUrl,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['DE', 'AT', 'CH'],
      },
      customer_email: customerInfo.email,
      metadata: {
        customer_name: customerInfo.name,
        customer_address: `${customerInfo.address}, ${customerInfo.postalCode} ${customerInfo.city}, ${customerInfo.country}`,
        notes: customerInfo.notes || '',
      },
      locale: 'de', // Deutsche Benutzeroberfläche für Stripe
      payment_intent_data: {
        description: 'Bestellung aus dem Online-Shop',
        capture_method: 'automatic',
      },
    });

    console.log('Stripe Session erstellt:', { 
      sessionId: session.id,
      url: session.url 
    });

    // Überprüfe, ob die URL vorhanden ist
    if (!session.url) {
      throw new Error('Stripe hat keine gültige Redirect-URL zurückgegeben');
    }

    // Prüfe, ob die URL ein gültiges Format hat
    try {
      new URL(session.url);
    } catch (err) {
      throw new Error('Die von Stripe zurückgegebene URL ist nicht gültig');
    }

    // Antwort mit der Checkout-URL zurückgeben
    return NextResponse.json({ url: session.url, sessionId: session.id });

  } catch (error: any) {
    console.error('Stripe Checkout Fehler:', error);
    
    // Ausführlicheres Protokollieren
    if (error.type === 'StripeInvalidRequestError') {
      console.error('Stripe ungültige Anfrage Details:', {
        code: error.code,
        param: error.param,
        detail: error.detail,
        statusCode: error.statusCode,
        message: error.message,
        raw: error.raw
      });
    }
    
    // Verbesserte Fehlerbehandlung mit detaillierteren Informationen
    let errorMessage = 'Unbekannter Fehler bei der Checkout-Verarbeitung';
    
    if (error instanceof Stripe.errors.StripeError) {
      // Handle spezifische Stripe-Fehler
      switch (error.type) {
        case 'StripeConnectionError':
          errorMessage = 'Verbindungsproblem mit Stripe. Bitte versuchen Sie es später erneut.';
          break;
        case 'StripeAPIError':
          errorMessage = 'Stripe API-Fehler. Bitte kontaktieren Sie den Support.';
          break;
        case 'StripeInvalidRequestError':
          // Bei URL-Problemen spezifischere Nachricht
          if (error.message.includes('Not a valid URL')) {
            errorMessage = 'Produktdaten enthalten ungültige URLs. Bitte prüfen Sie die Produktdaten.';
          } else if (error.message.includes('payment method type provided')) {
            errorMessage = 'Eine oder mehrere Zahlungsmethoden sind nicht aktiviert. Die verfügbaren Methoden werden jetzt automatisch erkannt.';
          } else {
            errorMessage = `Ungültige Anfrage an Stripe: ${error.message}`;
          }
          break;
        case 'StripeAuthenticationError':
          errorMessage = 'Authentifizierungsproblem mit Stripe. Bitte kontaktieren Sie den Support.';
          break;
        default:
          errorMessage = `Stripe-Fehler: ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: `Fehler bei der Checkout-Verarbeitung: ${errorMessage}` },
      { status: 500 }
    );
  }
} 