import React from 'react';

export default function ProductsPage() {
  // In einer realen Anwendung würden diese Daten aus der Datenbank kommen
  const products = [
    { 
      id: 1, 
      name: 'Basis Website', 
      description: 'Perfekt für kleine Unternehmen.',
      price: 999,
      featured: true,
      category: 'Websites'
    },
    { 
      id: 2, 
      name: 'Business Website', 
      description: 'Umfangreiche Website mit mehreren Seiten.',
      price: 1999,
      featured: true,
      category: 'Websites'
    },
    { 
      id: 3, 
      name: 'E-Commerce Shop', 
      description: 'Vollständiger Online-Shop mit Zahlungsabwicklung.',
      price: 2999,
      featured: false,
      category: 'E-Commerce'
    },
  ];

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Produkte</h1>
          <p className="text-gray-600">Verwalten Sie Ihre Produkte und Dienstleistungen</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Neues Produkt
        </button>
      </header>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Produkte suchen..."
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex gap-4">
            <select className="p-2 border border-gray-300 rounded-lg">
              <option value="">Alle Kategorien</option>
              <option value="Websites">Websites</option>
              <option value="E-Commerce">E-Commerce</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Produkt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Beschreibung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Preis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kategorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.price} €</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.featured ? (
                      <span className="text-green-600">Ja</span>
                    ) : (
                      <span className="text-gray-400">Nein</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        Bearbeiten
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 