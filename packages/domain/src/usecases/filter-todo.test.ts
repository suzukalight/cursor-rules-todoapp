import { describe, expect, test } from 'vitest';
import { FilterTodoUseCase } from './filter-todo';
import { InMemoryTodoRepository } from '../repositories/in-memory-todo-repository';
import { Todo } from '../todo/todo';

describe('FilterTodoUseCase', () => {
  test('ステータスでフィルタリングできる', async () => {
    const repository = new InMemoryTodoRepository();
    const useCase = new FilterTodoUseCase(repository);

    // テスト用のTodoを作成
    const todo1 = Todo.create({
      title: 'タスク1',
      priority: 'high',
    });
    await repository.save(todo1);
    await todo1.complete();
    await repository.save(todo1);

    const todo2 = Todo.create({
      title: 'タスク2',
      priority: 'medium',
    });
    await repository.save(todo2);

    // 完了済みのTodoをフィルタリング
    const completedResult = await useCase.execute({ status: 'completed' });
    expect(completedResult.isOk()).toBe(true);
    if (completedResult.isOk()) {
      expect(completedResult.value).toHaveLength(1);
      expect(completedResult.value[0].title).toBe('タスク1');
    }

    // 未完了のTodoをフィルタリング
    const pendingResult = await useCase.execute({ status: 'pending' });
    expect(pendingResult.isOk()).toBe(true);
    if (pendingResult.isOk()) {
      expect(pendingResult.value).toHaveLength(1);
      expect(pendingResult.value[0].title).toBe('タスク2');
    }
  });

  test('優先度でフィルタリングできる', async () => {
    const repository = new InMemoryTodoRepository();
    const useCase = new FilterTodoUseCase(repository);

    // テスト用のTodoを作成
    const todo1 = Todo.create({
      title: 'タスク1',
      priority: 'high',
    });
    await repository.save(todo1);

    const todo2 = Todo.create({
      title: 'タスク2',
      priority: 'medium',
    });
    await repository.save(todo2);

    const todo3 = Todo.create({
      title: 'タスク3',
      priority: 'low',
    });
    await repository.save(todo3);

    // 高優先度のTodoをフィルタリング
    const highResult = await useCase.execute({ priority: 'high' });
    expect(highResult.isOk()).toBe(true);
    if (highResult.isOk()) {
      expect(highResult.value).toHaveLength(1);
      expect(highResult.value[0].title).toBe('タスク1');
    }

    // 中優先度のTodoをフィルタリング
    const mediumResult = await useCase.execute({ priority: 'medium' });
    expect(mediumResult.isOk()).toBe(true);
    if (mediumResult.isOk()) {
      expect(mediumResult.value).toHaveLength(1);
      expect(mediumResult.value[0].title).toBe('タスク2');
    }
  });

  test('期限でフィルタリングできる', async () => {
    const repository = new InMemoryTodoRepository();
    const useCase = new FilterTodoUseCase(repository);

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

    // 期限が2024-03-01以前のTodoをフィルタリング
    const beforeResult = await useCase.execute({
      dueDateBefore: new Date('2024-03-01'),
    });
    expect(beforeResult.isOk()).toBe(true);
    if (beforeResult.isOk()) {
      expect(beforeResult.value).toHaveLength(1);
      expect(beforeResult.value[0].title).toBe('タスク1');
    }

    // 期限が2024-03-01以降のTodoをフィルタリング
    const afterResult = await useCase.execute({
      dueDateAfter: new Date('2024-03-01'),
    });
    expect(afterResult.isOk()).toBe(true);
    if (afterResult.isOk()) {
      expect(afterResult.value).toHaveLength(1);
      expect(afterResult.value[0].title).toBe('タスク2');
    }
  });

  test('複数の条件を組み合わせてフィルタリングできる', async () => {
    const repository = new InMemoryTodoRepository();
    const useCase = new FilterTodoUseCase(repository);

    // テスト用のTodoを作成
    const todo1 = Todo.create({
      title: 'タスク1',
      priority: 'high',
      dueDate: new Date('2024-01-01'),
    });
    await repository.save(todo1);

    const todo2 = Todo.create({
      title: 'タスク2',
      priority: 'high',
      dueDate: new Date('2024-06-01'),
    });
    await repository.save(todo2);

    const todo3 = Todo.create({
      title: 'タスク3',
      priority: 'medium',
      dueDate: new Date('2024-01-01'),
    });
    await repository.save(todo3);

    // 高優先度かつ期限が2024-03-01以前のTodoをフィルタリング
    const result = await useCase.execute({
      priority: 'high',
      dueDateBefore: new Date('2024-03-01'),
    });
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toHaveLength(1);
      expect(result.value[0].title).toBe('タスク1');
    }
  });
}); 