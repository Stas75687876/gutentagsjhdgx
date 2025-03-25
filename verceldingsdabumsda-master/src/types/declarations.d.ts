// Hilfsdeklarationen für Module ohne Typdefinitionen

declare module 'react' {
  import React from 'react';
  export = React;
  export as namespace React;
}

declare module 'next/image';
declare module 'next/link';
declare module 'next/navigation';
declare module 'next/server';
declare module 'next/font/google';
declare module 'next/headers';
declare module 'framer-motion';
declare module 'lucide-react';
declare module 'stripe';
declare module 'zustand';
declare module 'zustand/middleware';

// Declaration file für globale Typen
declare module "*.svg";

// Erweiterung des Window-Objekts
interface Window {
  // Custom window properties
  google?: any;
  dataLayer?: any[];
  fbq?: any;
} 