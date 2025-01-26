import type { Todo, TodoId } from '../entities/todo';
import type { TodoRepository } from '../repositories/todo-repository';

export interface UpdateTodoInput {
  id: TodoId;
  title?: string;
  description?: string;
}

export class UpdateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(input: UpdateTodoInput): Promise<Todo> {
    const todo = await this.todoRepository.findById(input.id);
    if (!todo) {
      throw new Error(`Todo not found: ${input.id}`);
    }

    if (input.title) {
      todo.updateTitle(input.title);
    }
    if (input.description !== undefined) {
      todo.updateDescription(input.description);
    }

    await this.todoRepository.save(todo);
    return todo;
  }
} 