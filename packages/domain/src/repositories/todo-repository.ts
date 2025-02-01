import type { TodoDto } from '../todo/todo';

export interface TodoRepository {
  save(todo: TodoDto): Promise<TodoDto>;
  findById(id: string): Promise<TodoDto | null>;
  findAll(): Promise<TodoDto[]>;
  delete(id: string): Promise<void>;
  transaction<T>(operation: () => Promise<T>): Promise<T>;
}
