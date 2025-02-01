import { Result } from '@cursor-rules-todoapp/common';
import type { TodoRepository } from '../repositories/todo-repository';
import type { TodoDto } from '../todo/todo';

export type SortBy = 'createdAt' | 'priority' | 'dueDate';
export type Order = 'asc' | 'desc';

export interface SortTodoInput {
  sortBy: SortBy;
  order: Order;
}

export class SortTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(input: SortTodoInput): Promise<Result<TodoDto[], Error>> {
    try {
      const todos = await this.todoRepository.findAll();
      const sortedTodos = [...todos].sort((a, b) => {
        switch (input.sortBy) {
          case 'createdAt':
            return input.order === 'asc'
              ? a.createdAt.getTime() - b.createdAt.getTime()
              : b.createdAt.getTime() - a.createdAt.getTime();

          case 'priority': {
            const priorityOrder = { low: 0, medium: 1, high: 2 };
            const aValue = priorityOrder[a.priority];
            const bValue = priorityOrder[b.priority];
            return input.order === 'asc' ? aValue - bValue : bValue - aValue;
          }

          case 'dueDate': {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return input.order === 'asc' ? -1 : 1;
            if (!b.dueDate) return input.order === 'asc' ? 1 : -1;
            return input.order === 'asc'
              ? a.dueDate.getTime() - b.dueDate.getTime()
              : b.dueDate.getTime() - a.dueDate.getTime();
          }

          default:
            return 0;
        }
      });

      return Result.ok(sortedTodos);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}
