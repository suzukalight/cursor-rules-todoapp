import { InMemoryTodoRepository } from '@cursor-rules-todoapp/domain';
import { TestDatabase } from '@cursor-rules-todoapp/repo-sqlite/src/test-utils/database';
import { afterEach, beforeEach, describe, expect, it, test } from 'vitest';
import { createContainer } from '../container';
import { TodoUseCaseImpl } from '../usecases/todo-impl';
import { todoRouter } from './todo';

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
  const _todoUseCase = new TodoUseCaseImpl(todoRepository);

  const createTodoInput = {
    title: 'Test Todo',
    description: 'Test Description',
  } as const;

  const _createTodoInput = createTodoInput;

  describe('create', () => {
    test('Todoを作成できる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const result = await caller.create(_createTodoInput);

      expect(result).toEqual(
        expect.objectContaining({
          title: _createTodoInput.title,
          description: _createTodoInput.description,
          priority: 'medium',
          status: 'pending',
        })
      );
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(result.completedAt).toBeUndefined();
      expect(result.dueDate).toBeUndefined();
    });

    test('タイトルが空の場合はエラーになる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      await expect(
        caller.create({
          ..._createTodoInput,
          title: '',
        })
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('作成したTodoを全て取得できる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });

      // テストデータの作成
      const todo1 = await caller.create({
        title: 'Todo 1',
        description: 'Description 1',
      });
      const todo2 = await caller.create({
        title: 'Todo 2',
        description: 'Description 2',
      });

      const result = await caller.findAll();

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: todo1.title,
            description: todo1.description,
          }),
          expect.objectContaining({
            title: todo2.title,
            description: todo2.description,
          }),
        ])
      );
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
        })
      );
      expect(result.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
    });

    test('存在しないIDの場合はエラーになる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      await expect(
        caller.update({
          id: 'non-existent',
          title: 'Updated Title',
        })
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
        caller.changeStatus({ id: 'non-existent', status: 'completed' })
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
      const todo2 = await caller.create({
        title: 'Todo 2',
        priority: 'low',
        dueDate: new Date('2024-06-01'),
      });

      await caller.changeStatus({ id: todo2.id, status: 'completed' });
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
        dueDateAfter: new Date('2024-03-01'),
        dueDateBefore: new Date('2024-12-31'),
      });

      expect(result).toHaveLength(1);
      expect(result[0].dueDate).toBeDefined();
      if (result[0].dueDate) {
        expect(result[0].dueDate.getTime()).toBeGreaterThan(new Date('2024-03-01').getTime());
        expect(result[0].dueDate.getTime()).toBeLessThan(new Date('2024-12-31').getTime());
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
      await caller.create({
        title: 'Todo 3',
        priority: 'medium',
        dueDate: new Date('2024-03-01'),
      });
    });

    it('作成日時でソートできる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const result = await caller.sort({ sortBy: 'createdAt', order: 'asc' });

      for (let i = 1; i < result.length; i++) {
        expect(result[i].createdAt.getTime()).toBeGreaterThanOrEqual(
          result[i - 1].createdAt.getTime()
        );
      }
    });

    it('優先度でソートできる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const result = await caller.sort({ sortBy: 'priority', order: 'asc' });

      const priorityOrder = { high: 2, medium: 1, low: 0 } as const;
      for (let i = 1; i < result.length; i++) {
        const current = result[i];
        const previous = result[i - 1];
        if (!current || !previous) continue;

        const currentPriority = current.priority as keyof typeof priorityOrder;
        const previousPriority = previous.priority as keyof typeof priorityOrder;
        expect(priorityOrder[currentPriority]).toBeLessThanOrEqual(
          priorityOrder[previousPriority]
        );
      }
    });

    it('期限でソートできる', async () => {
      const caller = router.createCaller({ todoUseCase: container.todoUseCase });
      const result = await caller.sort({ sortBy: 'dueDate', order: 'asc' });

      for (let i = 1; i < result.length; i++) {
        const current = result[i];
        const previous = result[i - 1];
        if (!current || !previous) continue;
        if (!current.dueDate || !previous.dueDate) continue;

        expect(current.dueDate.getTime()).toBeGreaterThanOrEqual(
          previous.dueDate.getTime()
        );
      }
    });
  });
});
