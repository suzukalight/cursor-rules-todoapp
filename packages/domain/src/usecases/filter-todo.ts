import { Result } from '@cursor-rules-todoapp/common';
import type { TodoRepository } from '../repositories/todo-repository';
import type { TodoDto, TodoPriority, TodoStatus } from '../todo/todo';

export interface FilterTodoInput {
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDateBefore?: Date;
  dueDateAfter?: Date;
}

export class FilterTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(input: FilterTodoInput): Promise<Result<TodoDto[], Error>> {
    try {
      const todos = await this.todoRepository.findAll();
      const filteredTodos = todos.filter((todo) => {
        // ステータスでフィルタリング
        if (input.status && todo.status !== input.status) {
          return false;
        }

        // 優先度でフィルタリング
        if (input.priority && todo.priority !== input.priority) {
          return false;
        }

        // 期限でフィルタリング
        if (input.dueDateBefore && todo.dueDate && todo.dueDate > input.dueDateBefore) {
          return false;
        }

        if (input.dueDateAfter && todo.dueDate && todo.dueDate < input.dueDateAfter) {
          return false;
        }

        return true;
      });

      return Result.ok(filteredTodos);
    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}
