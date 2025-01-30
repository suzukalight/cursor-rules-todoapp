import type { Todo, TodoId } from '../entities/todo';
import type { TodoRepository } from '../repositories/todo-repository';

export type TodoStatusAction = 'complete' | 'cancel';

export interface ChangeTodoStatusInput {
  id: TodoId;
  action: TodoStatusAction;
}

export class ChangeTodoStatusUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(input: ChangeTodoStatusInput): Promise<Todo> {
    const todo = await this.todoRepository.findById(input.id);
    if (!todo) {
      throw new Error(`Todo not found: ${input.id}`);
    }

    switch (input.action) {
      case 'complete':
        todo.complete();
        break;
      case 'cancel':
        todo.cancel();
        break;
      default:
        throw new Error(`Invalid action: ${input.action}`);
    }

    await this.todoRepository.save(todo);
    return todo;
  }
}
