'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageLoaderProps {
  isLoading: boolean;
}

export default function PageLoader({ isLoading }: PageLoaderProps) {
  const [visible, setVisible] = React.useState(isLoading);

  React.useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      // Verzögerung, damit die Ausblendanimation sichtbar ist
      const timer = setTimeout(() => {
        setVisible(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 to-indigo-900"
    >
      <LogoAnimation />
      <LoadingBar />
    </motion.div>
  );
}

function LogoAnimation() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-8"
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 2, 
          ease: "easeInOut", 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
        className="text-5xl font-bold text-white"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          WebPro
        </span>
      </motion.div>
    </motion.div>
  );
}

function LoadingBar() {
  return (
    <motion.div
      initial={{ width: "50%", opacity: 0 }}
      animate={{ width: "50%", opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative w-64 h-2 bg-blue-800 rounded-full overflow-hidden mt-4"
    >
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ 
          duration: 1.5, 
          ease: "linear", 
          repeat: Infinity 
        }}
        className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400"
      />
    </motion.div>
  );
} 