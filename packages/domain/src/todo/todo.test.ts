import { describe, expect, test } from 'vitest';
import { Todo } from './todo';

describe('Todo', () => {
  test('Todoを作成できる', () => {
    const todo = Todo.create({ title: 'テストタスク' });

    expect(todo.id).toBeDefined();
    expect(todo.title).toBe('テストタスク');
    expect(todo.status).toBe('pending');
    expect(todo.priority).toBe('medium');
    expect(todo.createdAt).toBeDefined();
    expect(todo.updatedAt).toBeDefined();
    expect(todo.completedAt).toBeUndefined();
  });

  test('Todoを完了状態に変更できる', () => {
    const todo = Todo.create({ title: 'テストタスク' });
    const oldUpdatedAt = todo.updatedAt;

    todo.complete();

    expect(todo.status).toBe('completed');
    expect(todo.completedAt).toBeDefined();
    expect(todo.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  test('Todoを未完了状態に変更できる', () => {
    const todo = Todo.create({ title: 'テストタスク' });
    todo.complete();
    const oldUpdatedAt = todo.updatedAt;

    todo.cancel();

    expect(todo.status).toBe('pending');
    expect(todo.completedAt).toBeUndefined();
    expect(todo.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  test('Todoのタイトルを更新できる', () => {
    const todo = Todo.create({ title: 'テストタスク' });
    const oldUpdatedAt = todo.updatedAt;

    todo.updateTitle('新しいタイトル');

    expect(todo.title).toBe('新しいタイトル');
    expect(todo.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  test('Todoの優先度を更新できる', () => {
    const todo = Todo.create({ title: 'テストタスク' });
    const oldUpdatedAt = todo.updatedAt;

    todo.updatePriority('high');

    expect(todo.priority).toBe('high');
    expect(todo.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  test('Todoの期限を更新できる', () => {
    const todo = Todo.create({ title: 'テストタスク' });
    const oldUpdatedAt = todo.updatedAt;
    const dueDate = new Date('2024-12-31');

    todo.updateDueDate(dueDate);

    expect(todo.dueDate?.getTime()).toBe(dueDate.getTime());
    expect(todo.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  test('Todoの期限を削除できる', () => {
    const todo = Todo.create({ title: 'テストタスク', dueDate: new Date('2024-12-31') });
    const oldUpdatedAt = todo.updatedAt;

    todo.updateDueDate(undefined);

    expect(todo.dueDate).toBeUndefined();
    expect(todo.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  test('DTOからTodoを再構築できる', () => {
    const now = new Date();
    const dueDate = new Date('2024-12-31');
    const dto = {
      id: '123',
      title: 'テストタスク',
      description: 'テストの説明',
      status: 'pending' as const,
      priority: 'high' as const,
      dueDate,
      createdAt: now,
      updatedAt: now,
      completedAt: undefined,
    };

    const todo = Todo.reconstruct(dto);

    expect(todo.id).toBe(dto.id);
    expect(todo.title).toBe(dto.title);
    expect(todo.description).toBe(dto.description);
    expect(todo.status).toBe(dto.status);
    expect(todo.priority).toBe(dto.priority);
    expect(todo.dueDate?.getTime()).toBe(dto.dueDate.getTime());
    expect(todo.createdAt.getTime()).toBe(dto.createdAt.getTime());
    expect(todo.updatedAt.getTime()).toBe(dto.updatedAt.getTime());
    expect(todo.completedAt).toBeUndefined();
  });

  test('TodoをDTOに変換できる', () => {
    const todo = Todo.create({
      title: 'テストタスク',
      description: 'テストの説明',
      priority: 'high',
      dueDate: new Date('2024-12-31'),
    });

    const dto = todo.toDto();

    expect(dto.id).toBe(todo.id);
    expect(dto.title).toBe(todo.title);
    expect(dto.description).toBe(todo.description);
    expect(dto.status).toBe(todo.status);
    expect(dto.priority).toBe(todo.priority);
    expect(dto.dueDate?.getTime()).toBe(todo.dueDate?.getTime());
    expect(dto.createdAt.getTime()).toBe(todo.createdAt.getTime());
    expect(dto.updatedAt.getTime()).toBe(todo.updatedAt.getTime());
    expect(dto.completedAt).toBeUndefined();
  });

  test('TodoをJSONに変換できる', () => {
    const todo = Todo.create({
      title: 'テストタスク',
      description: 'テストの説明',
      priority: 'high',
      dueDate: new Date('2024-12-31'),
    });

    const json = todo.toJSON();

    expect(json).toEqual(todo.toDto());
  });
}); 