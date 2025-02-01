import { InMemoryTodoRepository } from '@cursor-rules-todoapp/domain';
import { describe, expect, test, afterEach, beforeEach, it } from 'vitest';
import { TodoUseCaseImpl } from '../usecases/todo-impl';
import { appRouter } from './index';
import { createTestContainer } from '../test-utils/container';
import { TestDatabase } from '@cursor-rules-todoapp/repo-sqlite/src/test-utils/database';
import { createContainer } from '../container';
import { todoRouter } from './todo';
import type { inferProcedureInput } from '@trpc/server';
import type { AppRouter } from './index';

describe('todoRouter', () => {
  let testDb: TestDatabase;
  let router: ReturnType<typeof todoRouter>;
  let container: ReturnType<typeof createContainer>;

  beforeEach(async () => {
    testDb = new TestDatabase();
    await testDb.setup();
    container = createContainer(testDb.getDatabaseUrl());
    router = todoRouter({ todoUseCase: container.todoUseCase });
  });

  afterEach(async () => {
    await testDb.cleanup();
  });

  const todoRepository = new InMemoryTodoRepository();
  const todoUseCase = new TodoUseCaseImpl(todoRepository);

  const createTodoInput = {
    title: 'Test Todo',
    description: 'Test Description',
    priority: 'high' as const,
    dueDate: new Date('2024-12-31'),
  } as const;

  // biome-ignore lint/correctness/noUnusedVariables: テストデータの型定義に使用
  const _createTodoInput = createTodoInput;

  describe('create', () => {
    test('Todoを作成できる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const result = await caller.create(_createTodoInput);

      expect(result).toEqual(
        expect.objectContaining({
          title: _createTodoInput.title,
          description: _createTodoInput.description,
          priority: _createTodoInput.priority,
          dueDate: _createTodoInput.dueDate,
          status: 'pending',
        }),
      );
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(result.completedAt).toBeUndefined();
    });

    test('タイトルが空の場合はエラーになる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      await expect(
        caller.create({
          ..._createTodoInput,
          title: '',
        }),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('作成したTodoを全て取得できる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });

      // テストデータの作成
      await caller.create({
        title: 'Todo 1',
        description: 'Description 1',
      });
      await caller.create({
        title: 'Todo 2',
        description: 'Description 2',
      });

      const result = await caller.findAll();

      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          title: 'Todo 1',
          description: 'Description 1',
        }),
        expect.objectContaining({
          title: 'Todo 2',
          description: 'Description 2',
        }),
      ]));
    });
  });

  describe('findById', () => {
    test('IDを指定してTodoを取得できる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const created = await caller.create(_createTodoInput);
      const result = await caller.findById({ id: created.id });

      expect(result).toEqual(created);
    });

    test('存在しないIDの場合はエラーになる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      await expect(caller.findById({ id: 'non-existent' })).rejects.toThrow();
    });
  });

  describe('update', () => {
    test('Todoを更新できる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const created = await caller.create(_createTodoInput);
      const updateInput = {
        id: created.id,
        title: 'Updated Title',
        description: 'Updated Description',
        priority: 'low' as const,
      };

      const result = await caller.update(updateInput);

      expect(result).toEqual(
        expect.objectContaining({
          id: created.id,
          title: updateInput.title,
          description: updateInput.description,
          priority: updateInput.priority,
        }),
      );
      expect(result.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
    });

    test('存在しないIDの場合はエラーになる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      await expect(
        caller.update({
          id: 'non-existent',
          title: 'Updated Title',
        }),
      ).rejects.toThrow();
    });
  });

  describe('delete', () => {
    test('Todoを削除できる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const created = await caller.create(_createTodoInput);
      await caller.delete({ id: created.id });

      await expect(caller.findById({ id: created.id })).rejects.toThrow();
    });

    test('存在しないIDの場合はエラーになる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      await expect(caller.delete({ id: 'non-existent' })).rejects.toThrow();
    });
  });

  describe('changeStatus', () => {
    test('Todoを完了状態に変更できる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const created = await caller.create(_createTodoInput);
      const result = await caller.changeStatus({ id: created.id, status: 'completed' });

      expect(result.status).toBe('completed');
      expect(result.completedAt).toBeDefined();
    });

    test('完了状態のTodoを未完了状態に変更できる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const created = await caller.create(_createTodoInput);
      await caller.changeStatus({ id: created.id, status: 'completed' });
      const result = await caller.changeStatus({ id: created.id, status: 'pending' });

      expect(result.status).toBe('pending');
      expect(result.completedAt).toBeUndefined();
    });

    test('存在しないIDの場合はエラーになる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      await expect(
        caller.changeStatus({ id: 'non-existent', status: 'completed' }),
      ).rejects.toThrow();
    });
  });

  describe('filter', () => {
    beforeEach(async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });

      // テストデータの作成
      await caller.create({
        title: 'Todo 1',
        priority: 'high',
        dueDate: new Date('2024-01-01'),
      });
      await caller.create({
        title: 'Todo 2',
        priority: 'low',
        dueDate: new Date('2024-06-01'),
      });
    });

    it('ステータスでフィルタリングできる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const result = await caller.filter({ status: 'completed' });

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('completed');
    });

    it('優先度でフィルタリングできる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const result = await caller.filter({ priority: 'high' });

      expect(result).toHaveLength(1);
      expect(result[0].priority).toBe('high');
    });

    test('期限で範囲指定フィルタリングできる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const result = await caller.filter({
        dueDateAfter: new Date('2024-01-02'),
        dueDateBefore: new Date('2024-12-01'),
      });

      expect(result).toHaveLength(1);
      const dueDate = result[0].dueDate;
      if (dueDate) {
        expect(dueDate.getTime()).toEqual(new Date('2024-06-01').getTime());
      }
    });
  });

  describe('sort', () => {
    beforeEach(async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });

      // テストデータの作成
      await caller.create({
        title: 'Todo 1',
        priority: 'high',
        dueDate: new Date('2024-01-01'),
      });
      await caller.create({
        title: 'Todo 2',
        priority: 'low',
        dueDate: new Date('2024-06-01'),
      });
    });

    it('作成日時でソートできる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const result = await caller.sort({ sortBy: 'createdAt', order: 'asc' });

      expect(result[0].createdAt.getTime()).toBeLessThan(result[1].createdAt.getTime());
    });

    it('優先度でソートできる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const result = await caller.sort({ sortBy: 'priority', order: 'asc' });

      expect(result[0].priority).toBe('low');
      expect(result[1].priority).toBe('high');
    });

    it('期限でソートできる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const result = await caller.sort({ sortBy: 'dueDate', order: 'asc' });

      const dueDate1 = result[0].dueDate;
      const dueDate2 = result[1].dueDate;
      if (dueDate1 && dueDate2) {
        expect(dueDate1.getTime()).toBeLessThan(dueDate2.getTime());
      }
    });
  });
}); 