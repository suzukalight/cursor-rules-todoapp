import { Result } from '@cursor-rules-todoapp/common';
import type { TodoRepository } from '../repositories/todo-repository';
import { Todo } from '../todo/todo';
import type { TodoDto, TodoPriority } from '../todo/todo';

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: TodoPriority;
  dueDate?: Date;
}

export class CreateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(input: CreateTodoInput): Promise<Result<TodoDto, Error>> {
    try {
      const todo = Todo.create({
        title: input.title,
        description: input.description,
        priority: input.priority ?? 'medium',
        dueDate: input.dueDate,
      });

      const savedTodo = await this.todoRepository.save(todo.toDto());
      return Result.ok(savedTodo);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}
