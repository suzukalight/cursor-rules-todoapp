import { resolve } from 'node:path';
import { Todo } from '@cursor-rules-todoapp/domain';
import { config } from 'dotenv';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { TestDatabase } from '../test-utils/database';
import { TodoRepository } from './todo-repository';

// テスト環境の設定を読み込む
process.env.NODE_ENV = 'test';
config({ path: resolve(__dirname, '../../.env.test') });

describe('TodoRepository', () => {
  let testDb: TestDatabase;
  let repository: TodoRepository;

  beforeAll(async () => {
    await TestDatabase.initialize();
  });

  beforeEach(async () => {
    testDb = new TestDatabase();
    await testDb.setup();
    repository = new TodoRepository(testDb.client);
  });

  afterEach(async () => {
    await testDb.cleanup();
  });

  describe('save', () => {
    it('新しいTodoを作成できる', async () => {
      const todo = Todo.create({
        title: 'Test Todo',
        description: 'Test Description',
        status: 'pending',
      });

      await repository.save(todo);

      const saved = await testDb.client.todo.findUnique({
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

      const updated = await testDb.client.todo.findUnique({
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
      expect(todos.map((t) => t.title)).toContain('Todo 1');
      expect(todos.map((t) => t.title)).toContain('Todo 2');
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

      const deleted = await testDb.client.todo.findUnique({
        where: { id: todo.id },
      });

      expect(deleted).toBeNull();
    });
  });

  describe('transaction', () => {
    it('トランザクションが成功する場合、変更が保存される', async () => {
      const result = await repository.transaction(async function (this: TodoRepository) {
        const todo = Todo.create({
          title: 'Transaction Todo',
          status: 'pending',
        });
        await this.save(todo);
        return todo;
      });

      const saved = await testDb.client.todo.findUnique({
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
        await repository.transaction(async function (this: TodoRepository) {
          await this.delete(todo.id);
          throw new Error('Test error');
        });
      } catch (_error) {
        // エラーは期待通り
      }

      const stillExists = await testDb.client.todo.findUnique({
        where: { id: todo.id },
      });
      expect(stillExists).not.toBeNull();
    });
  });
});
