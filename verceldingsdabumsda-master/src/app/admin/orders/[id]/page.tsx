'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import Link from 'next/link';

// Definition der Bestellungs-Status-Typen
type OrderStatus = 'ausstehend' | 'in_bearbeitung' | 'abgeschlossen' | 'storniert';

// Interface für Bestellpositionen
interface OrderItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
  quantity: number;
  price: number;
}

// Bestellungs-Interface
interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const router = useRouter();

  // Funktion zum Abrufen der Bestelldetails
  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Bestellung nicht gefunden');
        }
        throw new Error(`Fehler beim Abrufen der Bestelldetails: ${response.status}`);
      }
      const data = await response.json();
      setOrder(data);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Bestelldetails:', err);
      setError('Bestelldetails konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };

  // Bestelldetails beim ersten Laden abrufen
  React.useEffect(() => {
    fetchOrderDetails();
  }, [params.id]);

  // Funktion zum Aktualisieren des Bestellstatus
  const updateOrderStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    
    setUpdateLoading(true);
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren des Status: ${response.status}`);
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Bestellstatus:', err);
      setError('Status konnte nicht aktualisiert werden.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Funktion zum Löschen der Bestellung
  const deleteOrder = async () => {
    if (!window.confirm('Sind Sie sicher, dass Sie diese Bestellung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      return;
    }
    
    setUpdateLoading(true);
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Löschen der Bestellung: ${response.status}`);
      }

      router.push('/admin/orders');
    } catch (err) {
      console.error('Fehler beim Löschen der Bestellung:', err);
      setError('Bestellung konnte nicht gelöscht werden.');
      setUpdateLoading(false);
    }
  };

  // Status-Optionen für das Dropdown
  const statusOptions: OrderStatus[] = ['ausstehend', 'in_bearbeitung', 'abgeschlossen', 'storniert'];

  // Funktion zum Rendern des Status-Badges
  const renderStatusBadge = (status: OrderStatus) => {
    let bgColor = '';
    let textColor = '';

    switch (status) {
      case 'ausstehend':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'in_bearbeitung':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'abgeschlossen':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'storniert':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Link
              href="/admin/orders"
              className="text-indigo-600 hover:text-indigo-900"
            >
              &larr; Zurück zur Übersicht
            </Link>
            <h1 className="text-2xl font-bold">Bestelldetails</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={fetchOrderDetails}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Aktualisieren
            </button>
            <button
              onClick={deleteOrder}
              disabled={updateLoading || !order}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            >
              Bestellung löschen
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : !order ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">Bestellung nicht gefunden.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bestellnummer
                  </h3>
                  <p className="mt-1 text-sm font-medium text-gray-900">{order.id}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gesamtbetrag
                  </h3>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {order.total.toFixed(2)} €
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </h3>
                  <div className="mt-1 flex items-center space-x-2">
                    {renderStatusBadge(order.status)}
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(e.target.value as OrderStatus)}
                      disabled={updateLoading}
                      className="ml-2 block w-full pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Kundeninformationen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">{order.customerName}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-Mail
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">{order.customerEmail}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bestellte Produkte</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produkt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Einzelpreis
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Menge
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gesamtpreis
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.product?.name || 'Unbekanntes Produkt'}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {item.productId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.price.toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {(item.price * item.quantity).toFixed(2)} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Gesamtbetrag:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.total.toFixed(2)} €
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 