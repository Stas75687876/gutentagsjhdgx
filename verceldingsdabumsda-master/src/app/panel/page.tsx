import React from 'react';

export default function AdminDashboard() {
  // In einer realen Anwendung würden diese Daten aus der Datenbank kommen
  const stats = [
    { id: 1, name: 'Gesamteinnahmen', value: '12.500 €', change: '+25%', trend: 'up' },
    { id: 2, name: 'Offene Bestellungen', value: '12', change: '-2', trend: 'down' },
    { id: 3, name: 'Neue Kunden', value: '38', change: '+15%', trend: 'up' },
    { id: 4, name: 'Website Besucher', value: '2.451', change: '+18%', trend: 'up' },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'Max Mustermann', date: '15.03.2025', amount: '999 €', status: 'Bezahlt' },
    { id: 'ORD-002', customer: 'Erika Musterfrau', date: '14.03.2025', amount: '1.999 €', status: 'Bezahlt' },
    { id: 'ORD-003', customer: 'John Doe', date: '13.03.2025', amount: '2.999 €', status: 'Ausstehend' },
    { id: 'ORD-004', customer: 'Jane Smith', date: '12.03.2025', amount: '999 €', status: 'Bezahlt' },
    { id: 'ORD-005', customer: 'Thomas Müller', date: '11.03.2025', amount: '1.999 €', status: 'Storniert' },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Willkommen im Admin-Bereich. Hier finden Sie eine Übersicht aller wichtigen Informationen.</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.name}</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className={`ml-2 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Letzte Bestellungen</h2>
          <button className="text-blue-600 hover:text-blue-800">Alle anzeigen</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bestellnummer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kunde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Betrag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'Bezahlt' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Ausstehend' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-6">Schnellaktionen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200">
            Neues Produkt anlegen
          </button>
          <button className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200">
            Bestellungen verwalten
          </button>
          <button className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200">
            Statistiken anzeigen
          </button>
        </div>
      </div>
    </div>
  );
} 