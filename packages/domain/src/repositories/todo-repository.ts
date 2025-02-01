import type { Todo } from '../todo/todo';

export interface TodoRepository {
  save(todo: Todo): Promise<Todo>;
  findById(id: string): Promise<Todo | null>;
  findAll(): Promise<Todo[]>;
  delete(id: string): Promise<void>;
  transaction<T>(operation: () => Promise<T>): Promise<T>;
}
