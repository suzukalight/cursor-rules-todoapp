import type { Server } from 'node:http';
import type { Todo } from '@cursor-rules-todoapp/domain';
import { TodoRepository } from '@cursor-rules-todoapp/repo-sqlite';
import { TestDatabase } from '@cursor-rules-todoapp/repo-sqlite/src/test-utils/database';
import { PrismaClient } from '@prisma/client';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import express from 'express';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { handleError } from '../errors';
import { appRouter } from '../router';
import { TRPCTestHelper } from '../test-utils/trpc-test-helper';
import { TodoUseCaseImpl } from '../usecases/todo';

// テスト環境を設定
process.env.NODE_ENV = 'test';

interface CreateTodoInput {
  title: string;
  description?: string;
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
      const response = await helper.post<CreateTodoInput, Todo>('todo.create', {
        title: 'テストTodo',
        description: 'テストの説明',
      });

      helper.expectSuccess(response);
      expect(response.data).toBeDefined();
      expect(response.data!.title).toBe('テストTodo');
      expect(response.data!.description).toBe('テストの説明');
    });

    it('存在しないTodoの取得でエラーになる', async () => {
      const response = await helper.get<{ id: string }, Todo>('todo.findById', {
        id: 'non-existent-id',
      });
      helper.expectError(response, 404, 'Todo not found');
    });

    it('不正なデータでTodoを作成するとバリデーションエラーになる', async () => {
      const response = await helper.post<CreateTodoInput, Todo>('todo.create', {
        description: 'テストの説明',
      } as CreateTodoInput);
      helper.expectError(response, 400, 'Required');
    });

    it('Todoのステータスを変更できる', async () => {
      const createResponse = await helper.post<CreateTodoInput, Todo>('todo.create', {
        title: 'テストTodo',
        description: 'テストの説明',
      });
      helper.expectSuccess(createResponse);
      expect(createResponse.data).toBeDefined();

      const completeResponse = await helper.post<ChangeStatusInput, Todo>('todo.changeStatus', {
        id: createResponse.data!.id,
        status: 'completed',
      });
      helper.expectSuccess(completeResponse);
      expect(completeResponse.data).toBeDefined();
      expect(completeResponse.data!.status).toBe('completed');
    });

    it('Todoの一覧を取得できる', async () => {
      await helper.post<CreateTodoInput, Todo>('todo.create', {
        title: 'テストTodo1',
        description: 'テストの説明1',
      });

      await helper.post<CreateTodoInput, Todo>('todo.create', {
        title: 'テストTodo2',
        description: 'テストの説明2',
      });

      const response = await helper.get<undefined, Todo[]>('todo.findAll');
      helper.expectSuccess(response);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data!)).toBe(true);
      expect(response.data!.length).toBeGreaterThanOrEqual(2);
    });
  });
});
