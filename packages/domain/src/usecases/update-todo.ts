import { Result } from '@cursor-rules-todoapp/common';
import type { Todo } from '../todo/todo';
import type { TodoRepository } from '../repositories/todo-repository';

type UpdateTodoInput = {
  id: string;
  title?: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: Date | undefined;
};

export class UpdateTodoUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(input: UpdateTodoInput): Promise<Result<Todo, Error>> {
    const todo = await this.repository.findById(input.id);
    if (!todo) {
      return Result.err(new Error('Todo not found'));
    }

    try {
      if (input.title !== undefined) {
        todo.updateTitle(input.title);
      }
      if (input.description !== undefined) {
        todo.updateDescription(input.description);
      }
      if (input.priority !== undefined) {
        todo.updatePriority(input.priority);
      }
      if ('dueDate' in input) {
        todo.updateDueDate(input.dueDate);
      }

      const savedTodo = await this.repository.save(todo);
      return Result.ok(savedTodo);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}
