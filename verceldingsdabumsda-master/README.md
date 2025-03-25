# Stripe Website - Beeindruckendes Webdesign mit Stripe-Integration

Ein vollständiges Website-Projekt mit beeindruckendem Design, Admin-Panel zur Produktverwaltung, Stripe-Integration für Zahlungen und optimaler SEO-Performance.

## 🚀 Features

- **Beeindruckendes Frontend-Design** mit Fullscreen-Videos und Animationen
- **Admin-Panel** zur Verwaltung von Produkten und Bestellungen
- **Stripe-Integration** für sicheres Bezahlen
- **Responsive Design** für alle Geräte
- **SEO-optimiert** mit Next.js
- **NeonDB PostgreSQL** als Datenbank
- **Produktkatalog** mit dynamischer Filterung
- **Warenkorb-System** mit lokaler Speicherung

## 📋 Technologie-Stack

- **Frontend:** Next.js, TailwindCSS, Framer Motion, GSAP
- **Backend:** Next.js API Routes
- **Datenbank:** NeonDB (PostgreSQL) mit Prisma ORM
- **Authentifizierung:** JWT
- **Zahlungen:** Stripe API
- **Hosting:** Vercel (Frontend), Render.com (Backend), NeonDB (Datenbank)

## ⚙️ Installation

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd stripe-website
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen einrichten**
   Erstellen Sie eine `.env`-Datei im Hauptverzeichnis und fügen Sie folgende Variablen hinzu:
   ```
   # Stripe Keys
   STRIPE_PUBLIC_KEY=<dein-stripe-public-key>
   STRIPE_SECRET_KEY=<dein-stripe-secret-key>

   # Next Auth
   NEXTAUTH_SECRET=<ein-sicherer-geheimer-schlüssel>
   NEXTAUTH_URL=http://localhost:3000

   # Database
   DATABASE_URL=<deine-neondb-url>
   ```

4. **Datenbank-Migration ausführen**
   ```bash
   npx prisma migrate dev
   ```

5. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

6. **Fertig!** Öffnen Sie http://localhost:3000 im Browser

## 🏗️ Projektstruktur

```
stripe-website/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API-Routen (Stripe, Auth, etc.)
│   │   ├── panel/          # Admin-Panel
│   │   ├── shop/           # Shop-Seiten
│   │   └── page.tsx        # Homepage
│   ├── components/         # Wiederverwendbare Komponenten
│   │   ├── ui/             # UI-Komponenten
│   │   └── shop/           # Shop-Komponenten
│   ├── lib/                # Hilfsfunktionen und Dienstprogramme
│   │   ├── db/             # Datenbank-Clients
│   │   ├── store/          # Zustand-Stores (Warenkorb, etc.)
│   │   └── utils/          # Allgemeine Hilfsfunktionen
│   └── styles/             # Globale Styles
├── prisma/                 # Prisma Schema und Migrationen
├── public/                 # Statische Dateien
└── ...
```

## 🔒 Admin-Panel

Das Admin-Panel ist unter `/panel` verfügbar und bietet folgende Funktionen:

- **Dashboard** mit Übersicht über Verkäufe und Bestellungen
- **Produktverwaltung** (Hinzufügen, Bearbeiten, Löschen)
- **Bestellverwaltung** mit Bestellstatus-Updates
- **Einnahmen-Übersicht** mit Grafiken und Statistiken

## 🛒 Stripe-Integration

Die Anwendung verwendet Stripe für sichere Zahlungen:

1. Produkte werden im Warenkorb gespeichert
2. Beim Checkout wird eine Stripe-Session erstellt
3. Der Nutzer wird zur Stripe-Zahlungsseite weitergeleitet
4. Nach erfolgreicher Zahlung wird der Nutzer zurück zur Website geleitet

## 💾 Datenbankschema

Das Datenbankschema wird mit Prisma verwaltet und umfasst folgende Modelle:

- **User:** Benutzerkonten für Kunden und Administratoren
- **Product:** Produkte im Shop
- **Order:** Bestellungen
- **OrderItem:** Einzelne Produkte in Bestellungen

## 🚀 Deployment

### Vercel (Frontend & API)

1. Erstellen Sie ein Konto auf [Vercel](https://vercel.com)
2. Importieren Sie das Git-Repository
3. Konfigurieren Sie die Umgebungsvariablen
4. Deployen Sie die Anwendung

### NeonDB (Datenbank)

1. Erstellen Sie ein Konto auf [NeonDB](https://neon.tech)
2. Erstellen Sie eine neue Postgres-Datenbank
3. Kopieren Sie die Verbindungs-URL in die Umgebungsvariablen
4. Führen Sie die Migrationen aus: `npx prisma migrate deploy`

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Weitere Informationen finden Sie in der LICENSE-Datei.

## 👨‍💻 Autor

Erstellt mit viel Liebe zum Detail und modernsten Technologien.

---

Bei Fragen oder Problemen bitte ein Issue eröffnen oder Kontakt aufnehmen. 