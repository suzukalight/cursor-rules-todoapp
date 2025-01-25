import { TodoRepository } from '@cursor-rules-todoapp/repo-sqlite';
import { PrismaClient } from '@prisma/client';

export interface Container {
  todoRepository: TodoRepository;
}

export const createContainer = (): Container => {
  const prisma = new PrismaClient();
  const todoRepository = new TodoRepository(prisma);

  return {
    todoRepository,
  };
}; 