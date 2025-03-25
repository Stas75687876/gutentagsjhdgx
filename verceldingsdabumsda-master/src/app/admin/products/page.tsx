'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import dynamic from 'next/dynamic';

// Dynamisches Laden der Icons mit No-SSR, um Hydration-Fehler zu vermeiden
const X = dynamic(() => import('lucide-react').then(mod => mod.X), { ssr: false });
const Upload = dynamic(() => import('lucide-react').then(mod => mod.Upload), { ssr: false });
const ImageIcon = dynamic(() => import('lucide-react').then(mod => mod.ImageIcon), { ssr: false });

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  features: string[];
  isPopular: boolean;
  isPremium: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isAdding, setIsAdding] = React.useState(false);
  const [uploadedImages, setUploadedImages] = React.useState<Array<{ preview: string, file: File }>>([]);
  const [newProduct, setNewProduct] = React.useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    images: [],
    features: [],
    isPopular: false,
    isPremium: false,
  });
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    fetchProducts();

    // Bereinige die Bild-Vorschauen beim Verlassen der Seite
    return () => {
      uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Produkte von der API abrufen
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Produkte konnten nicht geladen werden');
      }
      
      const data = await response.json();
      console.log('Produkte von API:', data);
      setProducts(data);
    } catch (err) {
      console.error('Fehler beim Laden der Produkte:', err);
      setError('Ein Fehler ist beim Laden der Produkte aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  // Dropzone für Bild-Upload
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setUploadedImages(prev => [...prev, ...newImages]);
  }, []);

  // Korrigierte useDropzone-Konfiguration für TypeScript
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5242880, // 5MB
    multiple: true,
    // Die folgenden Props werden hinzugefügt, um Typescript-Fehler zu vermeiden
    onDragEnter: () => {},
    onDragOver: () => {},
    onDragLeave: () => {},
  });

  const removeImage = (index: number) => {
    URL.revokeObjectURL(uploadedImages[index].preview);
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Verbesserte Funktion zum Konvertieren von Bildern in Base64-Strings
  const uploadImages = async () => {
    if (uploadedImages.length === 0) return [];
    
    try {
      setIsUploading(true);
      // Konvertiere die Bilder in Base64-Strings für die Speicherung in der Datenbank
      const imageUrls = await Promise.all(uploadedImages.map(async (img) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          
          reader.onloadend = () => {
            // reader.result enthält nun den Base64-String des Bildes
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('FileReader lieferte kein String-Ergebnis'));
            }
          };
          
          reader.onerror = () => {
            console.error('Fehler beim Lesen der Datei:', img.file.name);
            reject(new Error(`Fehler beim Lesen der Datei: ${img.file.name}`));
          };
          
          // Datei als Base64 auslesen
          reader.readAsDataURL(img.file);
        });
      }));
      
      console.log('Bilder als Base64-Strings konvertiert:', imageUrls.length, 'Bilder');
      return imageUrls;
    } catch (error) {
      console.error('Fehler beim Konvertieren der Bilder:', error);
      setError('Bilder konnten nicht verarbeitet werden');
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.description || typeof newProduct.price !== 'number') {
      setError('Bitte füllen Sie alle erforderlichen Felder aus');
      return;
    }
    
    try {
      setIsAdding(true);
      setError(null);
      
      // Bilder hochladen und URLs erhalten
      setIsUploading(true);
      const imageUrls = await uploadImages();
      setIsUploading(false);
      
      // Debug-Ausgabe für Base64-Bilder
      console.log('Konvertierte Base64-Bilder:', imageUrls.length > 0 ? 'Vorhanden' : 'Keine');
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          // Bilder-URLs aus dem Upload hinzufügen
          images: imageUrls,
          // Sicherstellen, dass Features ein Array ist
          features: typeof newProduct.features === 'string' 
            ? newProduct.features.split(',').map(f => f.trim()) 
            : newProduct.features,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Produkt konnte nicht erstellt werden');
      }
      
      const createdProduct = await response.json();
      console.log('Erstelltes Produkt:', createdProduct);
      
      // Produkte neu laden
      fetchProducts();
      
      // Erfolgsmeldung anzeigen
      alert('Produkt wurde erfolgreich erstellt!');
      
      // Formular zurücksetzen
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        images: [],
        features: [],
        isPopular: false,
        isPremium: false,
      });

      // Bilder zurücksetzen
      uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
      setUploadedImages([]);
      
      setIsAdding(false);
    } catch (err: any) {
      console.error('Fehler beim Erstellen des Produkts:', err);
      setError(err.message || 'Produkt konnte nicht erstellt werden');
      setIsAdding(false);
      setIsUploading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie dieses Produkt löschen möchten?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Produkt konnte nicht gelöscht werden');
      }
      
      // Produkt aus der lokalen Liste entfernen
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err: any) {
      console.error('Fehler beim Löschen des Produkts:', err);
      setError(err.message || 'Produkt konnte nicht gelöscht werden');
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Produkte verwalten</h1>
      
      {/* Fehlermeldung */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
          {error}
        </div>
      )}
      
      {/* Produktformular */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Neues Produkt hinzufügen</h2>
        <form onSubmit={handleCreateProduct}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name*
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preis (€)*
              </label>
              <input
                type="number"
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Beschreibung*
            </label>
            <textarea
              value={newProduct.description as string}
              onChange={e => setNewProduct({...newProduct, description: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              rows={3}
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bilder
            </label>
            
            {/* Drag-and-Drop Bildupload */}
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : isUploading
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <input {...getInputProps({ refKey: null } as any)} />
              <div className="flex flex-col items-center justify-center text-center">
                {isUploading ? (
                  <>
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-600 border-r-transparent mb-2"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bilder werden verarbeitet...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {isDragActive 
                        ? 'Dateien hier ablegen...' 
                        : 'Ziehen Sie Bilder hierher oder klicken Sie zum Auswählen'
                      }
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Unterstützte Formate: JPG, PNG, GIF, WEBP (max. 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {/* Bildvorschau */}
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-24 w-full overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                      <Image
                        src={image.preview}
                        alt={`Vorschau ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Features (kommagetrennt)
            </label>
            <textarea
              value={typeof newProduct.features === 'string' ? newProduct.features : newProduct.features?.join(', ')}
              onChange={e => setNewProduct({...newProduct, features: e.target.value})}
              placeholder="Responsive Design, SEO-optimiert, 5 Seiten"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              rows={2}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPopular"
                checked={newProduct.isPopular}
                onChange={e => setNewProduct({...newProduct, isPopular: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="isPopular" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Als populär markieren
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPremium"
                checked={newProduct.isPremium}
                onChange={e => setNewProduct({...newProduct, isPremium: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="isPremium" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Als Premium markieren
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAdding}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isAdding ? 'Wird hinzugefügt...' : 'Produkt hinzufügen'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Produktliste */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Keine Produkte gefunden. Fügen Sie oben ein neues Produkt hinzu.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Produkt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Preis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0] || '/images/placeholder.jpg'}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-md object-cover"
                            unoptimized={true}
                            onError={(e) => {
                              console.error('Fehler beim Laden des Produktbildes', product.id);
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder.jpg';
                            }}
                            key={`product-list-${product.id}`}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{product.price.toFixed(2)} €</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {product.isPopular && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Populär
                        </span>
                      )}
                      {product.isPremium && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          Premium
                        </span>
                      )}
                      {!product.isPopular && !product.isPremium && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          Standard
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/products/edit/${product.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                      Bearbeiten
                    </Link>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 