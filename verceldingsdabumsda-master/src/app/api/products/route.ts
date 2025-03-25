import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/products - Alle Produkte abrufen
export async function GET(request: Request) {
  try {
    // Produkte aus der Datenbank abrufen
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Fehler beim Abrufen der Produkte:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Produkte' },
      { status: 500 }
    );
  }
}

// POST /api/products - Ein neues Produkt erstellen
export async function POST(request: Request) {
  try {
    // Authentifizierung prüfen
    const session = await getServerSession(authOptions);
    console.log('Session bei POST /api/products:', session);

    /*
    // Kommentiert für Testzwecke
    if (!session || !session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }
    */

    const data = await request.json();
    
    // Validiere erforderliche Felder
    if (!data.name || !data.description || !data.price) {
      return NextResponse.json(
        { error: 'Name, Beschreibung und Preis sind erforderlich' },
        { status: 400 }
      );
    }

    // Werte für isPopular und isPremium konvertieren
    const isPopular = data.isPopular === true || data.isPopular === 'true';
    const isPremium = data.isPremium === true || data.isPremium === 'true';
    
    // Neues Produkt erstellen
    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        images: Array.isArray(data.images) ? data.images : [],
        features: Array.isArray(data.features) ? data.features : [],
        isPopular,
        isPremium,
      }
    });

    console.log('Neues Produkt erstellt:', newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Fehler beim Erstellen des Produkts:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Produkts' },
      { status: 500 }
    );
  }
} 