import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialisiere Stripe mit dem Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Liste der möglichen Zahlungsmethoden mit ihren unterstützten Währungen
const supportedPaymentMethods: { 
  id: string; 
  supportedCurrencies: string[]; 
}[] = [
  { id: 'card', supportedCurrencies: ['eur', 'usd', 'gbp', 'pln', 'chf'] }, // Kreditkarten unterstützen fast alle Währungen
  { id: 'klarna', supportedCurrencies: ['eur', 'usd', 'gbp', 'dkk', 'nok', 'sek'] },
  { id: 'revolut_pay', supportedCurrencies: ['eur', 'usd', 'gbp'] },
  { id: 'alipay', supportedCurrencies: ['eur', 'usd', 'gbp', 'cny'] },
  { id: 'bancontact', supportedCurrencies: ['eur'] },
  { id: 'eps', supportedCurrencies: ['eur'] },
  { id: 'link', supportedCurrencies: ['eur', 'usd'] },
  { id: 'p24', supportedCurrencies: ['eur', 'pln'] },
  { id: 'acss_debit', supportedCurrencies: ['cad', 'usd'] },
  { id: 'blik', supportedCurrencies: ['pln'] }, // BLIK unterstützt nur PLN
  { id: 'ideal', supportedCurrencies: ['eur'] },
  { id: 'giropay', supportedCurrencies: ['eur'] },
  { id: 'sepa_debit', supportedCurrencies: ['eur'] },
  { id: 'sofort', supportedCurrencies: ['eur'] },
  { id: 'affirm', supportedCurrencies: ['usd'] },
  { id: 'afterpay_clearpay', supportedCurrencies: ['eur', 'usd', 'gbp', 'aud', 'nzd', 'cad'] },
  { id: 'grabpay', supportedCurrencies: ['sgd', 'myr'] },
  { id: 'paypal', supportedCurrencies: ['eur', 'usd', 'gbp'] },
  { id: 'wechat_pay', supportedCurrencies: ['cny'] }
];

export async function GET() {
  try {
    // Standardwährung für den Shop
    const defaultCurrency = 'eur';
    
    // Rufe die Account-Einstellungen von Stripe ab
    const account = await stripe.accounts.retrieve();
    
    // Hole die aktivierten Zahlungsmethoden für dieses Konto
    const capabilities = account.capabilities || {};
    
    // Filtere die Zahlungsmethoden basierend auf den Capabilities und Währungs-Kompatibilität
    const availablePaymentMethods = supportedPaymentMethods
      .filter(method => {
        // Überprüfe, ob die Methode die Standardwährung unterstützt
        const supportsDefaultCurrency = method.supportedCurrencies.includes(defaultCurrency);
        if (!supportsDefaultCurrency) return false;
        
        // Card ist immer verfügbar
        if (method.id === 'card') return true;
        
        // Überprüfe, ob die Methode in den Capabilities aktiviert ist
        const capability = `${method.id}_payments` as keyof typeof capabilities;
        return capabilities[capability] === 'active';
      })
      .map(method => method.id);
    
    console.log('Verfügbare Zahlungsmethoden (EUR-kompatibel):', availablePaymentMethods);
    
    return NextResponse.json({ 
      availablePaymentMethods,
      accountCurrency: defaultCurrency,
      accountCountry: account.country,
      accountName: account.business_profile?.name || 'Stripe Account'
    });
  } catch (error: any) {
    console.error('Fehler beim Abrufen der verfügbaren Zahlungsmethoden:', error);
    
    // Fallback: Stelle sicher, dass mindestens 'card' verfügbar ist
    return NextResponse.json({ 
      availablePaymentMethods: ['card'],
      accountCurrency: 'eur',
      error: error.message 
    });
  }
} 