import { Result } from '@cursor-rules-todoapp/common';
import type { Todo } from '../todo/todo';
import type { TodoRepository } from '../repositories/todo-repository';

export class FindTodoUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async findById(id: string): Promise<Result<Todo, Error>> {
    const todo = await this.repository.findById(id);
    if (!todo) {
      return Result.err(new Error('Todo not found'));
    }
    return Result.ok(todo);
  }

  async findAll(): Promise<Result<Todo[], Error>> {
    try {
      const todos = await this.repository.findAll();
      return Result.ok(todos);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}
