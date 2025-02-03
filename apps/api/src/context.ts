import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { TodoUseCase } from './usecases/todo';

interface CreateContextOptions {
  todoUseCase: TodoUseCase;
}

export async function createContext(
  _opts: CreateExpressContextOptions,
  { todoUseCase }: CreateContextOptions
) {
  return {
    todoUseCase,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
