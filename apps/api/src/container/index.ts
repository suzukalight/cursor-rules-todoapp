import { TodoRepository } from '@cursor-rules-todoapp/repo-sqlite';
import { PrismaClient } from '@prisma/client';

export interface Container {
  todoRepository: TodoRepository;
}

export const createContainer = (databaseUrl?: string): Container => {
  const prisma = new PrismaClient(
    databaseUrl
      ? {
          datasources: {
            db: {
              url: databaseUrl,
            },
          },
        }
      : undefined
  );
  const todoRepository = new TodoRepository(prisma);

  return {
    todoRepository,
  };
};
