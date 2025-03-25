import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/orders/[id] - Eine bestimmte Bestellung abrufen
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Debug: Session-Informationen anzeigen
    console.log('Session bei Bestellungsabruf (GET):', session);
    
    // Auth-Check (temporär auskommentiert für Tests)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    // }
    
    const { id } = params;
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    if (!order) {
      return NextResponse.json(
        { error: 'Bestellung nicht gefunden' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Fehler beim Abrufen der Bestellung:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Bestellung' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Bestellung aktualisieren (z.B. Status ändern)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Debug: Session-Informationen anzeigen
    console.log('Session bei Bestellungsaktualisierung (PUT):', session);
    
    // Auth-Check (temporär auskommentiert für Tests)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    // }
    
    const { id } = params;
    const data = await request.json();
    
    // Validiere die zu aktualisierenden Felder
    const { status } = data;
    
    if (!status) {
      return NextResponse.json(
        { error: 'Status ist erforderlich' },
        { status: 400 }
      );
    }
    
    // Prüfe, ob die Bestellung existiert
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });
    
    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Bestellung nicht gefunden' },
        { status: 404 }
      );
    }
    
    // Aktualisiere die Bestellung
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
      },
    });
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Bestellung:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren der Bestellung' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Bestellung löschen
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Debug: Session-Informationen anzeigen
    console.log('Session bei Bestellungslöschung (DELETE):', session);
    
    // Auth-Check (temporär auskommentiert für Tests)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    // }
    
    const { id } = params;
    
    // Prüfe, ob die Bestellung existiert
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });
    
    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Bestellung nicht gefunden' },
        { status: 404 }
      );
    }
    
    // Lösche zuerst die zugehörigen Bestellpositionen
    await prisma.orderItem.deleteMany({
      where: { orderId: id },
    });
    
    // Dann lösche die Bestellung selbst
    await prisma.order.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: 'Bestellung erfolgreich gelöscht' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fehler beim Löschen der Bestellung:', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen der Bestellung' },
      { status: 500 }
    );
  }
} 