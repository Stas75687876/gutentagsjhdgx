/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.vimeocdn.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'placekitten.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '**',
      }
    ],
    unoptimized: true, // Option zum Deaktivieren der Bildoptimierung für externe Bilder
  },
  env: {
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  // Für Client-Komponenten verfügbar machen
  publicRuntimeConfig: {
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  },
  // Client-seitige Umgebungsvariablen direkt setzen
  experimental: {
    serverComponentsExternalPackages: ['stripe'],
  },
  // Stripe Public Key für Client-Komponenten
  serverRuntimeConfig: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  },
  // Transpile next-themes
  transpilePackages: ['next-themes'],
};

module.exports = nextConfig; 