import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { copyFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';

const TEMPLATE_DB_PATH = resolve(__dirname, '../../template.db');
const TEST_DB_DIR = resolve(__dirname, '../..');

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

  static async initialize() {
    // 既存のDBを削除
    try {
      unlinkSync(TEMPLATE_DB_PATH);
      unlinkSync(`${TEMPLATE_DB_PATH}-journal`);
    } catch {
      // ファイルが存在しない場合は無視
    }

    // テンプレートDBを作成
    execSync(`DATABASE_URL="file:${TEMPLATE_DB_PATH}" pnpm db:push`, {
      cwd: TEST_DB_DIR,
      stdio: 'inherit',
    });

    // テンプレートDBが作成されたことを確認
    if (!existsSync(TEMPLATE_DB_PATH)) {
      throw new Error('テンプレートDBの作成に失敗しました');
    }
  }

  async setup() {
    // テンプレートDBが存在しない場合は作成
    if (!existsSync(TEMPLATE_DB_PATH)) {
      await TestDatabase.initialize();
    }

    // テストDBを作成
    copyFileSync(TEMPLATE_DB_PATH, this.dbPath);

    // データベースをクリーンアップ
    await this.prisma.todo.deleteMany();
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

  getDatabaseUrl() {
    return `file:${this.dbPath}`;
  }
}
