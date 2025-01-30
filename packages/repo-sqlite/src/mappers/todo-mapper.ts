import { Todo, type TodoStatus } from '@cursor-rules-todoapp/domain';
import type { Prisma, Todo as PrismaTodo } from '@prisma/client';

export const TodoMapper = {
  toPrisma(todo: Todo): Prisma.TodoCreateInput {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description ?? undefined,
      status: todo.status,
    };
  },

  toDomain(todo: PrismaTodo): Todo {
    return Todo.reconstruct({
      id: todo.id,
      title: todo.title,
      description: todo.description ?? undefined,
      status: todo.status as TodoStatus,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    });
  },
} as const;
