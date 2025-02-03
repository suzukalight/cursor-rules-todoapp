import { InMemoryTodoRepository } from '@cursor-rules-todoapp/domain/src/repositories/in-memory-todo-repository';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import { createContext } from './context';
import { appRouter } from './router';
import { TodoUseCaseImpl } from './usecases/todo-impl';

// リポジトリの初期化
const todoRepository = new InMemoryTodoRepository();

// ユースケースの初期化
const todoUseCase = new TodoUseCaseImpl(todoRepository);

// Expressアプリケーションの作成
const app = express();

// CORSの設定
app.use(cors());

// tRPCミドルウェアの設定
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter({ todoUseCase }),
    createContext: (opts) => createContext(opts, { todoUseCase }),
  })
);

// サーバーの起動
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}`);
});
