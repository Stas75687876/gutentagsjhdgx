'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import CartButton from '@/components/shop/CartButton';
import VideoHeader from '@/components/VideoHeader';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState('websites');
  const [isProcessVideoLoaded, setIsProcessVideoLoaded] = React.useState(false);
  
  const services = {
    websites: [
      {
        title: 'Moderne Website-Erstellung',
        description: 'Wir erstellen responsive und benutzerfreundliche Websites, die auf allen Geräten perfekt aussehen.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      },
      {
        title: 'Content Management Systeme',
        description: 'Wir implementieren benutzerfreundliche CMS, damit Sie Ihre Inhalte selbst verwalten können.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )
      },
      {
        title: 'UI/UX Design',
        description: 'Wir gestalten intuitive Benutzeroberflächen für optimale User Experience.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        )
      }
    ],
    ecommerce: [
      {
        title: 'Online Shop Erstellung',
        description: 'Wir entwickeln maßgeschneiderte E-Commerce-Lösungen für Ihren Verkaufserfolg im Internet.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        )
      },
      {
        title: 'Zahlungsabwicklung',
        description: 'Integration sicherer und vielfältiger Zahlungsmethoden für Ihren Online-Shop.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      },
      {
        title: 'Produktmanagement',
        description: 'Effiziente Systeme zur Verwaltung Ihres Produktkatalogs und Lagerbestands.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )
      }
    ],
    seo: [
      {
        title: 'SEO-Optimierung',
        description: 'Wir verbessern Ihre Sichtbarkeit in Suchmaschinen durch professionelle SEO-Strategien.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        )
      },
      {
        title: 'Content-Strategie',
        description: 'Wir entwickeln relevante Inhalte, die sowohl Besucher als auch Suchmaschinen überzeugen.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
        )
      },
      {
        title: 'Analytics & Reporting',
        description: 'Wir analysieren Besucherverhalten und stellen Ihnen detaillierte Berichte zur Verfügung.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
        )
      }
    ]
  };

  return (
    <div className="min-h-screen">
      {/* Video Header anstelle des Hero Sections */}
      <VideoHeader />
      
      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Unsere Dienstleistungen</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Wir bieten umfassende Webentwicklungslösungen, die auf die Bedürfnisse Ihres Unternehmens zugeschnitten sind.
            </p>
          </motion.div>
          
          <div className="mb-10">
            <div className="flex justify-center mb-10">
              <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                {['websites', 'ecommerce', 'seo'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-full font-medium transition-colors ${
                      activeTab === tab 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab === 'websites' && 'Websites'}
                    {tab === 'ecommerce' && 'E-Commerce'}
                    {tab === 'seo' && 'SEO & Marketing'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services[activeTab].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                </motion.div>
              ))}
              </div>
          </div>
          
          <div className="text-center">
            <Link 
              href="/shop" 
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Alle Dienste ansehen
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Wie wir arbeiten</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Unser bewährter Prozess stellt sicher, dass wir qualitativ hochwertige Lösungen liefern, die Ihren Anforderungen entsprechen. 
              Mit unserer strukturierten Vorgehensweise garantieren wir effiziente Projektumsetzung und transparente Kommunikation.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            {[
              { 
                number: '01', 
                title: 'Beratung', 
                description: 'Wir besprechen Ihre Anforderungen und Ziele, um Ihr Projekt optimal zu verstehen. In dieser Phase analysieren wir gemeinsam Ihre Bedürfnisse und definieren klare Ziele für Ihr Projekt.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )
              },
              { 
                number: '02', 
                title: 'Konzeption', 
                description: 'Wir entwickeln ein maßgeschneidertes Konzept und erstellen Wireframes für Ihr Projekt. Basierend auf unseren Gesprächen erarbeiten wir eine detaillierte Strategie und visualisieren erste Entwürfe für Ihr Feedback.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                )
              },
              { 
                number: '03', 
                title: 'Umsetzung', 
                description: 'Wir setzen das Projekt gemäß den vereinbarten Spezifikationen professionell um. Unser erfahrenes Entwicklerteam arbeitet mit modernen Technologien und folgt bewährten Best Practices für optimale Ergebnisse.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                )
              },
              { 
                number: '04', 
                title: 'Support', 
                description: 'Nach der Fertigstellung bieten wir fortlaufenden Support und Wartung. Wir sorgen dafür, dass Ihre Lösung stets optimal funktioniert, aktuell bleibt und bei Bedarf weiterentwickelt werden kann.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-600 h-full">
                  <div className="absolute -top-4 -left-4 bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </div>
                  <div className="pt-6">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                      {step.icon}
                </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                  </div>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
              </div>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Arbeitsweise-Zusatzinformationen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Unser Qualitätsversprechen</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Moderne Technologien</h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">Wir arbeiten mit den neuesten Frameworks und Tools, um zukunftssichere Lösungen zu entwickeln.</p>
                    </div>
                  </div>
                  
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Responsive Design</h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">Alle unsere Websites sind für optimale Darstellung auf allen Geräten konzipiert.</p>
                  </div>
                  </div>
                  
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">SEO-Optimiert</h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">Wir implementieren bewährte SEO-Praktiken, um die Sichtbarkeit Ihrer Website zu maximieren.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Ihr Vorteil mit uns</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Transparente Kommunikation</h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">Sie werden in jedem Schritt des Prozesses einbezogen und über den Fortschritt informiert.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Faire Preisgestaltung</h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">Wir bieten wettbewerbsfähige Preise ohne versteckte Kosten oder Überraschungen.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Langfristige Partnerschaft</h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">Unser Ziel ist nicht nur ein Projekt, sondern eine dauerhafte Zusammenarbeit für Ihren Online-Erfolg.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Video einbinden */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl mb-12 max-w-4xl mx-auto"
          >
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 Aspect Ratio */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 animate-pulse" 
                   style={{ opacity: isProcessVideoLoaded ? 0 : 1, transition: 'opacity 0.5s' }}>
                <div className="flex items-center justify-center h-full">
                  <svg className="w-12 h-12 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
              <iframe
                src="https://player.vimeo.com/video/1067508106?h=343f245390&autoplay=0&loop=1&title=0&byline=0&portrait=0"
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                onLoad={() => setIsProcessVideoLoaded(true)}
                style={{ opacity: isProcessVideoLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
                title="Unser Arbeitsprozess"
              ></iframe>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Unser Arbeitsablauf im Detail</h3>
              <p className="text-gray-600 dark:text-gray-300">Dieser kurze Film gibt Ihnen einen Einblick in unseren Entwicklungsprozess und zeigt, wie wir an Ihrem Projekt arbeiten werden.</p>
            </div>
          </motion.div>
            </div>
          </div>
          
      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Bereit für den nächsten Schritt?</h2>
            <p className="text-xl max-w-3xl mx-auto mb-10">
              Kontaktieren Sie uns heute für eine kostenlose Beratung und lassen Sie uns gemeinsam Ihr Projekt zum Erfolg führen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/shop" 
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Unsere Dienste
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
              >
                Kontakt aufnehmen
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer hinzufügen */}
      <Footer />
    </div>
  );
} 