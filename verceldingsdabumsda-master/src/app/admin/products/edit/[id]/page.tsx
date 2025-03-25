'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  // Neue States für die Bildverwaltung
  const [uploadedImages, setUploadedImages] = React.useState<Array<{ preview: string, file: File }>>([]);
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/products/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Produkt konnte nicht geladen werden');
        }
        
        const data = await response.json();
        console.log('Produkt geladen:', data);
        setProduct(data);
      } catch (err) {
        console.error('Fehler beim Laden des Produkts:', err);
        setError('Produkt konnte nicht geladen werden. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
    
    // Bereinige die Bild-Vorschauen beim Verlassen der Seite
    return () => {
      uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [params.id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (product) {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (product) {
      setProduct({
        ...product,
        [name]: checked,
      });
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (product) {
      setProduct({
        ...product,
        [name]: parseFloat(value),
      });
    }
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: 'features'
  ) => {
    const value = e.target.value;
    
    if (product) {
      // Teile den String bei Kommas und entferne Leerzeichen
      const arrayValue = value.split(',').map(item => item.trim());
      
      setProduct({
        ...product,
        [field]: arrayValue,
      });
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

  const removeUploadedImage = (index: number) => {
    URL.revokeObjectURL(uploadedImages[index].preview);
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    if (product && product.images) {
      const newImages = [...product.images];
      newImages.splice(index, 1);
      setProduct({
        ...product,
        images: newImages
      });
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Neue Bilder hochladen und mit bestehenden kombinieren
      const newImageUrls = await uploadImages();
      const allImages = [...(product.images || []), ...newImageUrls];
      
      // Aktualisiertes Produkt mit allen Bildern
      const updatedProductData = {
        ...product,
        images: allImages
      };
      
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProductData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Produkt konnte nicht aktualisiert werden');
      }
      
      const updatedProduct = await response.json();
      setProduct(updatedProduct);
      setSuccess('Produkt wurde erfolgreich aktualisiert');
      
      // Bildvorschauen zurücksetzen
      uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
      setUploadedImages([]);
      
      // Nach 2 Sekunden zurück zur Produktübersicht
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
    } catch (err: any) {
      console.error('Fehler beim Aktualisieren des Produkts:', err);
      setError(err.message || 'Produkt konnte nicht aktualisiert werden');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-center items-center h-64">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
          {error}
        </div>
        <Link 
          href="/admin/products"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Zurück zur Produktübersicht
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produkt bearbeiten</h1>
        <Link 
          href="/admin/products"
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Zurück zur Übersicht
        </Link>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
          {success}
        </div>
      )}
      
      {product && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name*
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
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
                name="price"
                value={product.price}
                onChange={handleNumberChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Beschreibung*
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              rows={3}
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bilder
            </label>
            
            {/* Vorhandene Bilder anzeigen */}
            {product.images && product.images.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vorhandene Bilder:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <div className="relative h-24 w-full overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                        <Image
                          src={image}
                          alt={`Bild ${index + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized={true}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.jpg';
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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
              {/* Filter nur die HTML-kompatiblen Input-Props */}
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
            
            {/* Vorschau der neu hochgeladenen Bilder */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Neue Bilder:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {uploadedImages.map((image, index) => (
                    <div key={`upload-${index}`} className="relative group">
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
                        onClick={() => removeUploadedImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Features (kommagetrennt)
            </label>
            <textarea
              value={product.features.join(', ')}
              onChange={(e) => handleArrayChange(e, 'features')}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              rows={2}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPopular"
                name="isPopular"
                checked={product.isPopular}
                onChange={handleCheckboxChange}
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
                name="isPremium"
                checked={product.isPremium}
                onChange={handleCheckboxChange}
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
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Wird gespeichert...' : 'Änderungen speichern'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 