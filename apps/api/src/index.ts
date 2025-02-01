import { InMemoryTodoRepository } from '@cursor-rules-todoapp/domain';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import type { NextApiHandler } from 'next';
import { createContext } from './context';
import { appRouter } from './router';
import { TodoUseCaseImpl } from './usecases/todo-impl';

// リポジトリの初期化
const todoRepository = new InMemoryTodoRepository();

// ユースケースの初期化
const todoUseCase = new TodoUseCaseImpl(todoRepository);

// tRPCハンドラーの作成
const handler: NextApiHandler = createNextApiHandler({
  router: appRouter({ todoUseCase }),
  createContext: (opts) => createContext(opts, { todoUseCase }),
});

export default handler;
