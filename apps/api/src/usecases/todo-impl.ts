import { Result } from '@cursor-rules-todoapp/common';
import { Todo, type TodoDto } from '@cursor-rules-todoapp/domain';
import type { TodoRepository } from '@cursor-rules-todoapp/domain';
import type { TodoUseCase } from './todo';

export class TodoUseCaseImpl implements TodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async findAll(): Promise<Result<TodoDto[], Error>> {
    try {
      const todos = await this.todoRepository.findAll();
      return Result.ok(todos);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async findById(id: string): Promise<Result<TodoDto, Error>> {
    try {
      const todo = await this.todoRepository.findById(id);
      if (!todo) {
        return Result.err(new Error('Todo not found'));
      }
      return Result.ok(todo);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async create(input: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }): Promise<Result<TodoDto, Error>> {
    try {
      const todo = Todo.create(input);
      const saved = await this.todoRepository.save(todo.toDto());
      return Result.ok(saved);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async update(input: {
    id: string;
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }): Promise<Result<TodoDto, Error>> {
    try {
      const found = await this.todoRepository.findById(input.id);
      if (!found) {
        return Result.err(new Error('Todo not found'));
      }

      const todo = Todo.reconstruct(found);
      if (input.title) todo.updateTitle(input.title);
      if ('description' in input) todo.updateDescription(input.description);
      if (input.priority) todo.updatePriority(input.priority);
      if ('dueDate' in input) todo.updateDueDate(input.dueDate);

      const saved = await this.todoRepository.save(todo.toDto());
      return Result.ok(saved);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async delete(input: { id: string }): Promise<Result<void, Error>> {
    try {
      await this.todoRepository.delete(input.id);
      return Result.ok(undefined);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async complete(input: { id: string }): Promise<Result<TodoDto, Error>> {
    try {
      const found = await this.todoRepository.findById(input.id);
      if (!found) {
        return Result.err(new Error('Todo not found'));
      }

      const todo = Todo.reconstruct(found);
      todo.complete();

      const saved = await this.todoRepository.save(todo.toDto());
      return Result.ok(saved);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async cancel(input: { id: string }): Promise<Result<TodoDto, Error>> {
    try {
      const found = await this.todoRepository.findById(input.id);
      if (!found) {
        return Result.err(new Error('Todo not found'));
      }

      const todo = Todo.reconstruct(found);
      todo.cancel();

      const saved = await this.todoRepository.save(todo.toDto());
      return Result.ok(saved);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async filter(input: {
    status?: 'pending' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    dueDateBefore?: Date;
    dueDateAfter?: Date;
  }): Promise<Result<TodoDto[], Error>> {
    try {
      const todos = await this.todoRepository.findAll();
      const filteredTodos = todos.filter((todo) => {
        if (input.status && todo.status !== input.status) {
          return false;
        }
        if (input.priority && todo.priority !== input.priority) {
          return false;
        }
        if (input.dueDateBefore && todo.dueDate && todo.dueDate > input.dueDateBefore) {
          return false;
        }
        if (input.dueDateAfter && todo.dueDate && todo.dueDate < input.dueDateAfter) {
          return false;
        }
        return true;
      });
      return Result.ok(filteredTodos);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async sort(input: {
    sortBy: 'createdAt' | 'priority' | 'dueDate';
    order: 'asc' | 'desc';
  }): Promise<Result<TodoDto[], Error>> {
    try {
      const todos = await this.todoRepository.findAll();
      const sortedTodos = [...todos].sort((a, b) => {
        switch (input.sortBy) {
          case 'createdAt':
            return input.order === 'asc'
              ? a.createdAt.getTime() - b.createdAt.getTime()
              : b.createdAt.getTime() - a.createdAt.getTime();

          case 'priority': {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
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
