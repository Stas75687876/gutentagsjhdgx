import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET-Methode zum Abrufen aller Bestellungen
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Debug: Session-Informationen anzeigen
    console.log('Session bei Bestellungsabruf:', session);
    
    // Auth-Check (temporär auskommentiert für Tests)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    // }
    
    // Alle Bestellungen aus der Datenbank abrufen
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fehler beim Abrufen der Bestellungen:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Bestellungen' },
      { status: 500 }
    );
  }
}

// POST-Methode zum Erstellen einer neuen Bestellung
export async function POST(request: Request) {
  try {
    const { customerName, customerEmail, items, total, status = 'ausstehend' } = await request.json();

    // Validierung der erforderlichen Felder
    if (!customerName || !customerEmail || !items || items.length === 0 || total === undefined) {
      return NextResponse.json(
        { error: 'Alle erforderlichen Felder müssen angegeben werden' },
        { status: 400 }
      );
    }

    // Bestellung in der Datenbank erstellen
    const newOrder = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        totalAmount: total,
        status,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Fehler beim Erstellen der Bestellung:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Bestellung' },
      { status: 500 }
    );
  }
} 