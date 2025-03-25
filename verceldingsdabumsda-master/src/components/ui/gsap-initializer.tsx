'use client';

import React from 'react';
import { 
  initGSAP, 
  createParallaxEffect, 
  animateText, 
  floatAnimation,
  revealSections,
  create3DCardEffect
} from '@/lib/animations';

export default function GSAPInitializer() {
  React.useEffect(() => {
    // Kurze Verzögerung, um sicherzustellen, dass die Seite vollständig geladen ist
    const timeoutId = setTimeout(() => {
      try {
        // Initialisiere GSAP-Animationen
        initGSAP();
        
        // Parallax-Effekt für den Hintergrund-Video
        createParallaxEffect('.parallax-bg', 0.3);
        
        // Text-Animationen
        animateText('.text-gradient-animate', 0.02);
        
        // Float-Animation für bestimmte Elemente
        floatAnimation('.float-animation', 10);
        
        // Reveal-Animation für Sektionen beim Scrollen
        revealSections('.animate-on-scroll');
        
        // 3D-Karten-Effekt
        create3DCardEffect('.card-3d');
      } catch (error) {
        console.error('Fehler beim Initialisieren der GSAP-Animationen:', error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
} 