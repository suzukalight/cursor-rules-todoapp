import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { TodoUseCase } from './usecases/todo';

interface CreateContextOptions {
  todoUseCase: TodoUseCase;
}

export async function createContext(
  _opts: CreateNextContextOptions,
  { todoUseCase }: CreateContextOptions
) {
  return {
    todoUseCase,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
