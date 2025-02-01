import { resolve } from 'node:path';
import { Todo } from '@cursor-rules-todoapp/domain/src/todo/todo';
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
        priority: 'medium',
      });

      await repository.save(todo.toDto());

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
        priority: 'medium',
      });

      await repository.save(todo.toDto());
      const updated = Todo.reconstruct(todo.toDto());
      updated.updateTitle('Updated Title');
      await repository.save(updated.toDto());

      const result = await testDb.client.todo.findUnique({
        where: { id: todo.id },
      });

      expect(result?.title).toBe('Updated Title');
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
        priority: 'medium',
      });

      await repository.save(todo.toDto());

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
        priority: 'medium',
      });

      const todo2 = Todo.create({
        title: 'Todo 2',
        priority: 'medium',
      });

      await repository.save(todo1.toDto());
      await repository.save(todo2.toDto());

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
        priority: 'medium',
      });

      await repository.save(todo.toDto());
      await repository.delete(todo.id);

      const deleted = await testDb.client.todo.findUnique({
        where: { id: todo.id },
      });

      expect(deleted).toBeNull();
    });
  });

  describe('transaction', () => {
    it('トランザクションが成功する場合、変更が保存される', async () => {
      const todo = Todo.create({
        title: 'Transaction Todo',
        priority: 'medium',
      });

      const result = await repository.transaction(async () => {
        return await repository.save(todo.toDto());
      });

      expect(result).not.toBeNull();
      expect(result.title).toBe('Transaction Todo');

      const saved = await testDb.client.todo.findUnique({
        where: { id: result.id },
      });
      expect(saved).not.toBeNull();
      expect(saved?.title).toBe('Transaction Todo');
    }, 30000);

    it('トランザクションがエラーの場合、ロールバックされる', async () => {
      const todo = Todo.create({
        title: 'Pre-transaction Todo',
        priority: 'medium',
      });
      await repository.save(todo.toDto());

      let error: Error | undefined;
      try {
        await repository.transaction(async () => {
          await repository.delete(todo.id);
          throw new Error('Test error');
        });
      } catch (e) {
        if (e instanceof Error) {
          error = e;
        }
      }

      expect(error).toBeDefined();
      expect(error?.message).toBe('Test error');

      const stillExists = await testDb.client.todo.findUnique({
        where: { id: todo.id },
      });
      expect(stillExists).not.toBeNull();
      expect(stillExists?.title).toBe('Pre-transaction Todo');
    }, 30000);
  });
});
