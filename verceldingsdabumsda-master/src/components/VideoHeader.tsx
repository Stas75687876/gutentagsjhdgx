'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// SVG-Komponente für topografische Linien
const TopographicLines = () => {
  const pathVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: (i: number) => ({
      opacity: 1,
      pathLength: 1,
      transition: {
        pathLength: {
          duration: 3,
          delay: i * 0.2,
          ease: "easeInOut"
        },
        opacity: {
          duration: 0.5,
          delay: i * 0.2
        }
      }
    })
  };

  // Langsame Rotation und Verschiebung des gesamten SVG
  const containerVariants = {
    animate: {
      rotate: [0, 1, -1, 0],
      scale: [1, 1.02, 0.98, 1],
      x: [0, 5, -5, 0],
      y: [0, -5, 5, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 opacity-75" 
      variants={containerVariants}
      animate="animate"
    >
      <svg 
        className="w-full h-full" 
        viewBox="0 0 800 600" 
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke="rgba(255, 255, 255, 0.1)">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.path
              key={`topo-${i}`}
              d={generateTopographicPath(i)}
              strokeWidth={1}
              custom={i}
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
};

// Funktion zur Generierung von Pfaden für topografische Linien
const generateTopographicPath = (seed: number): string => {
  // Basis-Störung für die Linie
  const baseSeed = seed * 10;
  
  // Startpunkt
  let path = `M -100 ${300 + baseSeed}`;
  
  // Anzahl der Kontrollpunkte
  const pointCount = 15;
  
  // Generiere mehrere Kurvenpunkte
  for (let i = 0; i <= pointCount; i++) {
    const x = (i * 1000 / pointCount) - 100;
    
    // Sinuskurve mit verschiedenen Frequenzen und Amplituden
    const yBase = 300 + baseSeed + Math.sin(i * 0.5 + seed) * 50;
    const yVariation = Math.sin(i * 0.2 + seed * 2) * 30 + Math.sin(i * 0.1 + seed * 0.5) * 20;
    const y = yBase + yVariation;
    
    // Füge zur Pfaddefinition hinzu
    path += ` L ${x} ${y}`;
  }
  
  return path;
};

// Pulsierende Nebel-Komponente für zusätzliche Tiefe
const PulsingFog = () => {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.15, 0.1, 0.15, 0],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: "mirror",
      }}
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.2) 0%, rgba(0,0,0,0) 70%)',
      }}
    />
  );
};

export default function VideoHeader() {
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Animierter Hintergrund mit topografischen Linien */}
      <div className="absolute inset-0 bg-black">
        {/* Topografische Linien-Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <TopographicLines />
          
          {/* Mehrere Nebelschichten für Tiefenwirkung */}
          <PulsingFog />
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 30% 70%, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 50%)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
        
        {/* Overlay für bessere Lesbarkeit */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60"></div>
      </div>

      {/* Content mit verbesserter Positionierung */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Wir gestalten Ihre <span className="text-blue-400">digitale Zukunft</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-200">
            Professionelle Webentwicklung mit modernen Technologien 
            und kreativem Design für Ihren Erfolg im Internet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors flex items-center justify-center group">
              Unsere Dienste
              <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-white hover:bg-white hover:text-blue-600 text-white font-semibold rounded-full transition-colors">
              Kontakt aufnehmen
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll-Hinweis */}
      <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center items-center">
        <motion.div 
          className="text-white text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center">
            <p className="text-sm mb-2 font-medium">Mehr entdecken</p>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 