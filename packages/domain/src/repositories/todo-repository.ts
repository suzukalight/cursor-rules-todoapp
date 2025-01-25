import type { Todo, TodoId } from '../entities/todo';

export interface TodoRepository {
  save(todo: Todo): Promise<void>;
  findById(id: TodoId): Promise<Todo | null>;
  findAll(): Promise<Todo[]>;
  delete(id: TodoId): Promise<void>;
  
  // トランザクション管理用のメソッド
  transaction<T>(operation: () => Promise<T>): Promise<T>;
} 