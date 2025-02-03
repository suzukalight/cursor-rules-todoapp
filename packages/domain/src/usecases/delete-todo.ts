import { Result } from '@cursor-rules-todoapp/common';
import type { TodoRepository } from '../repositories/todo-repository';

export interface DeleteTodoInput {
  id: string;
}

export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(input: DeleteTodoInput): Promise<Result<void, Error>> {
    try {
      const todo = await this.todoRepository.findById(input.id);
      if (!todo) {
        return Result.err(new Error('Todo not found'));
      }

      await this.todoRepository.delete(input.id);
      return Result.ok(undefined);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}
