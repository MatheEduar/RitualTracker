import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['query'], // Opcional: Ajuda a ver o SQL no terminal
});