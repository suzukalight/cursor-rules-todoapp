import { Todo } from '@cursor-rules-todoapp/domain';
import type { TodoDto, TodoPriority, TodoStatus } from '@cursor-rules-todoapp/domain';
import type { Todo as PrismaTodo } from '@prisma/client';

export const TodoMapper = {
  toPrisma(todo: TodoDto): PrismaTodo {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description ?? null,
      status: todo.status,
      priority: todo.priority,
      dueDate: todo.dueDate ?? null,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      completedAt: todo.completedAt ?? null,
    };
  },

  toDto(todo: PrismaTodo): TodoDto {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description ?? undefined,
      status: todo.status as TodoStatus,
      priority: todo.priority as TodoPriority,
      dueDate: todo.dueDate ?? undefined,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      completedAt: todo.completedAt ?? undefined,
    };
  },

  toDomain(todo: PrismaTodo): Todo {
    const dto: TodoDto = {
      id: todo.id,
      title: todo.title,
      description: todo.description ?? undefined,
      status: todo.status as TodoStatus,
      priority: todo.priority as TodoPriority,
      dueDate: todo.dueDate ?? undefined,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      completedAt: todo.completedAt ?? undefined,
    };
    return Todo.reconstruct(dto);
  },
} as const;
