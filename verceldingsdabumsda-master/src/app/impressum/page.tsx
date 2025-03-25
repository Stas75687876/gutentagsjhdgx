'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

export default function ImpressumPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Impressum</h1>
        </motion.div>
        
        <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Angaben gemäß § 5 TMG</h2>
            <p>
              Ct Studio<br />
              Flurweg 13<br />
              94527 Aholming<br />
              Deutschland
            </p>
            
            <p className="mt-6">
              <strong>Vertreten durch:</strong><br />
              Christian Stasiczek, Inhaber
            </p>
            
            <p className="mt-6">
              <strong>Kontakt:</strong><br />
              Telefon: +49 15167270985<br />
              E-Mail: <a href="mailto:kundenservice@ct-studio.de" className="text-blue-600 hover:text-blue-700">kundenservice@ct-studio.de</a>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Registereintrag</h2>
            <p>
              Eingetragen im Handelsregister.<br />
              Registergericht: Amtsgericht Musterstadt<br />
              Registernummer: HRB 12345
            </p>
            
            <p className="mt-6">
              <strong>Umsatzsteuer-ID:</strong><br />
              Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
              DE 123456789
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
            <p>
              Berufsbezeichnung: Webdesigner, Webentwickler<br />
              Verliehen von: Bundesrepublik Deutschland
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              Christian Stasiczek<br />
              Flurweg 13<br />
              94527 Aholming<br />
              Deutschland
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">https://ec.europa.eu/consumers/odr/</a>.
            </p>
            <p>
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Haftung für Links</h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            </p>
            <p>
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p>
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>
        </div>
        
        <div className="mt-16 text-center">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück zur Startseite
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
} 