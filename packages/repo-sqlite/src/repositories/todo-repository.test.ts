import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { copyFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { Todo } from '@cursor-rules-todoapp/domain';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { TodoRepository } from './todo-repository';

// テスト環境の設定を読み込む
process.env.NODE_ENV = 'test';
config({ path: resolve(__dirname, '../../.env.test') });

const TEMPLATE_DB_PATH = resolve(__dirname, '../../template.db');

// テストごとに一意のDBファイルを使用する
function getTestDbPath() {
  return resolve(__dirname, `../../test-${randomUUID()}.db`);
}

describe('TodoRepository', () => {
  let prisma: PrismaClient;
  let repository: TodoRepository;
  let testDbPath: string;

  beforeAll(async () => {
    // 既存のDBを削除
    try {
      unlinkSync(TEMPLATE_DB_PATH);
      unlinkSync(`${TEMPLATE_DB_PATH}-journal`);
    } catch {
      // ファイルが存在しない場合は無視
    }

    // テンプレートDBを作成
    execSync(`DATABASE_URL="file:${TEMPLATE_DB_PATH}" npx prisma db push --force-reset`, { 
      cwd: resolve(__dirname, '../..'),
      stdio: 'inherit',
    });

    // テンプレートDBが作成されたことを確認
    if (!existsSync(TEMPLATE_DB_PATH)) {
      throw new Error('テンプレートDBの作成に失敗しました');
    }
  });

  afterAll(async () => {
    // テンプレートDBを削除
    try {
      unlinkSync(TEMPLATE_DB_PATH);
      unlinkSync(`${TEMPLATE_DB_PATH}-journal`);
    } catch {
      // ファイルが存在しない場合は無視
    }
  });

  beforeEach(async () => {
    // テストごとに一意のDBパスを生成
    testDbPath = getTestDbPath();

    // テンプレートDBをテスト用にコピー
    copyFileSync(TEMPLATE_DB_PATH, testDbPath);

    // テスト用DBに接続
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:${testDbPath}`,
        },
      },
    });
    repository = new TodoRepository(prisma);

    // データベースをクリーンアップ
    await prisma.todo.deleteMany();
  });

  afterEach(async () => {
    await prisma.$disconnect();

    // テストDBを削除
    try {
      unlinkSync(testDbPath);
      unlinkSync(`${testDbPath}-journal`);
    } catch {
      // ファイルが存在しない場合は無視
    }
  });

  describe('save', () => {
    it('新しいTodoを作成できる', async () => {
      const todo = Todo.create({
        title: 'Test Todo',
        description: 'Test Description',
        status: 'pending',
      });

      await repository.save(todo);

      const saved = await prisma.todo.findUnique({
        where: { id: todo.id },
      });

      expect(saved).not.toBeNull();
      expect(saved?.title).toBe('Test Todo');
      expect(saved?.description).toBe('Test Description');
      expect(saved?.status).toBe('pending');
    });

    it('既存のTodoを更新できる', async () => {
      const todo = Todo.create({
        title: 'Test Todo',
        status: 'pending',
      });

      await repository.save(todo);
      todo.updateTitle('Updated Title');
      await repository.save(todo);

      const updated = await prisma.todo.findUnique({
        where: { id: todo.id },
      });

      expect(updated?.title).toBe('Updated Title');
    });
  });

  describe('findById', () => {
    it('存在しないTodoの場合はnullを返す', async () => {
      const result = await repository.findById('non-existent-id');
      expect(result).toBeNull();
    });

    it('既存のTodoを取得できる', async () => {
      const todo = Todo.create({
        title: 'Test Todo',
        status: 'pending',
      });

      await repository.save(todo);

      const found = await repository.findById(todo.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(todo.id);
      expect(found?.title).toBe(todo.title);
    });
  });

  describe('findAll', () => {
    it('全てのTodoを取得できる', async () => {
      const todo1 = Todo.create({
        title: 'Todo 1',
        status: 'pending',
      });

      const todo2 = Todo.create({
        title: 'Todo 2',
        status: 'pending',
      });

      await repository.save(todo1);
      await repository.save(todo2);

      const todos = await repository.findAll();
      expect(todos).toHaveLength(2);
      expect(todos.map(t => t.title)).toContain('Todo 1');
      expect(todos.map(t => t.title)).toContain('Todo 2');
    });
  });

  describe('delete', () => {
    it('Todoを削除できる', async () => {
      const todo = Todo.create({
        title: 'Test Todo',
        status: 'pending',
      });

      await repository.save(todo);
      await repository.delete(todo.id);

      const deleted = await prisma.todo.findUnique({
        where: { id: todo.id },
      });

      expect(deleted).toBeNull();
    });
  });

  describe('transaction', () => {
    it('トランザクションが成功する場合、変更が保存される', async () => {
      const result = await repository.transaction(async function(this: TodoRepository) {
        const todo = Todo.create({
          title: 'Transaction Todo',
          status: 'pending',
        });
        await this.save(todo);
        return todo;
      });

      const saved = await prisma.todo.findUnique({
        where: { id: result.id },
      });
      expect(saved).not.toBeNull();
      expect(saved?.title).toBe('Transaction Todo');
    });

    it('トランザクションがエラーの場合、ロールバックされる', async () => {
      const todo = Todo.create({
        title: 'Pre-transaction Todo',
        status: 'pending',
      });
      await repository.save(todo);

      try {
        await repository.transaction(async function(this: TodoRepository) {
          await this.delete(todo.id);
          throw new Error('Test error');
        });
      } catch (_error) {
        // エラーは期待通り
      }

      const stillExists = await prisma.todo.findUnique({
        where: { id: todo.id },
      });
      expect(stillExists).not.toBeNull();
    });
  });
}); 