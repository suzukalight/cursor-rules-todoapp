import type { TodoRepository } from '@cursor-rules-todoapp/domain';
import { router } from '../trpc';
import type { TodoUseCase } from '../usecases/todo';
import { TodoUseCaseImpl } from '../usecases/todo';
import { filterRouter } from './filter';
import { sortRouter } from './sort';
import { todoRouter } from './todo';

export const appRouter = ({ todoUseCase }: { todoUseCase: TodoUseCase }) =>
  router({
    todo: todoRouter({ todoUseCase }),
    filter: filterRouter({ todoUseCase }),
    sort: sortRouter({ todoUseCase }),
  });

export const createAppRouter = (todoRepository: TodoRepository) => {
  const todoUseCase = new TodoUseCaseImpl(todoRepository);
  return appRouter({ todoUseCase });
};

export type AppRouter = ReturnType<typeof appRouter>;
