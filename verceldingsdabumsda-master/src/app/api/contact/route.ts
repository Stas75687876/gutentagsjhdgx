import { NextRequest, NextResponse } from 'next/server';

// Konfiguration für den E-Mail-Versand
const EMAIL_USER = process.env.EMAIL_USER || 'kundenservice@ct-studio.store';
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'resend'; // Alternative: sendinblue, mailgun, sendgrid

export async function POST(req: Request) {
  try {
    // Daten aus dem Request-Body extrahieren
    const { name, email, phone, subject, message, recipient } = await req.json();

    // Validiere erforderliche Felder
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Bitte füllen Sie alle Pflichtfelder aus' },
        { status: 400 }
      );
    }

    // E-Mail-Inhalt erstellen
    const emailContent = {
      from: EMAIL_USER,
      to: recipient || EMAIL_USER,
      subject: `Neue Kontaktanfrage: ${subject}`,
      replyTo: email,
      text: `
Name: ${name}
E-Mail: ${email}
Telefon: ${phone || 'Nicht angegeben'}
Betreff: ${subject}

Nachricht:
${message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4F46E5;">Neue Kontaktanfrage</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>E-Mail:</strong> ${email}</p>
  <p><strong>Telefon:</strong> ${phone || 'Nicht angegeben'}</p>
  <p><strong>Betreff:</strong> ${subject}</p>
  <div style="margin-top: 20px;">
    <h3 style="color: #4F46E5;">Nachricht:</h3>
    <p style="white-space: pre-line;">${message}</p>
  </div>
  <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;">
  <p style="color: #666; font-size: 12px;">Diese E-Mail wurde über das Kontaktformular auf Ihrer Website gesendet.</p>
</div>
      `,
    };

    // In einer echten Implementierung würden wir hier einen E-Mail-Dienst nutzen
    // Beispiel mit dem Resend API (ersetzbar mit SendGrid, Mailgun, etc.)
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    //   },
    //   body: JSON.stringify(emailContent)
    // });
    // 
    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || 'Fehler beim Senden der E-Mail');
    // }

    // Simuliere einen erfolgreichen E-Mail-Versand (für Entwicklungszwecke)
    console.log('E-Mail-Inhalt für Entwicklungszwecke:', emailContent);
    
    // Erfolgsantwort zurückgeben
    return NextResponse.json({ 
      success: true, 
      message: 'E-Mail erfolgreich gesendet',
      // Hinweis für Produktionsumgebung
      note: 'In der Produktionsumgebung ist die Integration mit einem E-Mail-Dienst wie Resend, SendGrid oder Mailgun erforderlich.'
    });
  } catch (error: any) {
    console.error('Fehler beim Senden der E-Mail:', error);
    
    // Fehlerantwort mit detaillierter Fehlermeldung
    return NextResponse.json(
      { 
        error: 'Fehler beim Senden der E-Mail',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 