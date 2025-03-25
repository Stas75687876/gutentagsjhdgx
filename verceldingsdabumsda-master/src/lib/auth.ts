import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Erweitern des Session-Types für NextAuth
declare module 'next-auth' {
  interface User {
    role?: string;
  }
  
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      role?: string;
    }
  }
}

// Erweitern des JWT-Types
declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Dies ist eine vereinfachte Version - normalerweise würde hier eine Datenbankabfrage stattfinden
        // Wenn Admin-Anmeldedaten aus der Umgebung verfügbar sind, verwenden wir diese
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
        
        if (credentials?.email === adminEmail && credentials?.password === adminPassword) {
          return {
            id: '1',
            name: 'Admin',
            email: adminEmail,
            role: 'admin'
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 Stunden
  },
  secret: process.env.NEXTAUTH_SECRET || 'ein-sicheres-geheimnis-fuer-die-entwicklung',
}; 