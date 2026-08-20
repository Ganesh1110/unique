import { PrismaClient } from '@prisma/client';

let dbUrl = process.env.DATABASE_URL || 'file:./aura_store.db';
if (!dbUrl.startsWith('file:')) {
  dbUrl = 'file:./aura_store.db';
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;