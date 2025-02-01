import { describe, expect, test } from 'vitest';
import { Todo } from '../todo/todo';
import { ChangeTodoStatusUseCase } from './change-todo-status';
import { InMemoryTodoRepository } from '../repositories/in-memory-todo-repository';

describe('ChangeTodoStatusUseCase', () => {
  test('Todoを完了状態に変更できる', async () => {
    const todo = Todo.create({ title: 'テストタスク' });
    const repository = new InMemoryTodoRepository([todo]);
    const useCase = new ChangeTodoStatusUseCase(repository);

    const result = await useCase.execute({ id: todo.id, status: 'completed' });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.status).toBe('completed');
      expect(result.value.completedAt).toBeDefined();
    }
  });

  test('Todoを未完了状態に変更できる', async () => {
    const todo = Todo.create({ title: 'テストタスク' });
    todo.complete();
    const repository = new InMemoryTodoRepository([todo]);
    const useCase = new ChangeTodoStatusUseCase(repository);

    const result = await useCase.execute({ id: todo.id, status: 'pending' });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.status).toBe('pending');
      expect(result.value.completedAt).toBeUndefined();
    }
  });

  test('存在しないTodoの場合はエラーを返す', async () => {
    const repository = new InMemoryTodoRepository([]);
    const useCase = new ChangeTodoStatusUseCase(repository);

    const result = await useCase.execute({ id: '123', status: 'completed' });

    expect(result.isErr()).toBe(true);
  });

  test('既に完了済みのTodoを完了しようとするとエラーを返す', async () => {
    const todo = Todo.create({ title: 'テストタスク' });
    todo.complete();
    const repository = new InMemoryTodoRepository([todo]);
    const useCase = new ChangeTodoStatusUseCase(repository);

    const result = await useCase.execute({ id: todo.id, status: 'completed' });

    expect(result.isErr()).toBe(true);
  });

  test('既に未完了のTodoを未完了にしようとするとエラーを返す', async () => {
    const todo = Todo.create({ title: 'テストタスク' });
    const repository = new InMemoryTodoRepository([todo]);
    const useCase = new ChangeTodoStatusUseCase(repository);

    const result = await useCase.execute({ id: todo.id, status: 'pending' });

    expect(result.isErr()).toBe(true);
  });
});
