import { describe, expect, test } from 'vitest';
import { CreateTodoUseCase } from './create-todo';
import { InMemoryTodoRepository } from '../repositories/in-memory-todo-repository';

describe('CreateTodoUseCase', () => {
  test('Todoを作成できる', async () => {
    const repository = new InMemoryTodoRepository();
    const useCase = new CreateTodoUseCase(repository);

    const result = await useCase.execute({
      title: 'テストタスク',
      description: 'テストの説明',
      priority: 'high',
      dueDate: new Date('2024-12-31'),
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.title).toBe('テストタスク');
      expect(result.value.description).toBe('テストの説明');
      expect(result.value.priority).toBe('high');
      expect(result.value.dueDate?.getTime()).toBe(new Date('2024-12-31').getTime());
      expect(result.value.status).toBe('pending');
      expect(result.value.completedAt).toBeUndefined();
      expect(result.value.createdAt).toBeDefined();
      expect(result.value.updatedAt).toBeDefined();
    }
  });

  test('タイトルが空文字列の場合はエラーを返す', async () => {
    const repository = new InMemoryTodoRepository();
    const useCase = new CreateTodoUseCase(repository);

    const result = await useCase.execute({
      title: '',
    });

    expect(result.isErr()).toBe(true);
  });

  test('優先度のみを指定してTodoを作成できる', async () => {
    const repository = new InMemoryTodoRepository();
    const useCase = new CreateTodoUseCase(repository);

    const result = await useCase.execute({
      title: 'テストタスク',
      priority: 'low',
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.title).toBe('テストタスク');
      expect(result.value.priority).toBe('low');
      expect(result.value.description).toBeUndefined();
      expect(result.value.dueDate).toBeUndefined();
    }
  });

  test('期限のみを指定してTodoを作成できる', async () => {
    const repository = new InMemoryTodoRepository();
    const useCase = new CreateTodoUseCase(repository);
    const dueDate = new Date('2024-12-31');

    const result = await useCase.execute({
      title: 'テストタスク',
      dueDate,
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.title).toBe('テストタスク');
      expect(result.value.dueDate?.getTime()).toBe(dueDate.getTime());
      expect(result.value.priority).toBe('medium');
      expect(result.value.description).toBeUndefined();
    }
  });
}); 