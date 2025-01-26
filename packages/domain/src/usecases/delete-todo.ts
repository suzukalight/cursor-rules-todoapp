import { TodoNotFoundError } from '../errors/todo-error';
import type { TodoRepository } from '../repositories/todo-repository';

export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: string): Promise<void> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new TodoNotFoundError(id);
    }

    await this.todoRepository.delete(id);
  }
} 