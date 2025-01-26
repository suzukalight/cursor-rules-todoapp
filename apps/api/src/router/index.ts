import type { TodoRepository } from '@cursor-rules-todoapp/domain';
import { createTodoRouter } from './todo';
import { trpc } from './trpc';

export const createAppRouter = (todoRepository: TodoRepository) => {
  return trpc.router({
    todo: createTodoRouter(todoRepository),
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>; 