import { Todo } from '../todo/todo';
import type { TodoRepository } from './todo-repository';

export class InMemoryTodoRepository implements TodoRepository {
  #todos: Todo[];

  constructor(initialTodos: Todo[] = []) {
    this.#todos = initialTodos;
  }

  async findById(id: string): Promise<Todo | null> {
    return this.#todos.find((todo) => todo.id === id) ?? null;
  }

  async findAll(): Promise<Todo[]> {
    return [...this.#todos];
  }

  async save(todo: Todo): Promise<Todo> {
    const index = this.#todos.findIndex((t) => t.id === todo.id);
    if (index === -1) {
      this.#todos.push(todo);
    } else {
      this.#todos[index] = todo;
    }
    return todo;
  }

  async delete(id: string): Promise<void> {
    const index = this.#todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.#todos.splice(index, 1);
    }
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    return fn();
  }
} 