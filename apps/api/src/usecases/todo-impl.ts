import { Result } from '@cursor-rules-todoapp/common';
import type { TodoDto } from '@cursor-rules-todoapp/domain';
import {
  ChangeTodoStatusUseCase,
  CreateTodoUseCase,
  DeleteTodoUseCase,
  FilterTodoUseCase,
  FindTodoUseCase,
  SortTodoUseCase,
  type TodoRepository,
  UpdateTodoUseCase,
} from '@cursor-rules-todoapp/domain';
import type { TodoUseCase } from './todo';

export class TodoUseCaseImpl implements TodoUseCase {
  private readonly createTodoUseCase: CreateTodoUseCase;
  private readonly updateTodoUseCase: UpdateTodoUseCase;
  private readonly deleteTodoUseCase: DeleteTodoUseCase;
  private readonly findTodoUseCase: FindTodoUseCase;
  private readonly changeTodoStatusUseCase: ChangeTodoStatusUseCase;
  private readonly filterTodoUseCase: FilterTodoUseCase;
  private readonly sortTodoUseCase: SortTodoUseCase;

  constructor(todoRepository: TodoRepository) {
    this.createTodoUseCase = new CreateTodoUseCase(todoRepository);
    this.updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
    this.deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);
    this.findTodoUseCase = new FindTodoUseCase(todoRepository);
    this.changeTodoStatusUseCase = new ChangeTodoStatusUseCase(todoRepository);
    this.filterTodoUseCase = new FilterTodoUseCase(todoRepository);
    this.sortTodoUseCase = new SortTodoUseCase(todoRepository);
  }

  async findAll(): Promise<Result<TodoDto[], Error>> {
    const result = await this.findTodoUseCase.findAll();
    if (result.isErr()) {
      return result;
    }
    return Result.ok(result.value.map((todo) => todo.toDto()));
  }

  async findById(id: string): Promise<Result<TodoDto, Error>> {
    const result = await this.findTodoUseCase.findById(id);
    if (result.isErr()) {
      return result;
    }
    return Result.ok(result.value.toDto());
  }

  async create(input: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }): Promise<Result<TodoDto, Error>> {
    const result = await this.createTodoUseCase.execute(input);
    if (result.isErr()) {
      return result;
    }
    return Result.ok(result.value.toDto());
  }

  async update(input: {
    id: string;
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }): Promise<Result<TodoDto, Error>> {
    const result = await this.updateTodoUseCase.execute(input);
    if (result.isErr()) {
      return result;
    }
    return Result.ok(result.value.toDto());
  }

  async delete(input: { id: string }): Promise<Result<void, Error>> {
    return this.deleteTodoUseCase.execute({ id: input.id });
  }

  async complete(input: { id: string }): Promise<Result<TodoDto, Error>> {
    const result = await this.changeTodoStatusUseCase.execute({ id: input.id, status: 'completed' });
    if (result.isErr()) {
      return result;
    }
    return Result.ok(result.value.toDto());
  }

  async cancel(input: { id: string }): Promise<Result<TodoDto, Error>> {
    const result = await this.changeTodoStatusUseCase.execute({ id: input.id, status: 'pending' });
    if (result.isErr()) {
      return result;
    }
    return Result.ok(result.value.toDto());
  }

  async filter(input: {
    status?: 'pending' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    dueDateBefore?: Date;
    dueDateAfter?: Date;
  }): Promise<Result<TodoDto[], Error>> {
    const result = await this.filterTodoUseCase.execute(input);
    if (result.isErr()) {
      return result;
    }
    return Result.ok(result.value.map((todo) => todo.toDto()));
  }

  async sort(input: {
    sortBy: 'createdAt' | 'priority' | 'dueDate';
    order: 'asc' | 'desc';
  }): Promise<Result<TodoDto[], Error>> {
    const result = await this.sortTodoUseCase.execute(input);
    if (result.isErr()) {
      return result;
    }
    return Result.ok(result.value.map((todo) => todo.toDto()));
  }
}
