import type { Server } from 'node:http';
import type { Todo } from '@cursor-rules-todoapp/domain';
import { TodoRepository } from '@cursor-rules-todoapp/repo-sqlite';
import { TestDatabase } from '@cursor-rules-todoapp/repo-sqlite/src/test-utils/database';
import { PrismaClient } from '@prisma/client';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import express from 'express';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { handleError } from '../errors';
import { appRouter } from '../router';
import { TRPCTestHelper } from '../test-utils/trpc-test-helper';
import { TodoUseCaseImpl } from '../usecases/todo';

// テスト環境を設定
process.env.NODE_ENV = 'test';

interface CreateTodoInput {
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
}

interface ChangeStatusInput {
  id: string;
  status: 'pending' | 'completed';
}

describe('API統合テスト', () => {
  let server: Server;
  let helper: TRPCTestHelper;
  let testDb: TestDatabase;
  let todoRepository: TodoRepository;

  beforeAll(async () => {
    await TestDatabase.initialize();
  });

  beforeEach(async () => {
    testDb = new TestDatabase();
    await testDb.setup();

    const app = express();
    todoRepository = new TodoRepository(
      new PrismaClient({
        datasources: {
          db: {
            url: testDb.getDatabaseUrl(),
          },
        },
      })
    );
    const todoUseCase = new TodoUseCaseImpl(todoRepository);
    const router = appRouter({ todoUseCase });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(
      '/trpc',
      createExpressMiddleware({
        router,
        onError: ({ error }) => {
          handleError(error);
        },
        createContext: () => ({
          todoUseCase,
        }),
        batching: {
          enabled: false,
        },
      })
    );

    // サーバーを起動
    server = app.listen(0);
    helper = new TRPCTestHelper(app, {
      // 必要なときだけ true にする
      debug: false,
    });
  });

  afterEach(async () => {
    server.close();
    await testDb.cleanup();
  });

  describe('Todo API', () => {
    it('Todoを作成できる', async () => {
      const input: CreateTodoInput = {
        title: 'テストTodo',
        description: 'テストの説明',
        priority: 'medium' as const,
      };
      const response = await helper.post<CreateTodoInput, Todo>('todo.create', input);

      helper.expectSuccess(response);
      expect(response.data).toBeDefined();
      expect(response.data!.title).toBe('テストTodo');
      expect(response.data!.description).toBe('テストの説明');
      expect(response.data!.priority).toBe('medium');
      expect(response.data!.status).toBe('pending');
    });

    it('存在しないTodoの取得でエラーになる', async () => {
      const input = { id: 'non-existent-id' };
      const response = await helper.get<{ id: string }, Todo>('todo.findById', input);
      helper.expectError(response, 404, 'Todo not found');
    });

    it('不正なデータでTodoを作成するとバリデーションエラーになる', async () => {
      const input = { description: 'テストの説明' };
      const response = await helper.post<Partial<CreateTodoInput>, Todo>('todo.create', input);
      helper.expectError(response, 400, 'Required');
    });

    it('Todoのステータスを変更できる', async () => {
      // 1. まずTodoを作成
      const createInput: CreateTodoInput = {
        title: 'テストTodo',
        description: 'テストの説明',
        priority: 'medium' as const,
      };
      const createResponse = await helper.post<CreateTodoInput, Todo>('todo.create', createInput);
      helper.expectSuccess(createResponse);
      expect(createResponse.data).toBeDefined();

      // 2. ステータスを完了に変更
      const changeInput: ChangeStatusInput = {
        id: createResponse.data!.id,
        status: 'completed' as const,
      };
      const completeResponse = await helper.post<ChangeStatusInput, Todo>('todo.changeStatus', changeInput);
      helper.expectSuccess(completeResponse);
      expect(completeResponse.data).toBeDefined();
      expect(completeResponse.data!.status).toBe('completed');
      expect(completeResponse.data!.completedAt).toBeDefined();
    });

    it('Todoの一覧を取得できる', async () => {
      // 1. テストデータを作成
      const input1: CreateTodoInput = {
        title: 'テストTodo1',
        description: 'テストの説明1',
        priority: 'high' as const,
      };
      await helper.post<CreateTodoInput, Todo>('todo.create', input1);

      const input2: CreateTodoInput = {
        title: 'テストTodo2',
        description: 'テストの説明2',
        priority: 'low' as const,
      };
      await helper.post<CreateTodoInput, Todo>('todo.create', input2);

      // 2. 一覧を取得
      const response = await helper.get<undefined, Todo[]>('todo.findAll', undefined);
      helper.expectSuccess(response);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data!.length).toBeGreaterThanOrEqual(2);

      // 3. データの内容を検証
      const todos = response.data!;
      expect(todos.some((todo) => todo.title === 'テストTodo1')).toBe(true);
      expect(todos.some((todo) => todo.title === 'テストTodo2')).toBe(true);
    });
  });
});
