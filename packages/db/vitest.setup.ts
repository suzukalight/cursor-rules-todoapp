import { beforeAll, afterAll } from 'vitest';
import { prisma } from './src/client';

beforeAll(async () => {
  process.env.DATABASE_URL = 'file:./test.db';
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
}); 