import { PrismaClient } from '@prisma/client';

// PrismaClient-Instanz mit Logging für Entwicklungsumgebung
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

// Globaler Typ für die Prisma-Instanz
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Globales Objekt für Prisma-Instanz
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Singleton-Pattern für die Prisma-Instanz
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// In Produktionsumgebungen nicht global speichern
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma; 