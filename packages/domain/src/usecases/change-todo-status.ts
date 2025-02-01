import { Result } from '@cursor-rules-todoapp/common';
import type { TodoRepository } from '../repositories/todo-repository';
import { Todo } from '../todo/todo';
import type { TodoDto } from '../todo/todo';

type ChangeTodoStatusInput = {
  id: string;
  status: 'completed' | 'pending';
};

export class ChangeTodoStatusUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(input: ChangeTodoStatusInput): Promise<Result<TodoDto, Error>> {
    try {
      const found = await this.repository.findById(input.id);
      if (!found) {
        return Result.err(new Error('Todo not found'));
      }

      const todo = Todo.reconstruct(found);
      if (input.status === 'completed') {
        todo.complete();
      } else {
        todo.cancel();
      }

      const savedTodo = await this.repository.save(todo.toDto());
      return Result.ok(savedTodo);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}
