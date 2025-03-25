import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Erstellen des Handlers mit den Optionen aus der externen Datei
const handler = NextAuth(authOptions);

// Nur die Route-Handler exportieren
export { handler as GET, handler as POST }; 