'use client';

import React from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';

// Definition der Bestellungs-Status-Typen
type OrderStatus = 'ausstehend' | 'in_bearbeitung' | 'abgeschlossen' | 'storniert';

// Bestellungs-Interface
interface OrderItem {
  id: string;
  productId: string;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Funktion zum Abrufen der Bestellungen
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error(`Fehler beim Abrufen der Bestellungen: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Bestellungen:', err);
      setError('Bestellungen konnten nicht geladen werden. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  // Funktion zum Aktualisieren des Bestellstatus
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren des Status: ${response.status}`);
      }

      // Status in lokalen Daten aktualisieren
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Bestellstatus:', err);
      setError('Status konnte nicht aktualisiert werden.');
    }
  };

  // Bestellungen beim ersten Laden abrufen
  React.useEffect(() => {
    fetchOrders();
  }, []);

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

  // Status-Optionen für das Dropdown
  const statusOptions: OrderStatus[] = ['ausstehend', 'in_bearbeitung', 'abgeschlossen', 'storniert'];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bestellungen</h1>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Aktualisieren
          </button>
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
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">Keine Bestellungen vorhanden.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kunde
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-Mail
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Datum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Summe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customerEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.total.toFixed(2)} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Details
                          </Link>
                          <div className="relative inline-block text-left">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className="block w-full pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status.replace('_', ' ')}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 