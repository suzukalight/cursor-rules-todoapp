import { describe, expect, test } from 'vitest';
import { SortTodoUseCase } from './sort-todo';
import { InMemoryTodoRepository } from '../repositories/in-memory-todo-repository';
import { Todo } from '../todo/todo';

describe('SortTodoUseCase', () => {
  test('作成日時でソートできる', async () => {
    const repository = new InMemoryTodoRepository();
    const useCase = new SortTodoUseCase(repository);

    // テスト用のTodoを作成
    const todo1 = Todo.create({
      title: 'タスク1',
      priority: 'high',
    });
    await repository.save(todo1);

    // 1秒待機
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const todo2 = Todo.create({
      title: 'タスク2',
      priority: 'medium',
    });
    await repository.save(todo2);

    // 昇順でソート
    const ascResult = await useCase.execute({
      sortBy: 'createdAt',
      order: 'asc',
    });
    expect(ascResult.isOk()).toBe(true);
    if (ascResult.isOk()) {
      expect(ascResult.value[0].title).toBe('タスク1');
      expect(ascResult.value[1].title).toBe('タスク2');
    }

    // 降順でソート
    const descResult = await useCase.execute({
      sortBy: 'createdAt',
      order: 'desc',
    });
    expect(descResult.isOk()).toBe(true);
    if (descResult.isOk()) {
      expect(descResult.value[0].title).toBe('タスク2');
      expect(descResult.value[1].title).toBe('タスク1');
    }
  });

  test('優先度でソートできる', async () => {
    const repository = new InMemoryTodoRepository();
    const useCase = new SortTodoUseCase(repository);

    // テスト用のTodoを作成
    const todo1 = Todo.create({
      title: 'タスク1',
      priority: 'low',
    });
    await repository.save(todo1);

    const todo2 = Todo.create({
      title: 'タスク2',
      priority: 'high',
    });
    await repository.save(todo2);

    const todo3 = Todo.create({
      title: 'タスク3',
      priority: 'medium',
    });
    await repository.save(todo3);

    // 昇順でソート（low -> medium -> high）
    const ascResult = await useCase.execute({
      sortBy: 'priority',
      order: 'asc',
    });
    expect(ascResult.isOk()).toBe(true);
    if (ascResult.isOk()) {
      expect(ascResult.value[0].title).toBe('タスク1');
      expect(ascResult.value[1].title).toBe('タスク3');
      expect(ascResult.value[2].title).toBe('タスク2');
    }

    // 降順でソート（high -> medium -> low）
    const descResult = await useCase.execute({
      sortBy: 'priority',
      order: 'desc',
    });
    expect(descResult.isOk()).toBe(true);
    if (descResult.isOk()) {
      expect(descResult.value[0].title).toBe('タスク2');
      expect(descResult.value[1].title).toBe('タスク3');
      expect(descResult.value[2].title).toBe('タスク1');
    }
  });

  test('期限でソートできる', async () => {
    const repository = new InMemoryTodoRepository();
    const useCase = new SortTodoUseCase(repository);

    // テスト用のTodoを作成
    const todo1 = Todo.create({
      title: 'タスク1',
      priority: 'high',
      dueDate: new Date('2024-01-01'),
    });
    await repository.save(todo1);

    const todo2 = Todo.create({
      title: 'タスク2',
      priority: 'medium',
      dueDate: new Date('2024-06-01'),
    });
    await repository.save(todo2);

    const todo3 = Todo.create({
      title: 'タスク3',
      priority: 'low',
    });
    await repository.save(todo3);

    // 昇順でソート（期限なし -> 期限早い -> 期限遅い）
    const ascResult = await useCase.execute({
      sortBy: 'dueDate',
      order: 'asc',
    });
    expect(ascResult.isOk()).toBe(true);
    if (ascResult.isOk()) {
      expect(ascResult.value[0].title).toBe('タスク3');
      expect(ascResult.value[1].title).toBe('タスク1');
      expect(ascResult.value[2].title).toBe('タスク2');
    }

    // 降順でソート（期限遅い -> 期限早い -> 期限なし）
    const descResult = await useCase.execute({
      sortBy: 'dueDate',
      order: 'desc',
    });
    expect(descResult.isOk()).toBe(true);
    if (descResult.isOk()) {
      expect(descResult.value[0].title).toBe('タスク2');
      expect(descResult.value[1].title).toBe('タスク1');
      expect(descResult.value[2].title).toBe('タスク3');
    }
  });
}); 