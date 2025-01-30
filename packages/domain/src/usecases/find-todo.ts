import type { Todo, TodoId } from '../entities/todo';
import { TodoNotFoundError } from '../errors/todo-error';
import type { TodoRepository } from '../repositories/todo-repository';

export class FindTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async findById(id: TodoId): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new TodoNotFoundError(id);
    }
    return todo;
  }

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }
}
