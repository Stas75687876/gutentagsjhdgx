'use client';

import React from 'react';

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = React.useState({
    siteName: 'Krasse Websites',
    siteDescription: 'Professionelles Webdesign & Entwicklung',
    contactEmail: 'info@krassewebsites.de',
    phoneNumber: '+49 123 456789',
    address: 'Musterstraße 123, 12345 Berlin'
  });
  
  const [seoSettings, setSeoSettings] = React.useState({
    metaTitle: 'Krasse Websites - Professionelles Webdesign & Entwicklung',
    metaDescription: 'Wir erstellen beeindruckende Websites mit modernen Technologien, kreativen Designs und SEO-Optimierung für perfekte Online-Präsenz.',
    metaKeywords: 'Webdesign, Webentwicklung, SEO, Website erstellen, Online-Shop, E-Commerce',
    googleAnalyticsId: 'UA-XXXXXXXX-X'
  });
  
  const [socialMedia, setSocialMedia] = React.useState({
    facebook: 'https://facebook.com/krassewebsites',
    twitter: 'https://twitter.com/krassewebsites',
    instagram: 'https://instagram.com/krassewebsites',
    linkedin: 'https://linkedin.com/company/krassewebsites'
  });
  
  const [savedMessage, setSavedMessage] = React.useState('');
  
  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In einer realen Anwendung würden wir hier eine API-Anfrage machen
    // await fetch('/api/settings/general', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(generalSettings)
    // });
    
    setSavedMessage('Allgemeine Einstellungen wurden gespeichert!');
    setTimeout(() => setSavedMessage(''), 3000);
  };
  
  const handleSeoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In einer realen Anwendung würden wir hier eine API-Anfrage machen
    // await fetch('/api/settings/seo', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(seoSettings)
    // });
    
    setSavedMessage('SEO-Einstellungen wurden gespeichert!');
    setTimeout(() => setSavedMessage(''), 3000);
  };
  
  const handleSocialMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In einer realen Anwendung würden wir hier eine API-Anfrage machen
    // await fetch('/api/settings/social', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(socialMedia)
    // });
    
    setSavedMessage('Social Media Einstellungen wurden gespeichert!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Einstellungen verwalten</h1>
      
      {savedMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
          {savedMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Allgemeine Einstellungen */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Allgemeine Einstellungen</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleGeneralSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Website-Name
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Website-Beschreibung
                  </label>
                  <textarea
                    id="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kontakt-E-Mail
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Telefonnummer
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={generalSettings.phoneNumber}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, phoneNumber: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Adresse
                  </label>
                  <textarea
                    id="address"
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                    rows={2}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* SEO Einstellungen */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">SEO Einstellungen</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSeoSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meta-Titel
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    value={seoSettings.metaTitle}
                    onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meta-Beschreibung
                  </label>
                  <textarea
                    id="metaDescription"
                    value={seoSettings.metaDescription}
                    onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meta-Keywords
                  </label>
                  <input
                    type="text"
                    id="metaKeywords"
                    value={seoSettings.metaKeywords}
                    onChange={(e) => setSeoSettings({ ...seoSettings, metaKeywords: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    id="googleAnalyticsId"
                    value={seoSettings.googleAnalyticsId}
                    onChange={(e) => setSeoSettings({ ...seoSettings, googleAnalyticsId: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Social Media Einstellungen */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Social Media Einstellungen</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSocialMediaSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    id="facebook"
                    value={socialMedia.facebook}
                    onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    id="twitter"
                    value={socialMedia.twitter}
                    onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    id="instagram"
                    value={socialMedia.instagram}
                    onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    value={socialMedia.linkedin}
                    onChange={(e) => setSocialMedia({ ...socialMedia, linkedin: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 