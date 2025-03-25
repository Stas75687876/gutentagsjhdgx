import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/products/[id] - Ein einzelnes Produkt abrufen
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('GET request für Produkt mit ID:', params.id);
    
    // Produkt aus der Datenbank abrufen
    const product = await prisma.product.findUnique({
      where: {
        id: params.id
      }
    });

    if (!product) {
      console.error('Produkt nicht gefunden:', params.id);
      return NextResponse.json(
        { error: 'Produkt nicht gefunden' },
        { status: 404 }
      );
    }

    console.log('Produkt gefunden:', product);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Fehler beim Abrufen des Produkts:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen des Produkts' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Ein Produkt aktualisieren
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authentifizierung prüfen
    const session = await getServerSession(authOptions);
    console.log('Session bei PUT /api/products/[id]:', session);

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
    
    // Produkt aktualisieren
    const updatedProduct = await prisma.product.update({
      where: {
        id: params.id
      },
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

    console.log('Produkt aktualisiert:', updatedProduct);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Produkts:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Produkts' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Ein Produkt löschen
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authentifizierung prüfen
    const session = await getServerSession(authOptions);
    console.log('Session bei DELETE /api/products/[id]:', session);

    /*
    // Kommentiert für Testzwecke
    if (!session || !session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }
    */

    // Produkt löschen
    await prisma.product.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Löschen des Produkts:', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Produkts' },
      { status: 500 }
    );
  }
} 