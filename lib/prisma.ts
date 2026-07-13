import { PrismaClient } from "@prisma/client";

// Next.js dev rejimida hot-reload paytida bir nechta PrismaClient
// instansiyasi yaratilib ketmasligi uchun global cache ishlatamiz.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
