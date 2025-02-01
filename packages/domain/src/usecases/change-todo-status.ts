import { Result } from '@cursor-rules-todoapp/common';
import type { Todo } from '../todo/todo';
import type { TodoRepository } from '../repositories/todo-repository';

type ChangeTodoStatusInput = {
  id: string;
  status: 'completed' | 'pending';
};

export class ChangeTodoStatusUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(input: ChangeTodoStatusInput): Promise<Result<Todo, Error>> {
    const todo = await this.repository.findById(input.id);
    if (!todo) {
      return Result.err(new Error('Todo not found'));
    }

    try {
      if (input.status === 'completed') {
        todo.complete();
      } else {
        todo.cancel();
      }

      const savedTodo = await this.repository.save(todo);
      return Result.ok(savedTodo);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}
