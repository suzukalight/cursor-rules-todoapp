import { Result } from '@cursor-rules-todoapp/common';
import { Todo } from '../todo/todo';
import type { TodoPriority } from '../todo/todo';
import type { TodoRepository } from '../repositories/todo-repository';

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: TodoPriority;
  dueDate?: Date;
}

export class CreateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(input: CreateTodoInput): Promise<Result<Todo, Error>> {
    try {
      const todo = Todo.create({
        title: input.title,
        description: input.description,
        priority: input.priority ?? 'medium',
        dueDate: input.dueDate,
      });

      const savedTodo = await this.todoRepository.save(todo);
      return Result.ok(savedTodo);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}
