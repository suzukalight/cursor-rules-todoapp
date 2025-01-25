import { Todo } from '../entities/todo';
import type { TodoRepository } from '../repositories/todo-repository';

export interface CreateTodoInput {
  title: string;
  description?: string;
}

export class CreateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(input: CreateTodoInput): Promise<Todo> {
    const todo = Todo.create({
      title: input.title,
      description: input.description,
      status: 'pending',
    });

    await this.todoRepository.save(todo);
    return todo;
  }
} 