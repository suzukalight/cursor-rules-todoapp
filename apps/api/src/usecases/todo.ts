import { Result } from '@cursor-rules-todoapp/common';
import { Todo, type TodoDto } from '@cursor-rules-todoapp/domain/src/todo/todo';
import type { TodoRepository } from '@cursor-rules-todoapp/domain/src/repositories/todo-repository';

export interface TodoUseCase {
  findAll(): Promise<Result<TodoDto[], Error>>;
  findById(id: string): Promise<Result<TodoDto, Error>>;
  create(input: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }): Promise<Result<TodoDto, Error>>;
  update(input: {
    id: string;
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }): Promise<Result<TodoDto, Error>>;
  delete(input: { id: string }): Promise<Result<void, Error>>;
  complete(input: { id: string }): Promise<Result<TodoDto, Error>>;
  cancel(input: { id: string }): Promise<Result<TodoDto, Error>>;
  filter(input: {
    status?: 'pending' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    dueDateBefore?: Date;
    dueDateAfter?: Date;
  }): Promise<Result<TodoDto[], Error>>;
  sort(input: {
    sortBy: 'createdAt' | 'priority' | 'dueDate';
    order: 'asc' | 'desc';
  }): Promise<Result<TodoDto[], Error>>;
}

export class TodoUseCaseImpl implements TodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async findAll(): Promise<Result<TodoDto[], Error>> {
    try {
      const todos = await this.todoRepository.findAll();
      return Result.ok(todos.map((todo: Todo) => todo.toJSON()));
    } catch (error) {
      return Result.err(error as Error);
    }
  }

  async findById(id: string): Promise<Result<TodoDto, Error>> {
    try {
      const todo = await this.todoRepository.findById(id);
      if (!todo) {
        return Result.err(new Error('Todo not found'));
      }
      return Result.ok(todo.toJSON());
    } catch (error) {
      return Result.err(error as Error);
    }
  }

  async create(input: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }): Promise<Result<TodoDto, Error>> {
    try {
      const todo = Todo.create({
        title: input.title,
        description: input.description,
        priority: input.priority ?? 'medium',
        dueDate: input.dueDate,
      });
      const saved = await this.todoRepository.save(todo);
      return Result.ok(saved.toJSON());
    } catch (error) {
      return Result.err(error as Error);
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
      const todo = await this.todoRepository.findById(input.id);
      if (!todo) {
        return Result.err(new Error('Todo not found'));
      }

      if (input.title) {
        todo.updateTitle(input.title);
      }
      if (input.description !== undefined) {
        todo.updateDescription(input.description);
      }
      if (input.priority) {
        todo.updatePriority(input.priority);
      }
      if (input.dueDate !== undefined) {
        todo.updateDueDate(input.dueDate);
      }

      const saved = await this.todoRepository.save(todo);
      return Result.ok(saved.toJSON());
    } catch (error) {
      return Result.err(error as Error);
    }
  }

  async delete(input: { id: string }): Promise<Result<void, Error>> {
    try {
      await this.todoRepository.delete(input.id);
      return Result.ok(undefined);
    } catch (error) {
      return Result.err(error as Error);
    }
  }

  async complete(input: { id: string }): Promise<Result<TodoDto, Error>> {
    try {
      const todo = await this.todoRepository.findById(input.id);
      if (!todo) {
        return Result.err(new Error('Todo not found'));
      }

      todo.complete();
      const saved = await this.todoRepository.save(todo);
      return Result.ok(saved.toJSON());
    } catch (error) {
      return Result.err(error as Error);
    }
  }

  async cancel(input: { id: string }): Promise<Result<TodoDto, Error>> {
    try {
      const todo = await this.todoRepository.findById(input.id);
      if (!todo) {
        return Result.err(new Error('Todo not found'));
      }

      todo.cancel();
      const saved = await this.todoRepository.save(todo);
      return Result.ok(saved.toJSON());
    } catch (error) {
      return Result.err(error as Error);
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
      const filtered = todos.filter((todo: Todo) => {
        if (input.status && todo.status !== input.status) return false;
        if (input.priority && todo.priority !== input.priority) return false;
        if (input.dueDateBefore && todo.dueDate && todo.dueDate > input.dueDateBefore) return false;
        if (input.dueDateAfter && todo.dueDate && todo.dueDate < input.dueDateAfter) return false;
        return true;
      });
      return Result.ok(filtered.map((todo: Todo) => todo.toJSON()));
    } catch (error) {
      return Result.err(error as Error);
    }
  }

  async sort(input: {
    sortBy: 'createdAt' | 'priority' | 'dueDate';
    order: 'asc' | 'desc';
  }): Promise<Result<TodoDto[], Error>> {
    try {
      const todos = await this.todoRepository.findAll();
      const sorted = [...todos].sort((a: Todo, b: Todo) => {
        const order = input.order === 'asc' ? 1 : -1;
        switch (input.sortBy) {
          case 'createdAt':
            return (a.createdAt.getTime() - b.createdAt.getTime()) * order;
          case 'priority': {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return (priorityOrder[a.priority] - priorityOrder[b.priority]) * order;
          }
          case 'dueDate': {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return order;
            if (!b.dueDate) return -order;
            return (a.dueDate.getTime() - b.dueDate.getTime()) * order;
          }
          default:
            return 0;
        }
      });
      return Result.ok(sorted.map((todo: Todo) => todo.toJSON()));
    } catch (error) {
      return Result.err(error as Error);
    }
  }
}
