'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

export default function AGBPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Allgemeine Geschäftsbedingungen</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
        
        <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">1. Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für alle Verträge, die zwischen Krasse Websites (nachfolgend "Anbieter") und seinen Kunden (nachfolgend "Kunde") über die Erstellung und Gestaltung von Webseiten, die Entwicklung von Onlineshops, die Erstellung von individuellen Webanwendungen sowie die Erbringung von damit zusammenhängenden Dienstleistungen geschlossen werden.
            </p>
            <p>
              Abweichende oder ergänzende Geschäftsbedingungen des Kunden werden nicht Vertragsbestandteil, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich und schriftlich zu.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">2. Vertragsgegenstand und Leistungsumfang</h2>
            <p>
              Der Gegenstand des Vertrages richtet sich nach den individuellen Vereinbarungen der Parteien. Der Anbieter erstellt für den Kunden Webseiten, Online-Shops oder andere digitale Produkte gemäß den Spezifikationen, die im Angebot oder in der Auftragsbestätigung festgehalten sind.
            </p>
            <p>
              Sofern nicht ausdrücklich anders vereinbart, schuldet der Anbieter keinen bestimmten wirtschaftlichen Erfolg des erstellten Produkts. Insbesondere garantiert der Anbieter keine bestimmten Suchmaschinenplatzierungen, Besucherzahlen oder Umsätze.
            </p>
            <p>
              Nachträgliche Änderungswünsche des Kunden, die über den vereinbarten Leistungsumfang hinausgehen, bedürfen einer zusätzlichen Vereinbarung und sind gesondert zu vergüten.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">3. Mitwirkungspflichten des Kunden</h2>
            <p>
              Der Kunde ist verpflichtet, dem Anbieter alle für die Erstellung der Webseite erforderlichen Informationen, Texte, Bilder und sonstigen Materialien rechtzeitig zur Verfügung zu stellen. Der Kunde versichert, dass er über die notwendigen Rechte an den zur Verfügung gestellten Materialien verfügt.
            </p>
            <p>
              Der Kunde ist verpflichtet, die vom Anbieter erstellten Entwürfe und Konzepte zeitnah zu prüfen und freizugeben oder Änderungswünsche mitzuteilen. Verzögerungen, die durch verspätete Mitwirkung des Kunden entstehen, gehen nicht zu Lasten des Anbieters.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">4. Vergütung und Zahlungsbedingungen</h2>
            <p>
              Die Vergütung für die Leistungen des Anbieters richtet sich nach dem individuellen Angebot und der Auftragsbestätigung. Alle Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer.
            </p>
            <p>
              Sofern nicht anders vereinbart, sind 50% der vereinbarten Vergütung bei Auftragserteilung und die restlichen 50% bei Fertigstellung und Abnahme der Webseite fällig.
            </p>
            <p>
              Rechnungen sind innerhalb von 14 Tagen nach Rechnungsstellung ohne Abzug zu bezahlen. Bei Zahlungsverzug ist der Anbieter berechtigt, Verzugszinsen in Höhe von 9 Prozentpunkten über dem Basiszinssatz zu erheben.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">5. Abnahme</h2>
            <p>
              Nach Fertigstellung der vereinbarten Leistungen wird der Anbieter den Kunden zur Abnahme auffordern. Der Kunde ist verpflichtet, die erbrachten Leistungen innerhalb von zwei Wochen zu prüfen und abzunehmen, sofern sie den vereinbarten Anforderungen entsprechen.
            </p>
            <p>
              Nimmt der Kunde die Leistung nicht innerhalb der gesetzten Frist ab, obwohl keine wesentlichen Mängel vorliegen, gilt die Leistung als abgenommen.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">6. Nutzungsrechte</h2>
            <p>
              Mit vollständiger Bezahlung der vereinbarten Vergütung räumt der Anbieter dem Kunden das ausschließliche, zeitlich und räumlich unbeschränkte Recht ein, die erstellte Webseite für die vereinbarten Zwecke zu nutzen.
            </p>
            <p>
              Der Anbieter behält sich das Recht vor, auf der erstellten Webseite an geeigneter Stelle auf seine Urheberschaft hinzuweisen und einen Link zu seiner eigenen Webseite zu setzen, sofern nicht ausdrücklich etwas anderes vereinbart wurde.
            </p>
            <p>
              Der Kunde erklärt sich damit einverstanden, dass der Anbieter die für ihn erstellte Webseite als Referenz nennen und Abbildungen davon zu Werbezwecken verwenden darf.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">7. Gewährleistung und Haftung</h2>
            <p>
              Der Anbieter gewährleistet, dass die erstellte Webseite bei Übergabe frei von Mängeln ist, die ihren Wert oder ihre Tauglichkeit zu dem gewöhnlichen oder nach dem Vertrag vorausgesetzten Gebrauch aufheben oder mindern. Für unwesentliche Mängel wird keine Gewähr übernommen.
            </p>
            <p>
              Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, die auf einer vorsätzlichen oder fahrlässigen Pflichtverletzung des Anbieters, seiner gesetzlichen Vertreter oder Erfüllungsgehilfen beruhen, sowie für sonstige Schäden, die auf einer vorsätzlichen oder grob fahrlässigen Pflichtverletzung beruhen.
            </p>
            <p>
              Für leicht fahrlässig verursachte Schäden haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten und beschränkt auf den vorhersehbaren, vertragstypischen Schaden. Die Haftung für mittelbare Schäden und Folgeschäden, insbesondere entgangenen Gewinn, ist ausgeschlossen.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">8. Datenschutz</h2>
            <p>
              Der Anbieter verpflichtet sich, die geltenden Datenschutzbestimmungen zu beachten und personenbezogene Daten nur im Rahmen des zur Durchführung des Vertrages erforderlichen Umfangs zu verarbeiten.
            </p>
            <p>
              Weitere Informationen zum Datenschutz finden sich in der Datenschutzerklärung des Anbieters unter <Link href="/datenschutz" className="text-blue-600 hover:text-blue-700">Datenschutzerklärung</Link>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">9. Schlussbestimmungen</h2>
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
            </p>
            <p>
              Erfüllungsort und ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist, soweit gesetzlich zulässig, der Sitz des Anbieters.
            </p>
            <p>
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. An die Stelle der unwirksamen Bestimmung tritt eine Regelung, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.
            </p>
            <p>
              Änderungen und Ergänzungen dieser AGB bedürfen der Schriftform. Dies gilt auch für die Änderung dieser Schriftformklausel.
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