import { Result } from '@cursor-rules-todoapp/common';
import type { TodoRepository } from '../repositories/todo-repository';
import type { TodoDto } from '../todo/todo';

export class FindTodoUseCase {
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
}
