'use client';

import React from 'react';
import GSAPInitializer from './gsap-initializer';

interface AnimationProviderProps {
  children: React.ReactNode;
}

export default function AnimationProvider({ children }: AnimationProviderProps) {
  React.useEffect(() => {
    // Initialisiere scrollbasierte Animationen beim Laden der Seite
    document.body.classList.add('animations-loaded');
  }, []);

  return (
    <>
      <GSAPInitializer />
      {children}
    </>
  );
} 