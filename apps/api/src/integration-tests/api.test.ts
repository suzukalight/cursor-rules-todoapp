import type { Server } from 'node:http';
import type { Todo, TodoRepository } from '@cursor-rules-todoapp/domain';
import { TestDatabase } from '@cursor-rules-todoapp/repo-sqlite/src/test-utils/database';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import express from 'express';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createContainer } from '../container';
import { handleError } from '../errors';
import { createAppRouter } from '../router';
import { TRPCTestHelper } from '../test-utils/trpc-test-helper';

// テスト環境を設定
process.env.NODE_ENV = 'test';

interface CreateTodoInput {
  title: string;
  description?: string;
}

interface ChangeStatusInput {
  id: string;
  action: 'complete' | 'cancel';
}

describe('API統合テスト', () => {
  let app: express.Express;
  let server: Server;
  let todoRepository: TodoRepository;
  let testDb: TestDatabase;
  let helper: TRPCTestHelper;

  beforeAll(async () => {
    await TestDatabase.initialize();
  });

  beforeEach(async () => {
    testDb = new TestDatabase();
    await testDb.setup();

    // アプリケーションをセットアップ
    app = express();
    const container = createContainer(testDb.getDatabaseUrl());
    todoRepository = container.todoRepository;
    const appRouter = createAppRouter(todoRepository);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(
      '/trpc',
      createExpressMiddleware({
        router: appRouter,
        onError: ({ error }) => {
          handleError(error);
        },
        createContext: () => ({}),
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
    await testDb.cleanup();
    server.close();
  });

  describe('Todo API', () => {
    it('Todoを作成して取得できる', async () => {
      const createResponse = await helper.post<CreateTodoInput, Todo>('todo.create', {
        title: 'テストTodo',
        description: 'テストの説明',
      });
      helper.expectSuccess(createResponse);
      expect(createResponse.data).toBeDefined();

      const findResponse = await helper.get<string, Todo>('todo.findById', createResponse.data!.id);
      helper.expectSuccess(findResponse);
      expect(findResponse.data).toBeDefined();
      expect(findResponse.data).toMatchObject({
        title: 'テストTodo',
        description: 'テストの説明',
      });
    });

    it('存在しないTodoの取得でエラーになる', async () => {
      const response = await helper.get<string, Todo>('todo.findById', 'non-existent-id');
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
        action: 'complete',
      });
      helper.expectSuccess(completeResponse);
      expect(completeResponse.data).toBeDefined();
      expect(completeResponse.data!.status).toBe('completed');
    });

    it('全てのTodoを取得できる', async () => {
      await helper.post<CreateTodoInput, Todo>('todo.create', {
        title: 'テストTodo1',
        description: 'テストの説明1',
      });

      await helper.post<CreateTodoInput, Todo>('todo.create', {
        title: 'テストTodo2',
        description: 'テストの説明2',
      });

      const response = await helper.get<void, Todo[]>('todo.findAll');
      helper.expectSuccess(response);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data!)).toBe(true);
      expect(response.data!.length).toBeGreaterThanOrEqual(2);
    });
  });
});
