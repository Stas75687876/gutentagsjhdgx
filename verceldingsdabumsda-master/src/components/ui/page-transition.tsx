'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = '',
  direction = 'up'
}: { 
  children: React.ReactNode; 
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}) {
  const directionValues = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionValues[direction] }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ 
        delay, 
        duration,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ 
  children, 
  delay = 0,
  staggerChildren = 0.1,
  className = '' 
}: { 
  children: React.ReactNode; 
  delay?: number;
  staggerChildren?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren,
            delayChildren: delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          } 
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollReveal({
  children,
  threshold = 0.1,
  className = ''
}: {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 