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
          url: `file:${this.dbPath}?mode=memory&cache=shared&journal_mode=WAL&synchronous=NORMAL`,
        },
      },
    });
  }

  static async initialize() {
    // 既存のDBを削除する前に、Prismaクライアントを切断
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:${TEMPLATE_DB_PATH}?mode=memory&cache=shared&journal_mode=WAL&synchronous=NORMAL`,
        },
      },
    });
    try {
      await prisma.$disconnect();
    } catch {
      // 切断に失敗した場合は無視
    }

    // 既存のDBを削除
    try {
      unlinkSync(TEMPLATE_DB_PATH);
      unlinkSync(`${TEMPLATE_DB_PATH}-journal`);
    } catch {
      // ファイルが存在しない場合は無視
    }

    try {
      // スキーマを適用
      execSync(`cd ${TEST_DB_DIR} && npx prisma migrate deploy`, {
        env: {
          ...process.env,
          DATABASE_URL: `file:${TEMPLATE_DB_PATH}`,
        },
      });

      // テンプレートDBが作成されたことを確認
      if (!existsSync(TEMPLATE_DB_PATH)) {
        throw new Error('テンプレートDBの作成に失敗しました');
      }

      // スキーマが正しく適用されたことを確認
      const testPrisma = new PrismaClient({
        datasources: {
          db: {
            url: `file:${TEMPLATE_DB_PATH}`,
          },
        },
      });
      await testPrisma.$connect();
      await testPrisma.todo.count();
      await testPrisma.$disconnect();
    } catch (error) {
      console.error('データベース初期化中にエラーが発生しました:', error);
      throw error;
    }
  }

  async setup() {
    // 既存のテストDBを削除
    try {
      unlinkSync(this.dbPath);
      unlinkSync(`${this.dbPath}-journal`);
    } catch {
      // ファイルが存在しない場合は無視
    }

    // テンプレートDBが存在しない場合は作成
    if (!existsSync(TEMPLATE_DB_PATH)) {
      await TestDatabase.initialize();
    }

    // テストDBを作成
    copyFileSync(TEMPLATE_DB_PATH, this.dbPath);

    // データベースをクリーンアップ
    try {
      await this.prisma.$connect();
      await this.prisma.todo.deleteMany();
    } catch (error: unknown) {
      console.error('データベースのクリーンアップ中にエラーが発生しました:', error);
      // データベースが存在しない場合は、マイグレーションを実行
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2021') {
        await TestDatabase.initialize();
        await this.prisma.$connect();
        await this.prisma.todo.deleteMany();
      } else {
        throw error;
      }
    }
  }

  async cleanup() {
    try {
      await this.prisma.$disconnect();
    } catch {
      // 切断に失敗した場合は無視
    }

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
