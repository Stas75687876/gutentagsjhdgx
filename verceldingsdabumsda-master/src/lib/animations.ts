import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Diese Funktion initialisiert GSAP mit Plugins und wird auf der Client-Seite aufgerufen
export const initGSAP = () => {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    
    // Neue Scroll-Animationen initialisieren
    createParallaxScroll();
    createSmoothScrollWithIndicator();
  }
};

// Parallax-Effekt für Hintergrundbilder und -videos
export const createParallaxEffect = (element: string, speed: number = 0.5) => {
  if (typeof window === 'undefined') return;

  const targets = document.querySelectorAll(element);
  if (!targets.length) return;

  targets.forEach(target => {
    gsap.to(target, {
      y: `${speed * 100}%`,
      ease: 'none',
      scrollTrigger: {
        trigger: target.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
};

// Textanimation (Zeichen für Zeichen)
export const animateText = (element: string, stagger: number = 0.03, delay: number = 0) => {
  if (typeof window === 'undefined') return;

  const targets = document.querySelectorAll(element);
  if (!targets.length) return;

  targets.forEach(target => {
    // Text in einzelne Zeichen aufteilen
    const text = target.textContent || '';
    target.textContent = '';
    
    // Jeden Buchstaben in einen eigenen Span packen
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // Leerzeichen durch geschütztes Leerzeichen ersetzen
      span.style.display = 'inline-block';
      target.appendChild(span);
    });

    // Animation der einzelnen Zeichen
    gsap.fromTo(
      target.children,
      { 
        opacity: 0, 
        y: 20, 
        rotateY: 40 
      },
      { 
        opacity: 1, 
        y: 0, 
        rotateY: 0,
        stagger: stagger,
        delay: delay,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: target,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
};

// Geschmeidige Scroll-Animation
export const smoothScroll = (target: string, duration: number = 1) => {
  if (typeof window === 'undefined') return;
  
  gsap.to(window, {
    duration,
    scrollTo: {
      y: target,
      offsetY: 50
    },
    ease: 'power3.inOut'
  });
};

// Float-Animation für Elemente (subtile Bewegung)
export const floatAnimation = (element: string, amplitude: number = 15) => {
  if (typeof window === 'undefined') return;

  const targets = document.querySelectorAll(element);
  if (!targets.length) return;

  targets.forEach((target, i) => {
    // Leicht variierende Animationszeiten für natürlicheren Effekt
    const duration = 2 + Math.random() * 2;
    const delay = i * 0.2;

    gsap.to(target, {
      y: `+=${amplitude}`,
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay
    });
  });
};

// Scrollbasierte Reveal-Animation für Sections
export const revealSections = (sectionsSelector: string) => {
  if (typeof window === 'undefined') return;

  const sections = document.querySelectorAll(sectionsSelector);
  if (!sections.length) return;

  sections.forEach(section => {
    // Alle direkten Child-Elemente animieren
    const elements = section.querySelectorAll('.animate-on-scroll');
    
    gsap.fromTo(
      elements,
      { 
        opacity: 0, 
        y: 50 
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
          once: false
        },
        onComplete: () => {
          gsap.set(elements, { clearProps: 'opacity,transform' });
          
          const buttons = section.querySelectorAll('a, button');
          gsap.set(buttons, { opacity: 1, visibility: 'visible' });
        }
      }
    );
    
    const cards = section.querySelectorAll('.card-3d');
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { 
          opacity: 0, 
          y: 50,
          rotateX: 10,
          rotateY: -10
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 1,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  });
};

// Animation für 3D-Karten-Effekt
export const create3DCardEffect = (cardSelector: string) => {
  if (typeof window === 'undefined') return;

  const cards = document.querySelectorAll(cardSelector);
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = (card as HTMLElement).getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
};

// Fortgeschrittene Scroll-Animation für Hintergrundbilder
export const createParallaxScroll = () => {
  if (typeof window === 'undefined') return;

  // Parallax-Effekt für den Hintergrund
  const sections = document.querySelectorAll('section');
  
  sections.forEach(section => {
    const background = section.querySelector('.parallax-bg');
    if (background) {
      gsap.to(background, {
        y: () => {
          const sectionHeight = section.offsetHeight;
          return -sectionHeight * 0.15; // Parallax-Geschwindigkeit
        },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5 // Verzögerungsfaktor für geschmeidigeren Effekt
        }
      });
    }
  });
  
  // Header mit Scroll-Effekt
  const header = document.querySelector('header');
  if (header) {
    gsap.to(header, {
      backgroundColor: 'rgba(9, 9, 11, 0.9)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      ease: 'power2.out',
      scrollTrigger: {
        trigger: document.body,
        start: '50px top',
        end: '51px top',
        scrub: 0.3,
      }
    });
  }
};

// Smooth-Scroll mit Indikator
export const createSmoothScrollWithIndicator = () => {
  if (typeof window === 'undefined') return;
  
  // Progress-Balken für die Scroll-Position
  const progressBar = document.createElement('div');
  progressBar.className = 'fixed top-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-400 to-purple-600 z-50 transition-all';
  document.body.appendChild(progressBar);
  
  // Scroll-Indikator für die Seitennavigation
  gsap.to(progressBar, {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3
    }
  });
  
  // Seitenscrolls zum Ziel glätten
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const targetId = (anchor as HTMLAnchorElement).getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          smoothScroll(targetId, 1);
        }
      }
    });
  });
}; 