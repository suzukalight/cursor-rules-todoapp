import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';

const TEMPLATE_DB_PATH = resolve(__dirname, '../../template.db');
const TEST_DB_DIR = resolve(__dirname, '../..');

/**
 * SQLiteデータベースの関連ファイルを削除する
 * @param basePath データベースファイルのパス
 */
function cleanupDatabaseFiles(basePath: string) {
  const files = [
    basePath,
    `${basePath}-journal`,
    `${basePath}-wal`,
    `${basePath}-shm`,
  ];

  for (const file of files) {
    try {
      if (existsSync(file)) {
        unlinkSync(file);
      }
    } catch {
      // ファイルが存在しない場合は無視
    }
  }
}

export class TestDatabase {
  private dbPath: string;
  private prisma: PrismaClient;
  private static templateInitialized = false;

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
    if (TestDatabase.templateInitialized) {
      return;
    }

    // 既存のDBを削除する前に、Prismaクライアントを切断
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:${TEMPLATE_DB_PATH}`,
        },
      },
    });

    try {
      await prisma.$disconnect();
    } finally {
      cleanupDatabaseFiles(TEMPLATE_DB_PATH);
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

      TestDatabase.templateInitialized = true;
    } catch (error) {
      console.error('データベース初期化中にエラーが発生しました:', error);
      throw error;
    }
  }

  async setup() {
    // テンプレートDBが存在しない場合は作成
    if (!existsSync(TEMPLATE_DB_PATH)) {
      await TestDatabase.initialize();
    }

    // 既存のテストDBを削除
    cleanupDatabaseFiles(this.dbPath);

    try {
      // テストDBを作成
      execSync(`cd ${TEST_DB_DIR} && npx prisma migrate deploy`, {
        env: {
          ...process.env,
          DATABASE_URL: `file:${this.dbPath}`,
        },
      });

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
    } finally {
      cleanupDatabaseFiles(this.dbPath);
    }
  }

  get client() {
    return this.prisma;
  }

  getDatabaseUrl() {
    return `file:${this.dbPath}`;
  }
}
