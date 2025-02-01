import { TodoUseCaseImpl } from './usecases/todo';
import { TodoRepository } from '@cursor-rules-todoapp/repo-sqlite';
import { PrismaClient } from '@prisma/client';

export interface Container {
  todoRepository: TodoRepository;
  todoUseCase: TodoUseCaseImpl;
}

export const createContainer = (databaseUrl: string): Container => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
  const todoRepository = new TodoRepository(prisma);
  const todoUseCase = new TodoUseCaseImpl(todoRepository);
  return { todoRepository, todoUseCase };
}; 