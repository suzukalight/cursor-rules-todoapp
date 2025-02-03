import { Result } from '@cursor-rules-todoapp/common';
import type { TodoRepository } from '../repositories/todo-repository';
import { Todo } from '../todo/todo';
import type { TodoDto, TodoPriority } from '../todo/todo';

export interface UpdateTodoInput {
  id: string;
  title?: string;
  description?: string;
  priority?: TodoPriority;
  dueDate?: Date;
}

export class UpdateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(input: UpdateTodoInput): Promise<Result<TodoDto, Error>> {
    try {
      const found = await this.todoRepository.findById(input.id);
      if (!found) {
        return Result.err(new Error('Todo not found'));
      }

      const todo = Todo.reconstruct(found);
      if (input.title) todo.updateTitle(input.title);
      if ('description' in input) todo.updateDescription(input.description);
      if (input.priority) todo.updatePriority(input.priority);
      if ('dueDate' in input) todo.updateDueDate(input.dueDate);

      const savedTodo = await this.todoRepository.save(todo.toDto());
      return Result.ok(savedTodo);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}
