'use client';

import React from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
}

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | 'active' | 'inactive'>('all');

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In einer realen Anwendung würden wir hier eine API-Anfrage machen
      // const response = await fetch('/api/admin/customers');
      // const data = await response.json();
      // setCustomers(data);
      
      // Demo-Daten für Testzwecke
      setTimeout(() => {
        setCustomers([
          {
            id: 'cust_001',
            name: 'Max Mustermann',
            email: 'max@example.com',
            phone: '+49 123 4567890',
            totalOrders: 5,
            totalSpent: 1299.95,
            lastOrderDate: '2023-06-15',
            status: 'active'
          },
          {
            id: 'cust_002',
            name: 'Laura Schmidt',
            email: 'laura@example.com',
            phone: '+49 987 6543210',
            totalOrders: 3,
            totalSpent: 459.85,
            lastOrderDate: '2023-05-22',
            status: 'active'
          },
          {
            id: 'cust_003',
            name: 'Thomas Müller',
            email: 'thomas@example.com',
            phone: '+49 234 5678901',
            totalOrders: 8,
            totalSpent: 2199.50,
            lastOrderDate: '2023-06-18',
            status: 'active'
          },
          {
            id: 'cust_004',
            name: 'Sandra Fischer',
            email: 'sandra@example.com',
            phone: '+49 345 6789012',
            totalOrders: 1,
            totalSpent: 149.99,
            lastOrderDate: '2023-03-10',
            status: 'inactive'
          },
          {
            id: 'cust_005',
            name: 'Daniel Wagner',
            email: 'daniel@example.com',
            phone: '+49 456 7890123',
            totalOrders: 4,
            totalSpent: 879.80,
            lastOrderDate: '2023-05-05',
            status: 'active'
          }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Fehler beim Laden der Kundendaten');
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'all' || 
      customer.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (customerId: string, newStatus: 'active' | 'inactive') => {
    // In einer realen Anwendung würden wir hier eine API-Anfrage machen
    // await fetch(`/api/admin/customers/${customerId}/status`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: newStatus })
    // });
    
    // Demo-Update der Kunden-State
    setCustomers(prevCustomers => 
      prevCustomers.map(customer => 
        customer.id === customerId 
          ? { ...customer, status: newStatus } 
          : customer
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kundenverwaltung</h1>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Neuen Kunden hinzufügen
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
              placeholder="Suche nach Namen, Email oder Kunden-ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <select
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive')}
          >
            <option value="all">Alle Kunden</option>
            <option value="active">Aktive Kunden</option>
            <option value="inactive">Inaktive Kunden</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kunde
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Bestellungen
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Gesamtausgaben
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Letzte Bestellung
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {customer.email}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {customer.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {customer.totalOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {customer.totalSpent.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(customer.lastOrderDate).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}>
                        {customer.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => {
                            // Hier könnte eine Detailansicht oder ein Bearbeitungsdialog geöffnet werden
                            alert(`Details für Kunde ${customer.name} anzeigen`);
                          }}
                        >
                          Details
                        </button>
                        <button 
                          className={`${
                            customer.status === 'active' 
                              ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' 
                              : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                          }`}
                          onClick={() => handleStatusChange(
                            customer.id, 
                            customer.status === 'active' ? 'inactive' : 'active'
                          )}
                        >
                          {customer.status === 'active' ? 'Deaktivieren' : 'Aktivieren'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Keine Kunden gefunden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 