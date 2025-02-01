import { describe, expect, test } from 'vitest';
import { Todo } from '../todo/todo';
import { UpdateTodoUseCase } from './update-todo';
import { InMemoryTodoRepository } from '../repositories/in-memory-todo-repository';

describe('UpdateTodoUseCase', () => {
  test('タイトルを更新できる', async () => {
    const todo = Todo.create({ title: 'テストタスク' });
    const repository = new InMemoryTodoRepository([todo]);
    const useCase = new UpdateTodoUseCase(repository);

    const result = await useCase.execute({
      id: todo.id,
      title: '新しいタイトル',
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.title).toBe('新しいタイトル');
    }
  });

  test('説明を更新できる', async () => {
    const todo = Todo.create({ title: 'テストタスク' });
    const repository = new InMemoryTodoRepository([todo]);
    const useCase = new UpdateTodoUseCase(repository);

    const result = await useCase.execute({
      id: todo.id,
      description: '新しい説明',
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.description).toBe('新しい説明');
    }
  });

  test('存在しないTodoの場合はエラーを返す', async () => {
    const repository = new InMemoryTodoRepository([]);
    const useCase = new UpdateTodoUseCase(repository);

    const result = await useCase.execute({
      id: '123',
      title: '新しいタイトル',
    });

    expect(result.isErr()).toBe(true);
  });
});
