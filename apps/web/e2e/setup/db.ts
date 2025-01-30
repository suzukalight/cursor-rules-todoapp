import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { copyFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';

const TEMPLATE_DB_PATH = resolve(__dirname, '../../../packages/repo-sqlite/template.db');
const TEST_DB_DIR = resolve(__dirname, '../../../packages/repo-sqlite');

export class TestDatabase {
  private dbPath: string;
  private prisma: PrismaClient;

  constructor() {
    this.dbPath = resolve(TEST_DB_DIR, `test-${randomUUID()}.db`);
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:${this.dbPath}`,
        },
      },
    });
  }

  async setup() {
    // テンプレートDBが存在しない場合は作成
    if (!existsSync(TEMPLATE_DB_PATH)) {
      execSync(
        `DATABASE_URL="file:${TEMPLATE_DB_PATH}" npx prisma db push --force-reset`,
        {
          cwd: TEST_DB_DIR,
          stdio: 'inherit',
        },
      );
    }

    // テストDBを作成
    copyFileSync(TEMPLATE_DB_PATH, this.dbPath);
  }

  async cleanup() {
    await this.prisma.$disconnect();

    try {
      unlinkSync(this.dbPath);
      unlinkSync(`${this.dbPath}-journal`);
    } catch {
      // ファイルが存在しない場合は無視
    }
  }

  get client() {
    return this.prisma;
  }
} 