import { describe, expect, test } from 'vitest';
import { InMemoryTodoRepository } from '../repositories/in-memory-todo-repository';
import { Todo } from '../todo/todo';
import { DeleteTodoUseCase } from './delete-todo';

describe('DeleteTodoUseCase', () => {
  test('Todoを削除できる', async () => {
    const repository = new InMemoryTodoRepository();
    const useCase = new DeleteTodoUseCase(repository);

    // テスト用のTodoを作成
    const todo = Todo.create({
      title: 'テストタスク',
      description: 'テストの説明',
      priority: 'high',
      dueDate: new Date('2024-12-31'),
    });
    await repository.save(todo);

    // 削除を実行
    const result = await useCase.execute({ id: todo.id });

    // 削除が成功したことを確認
    expect(result.isOk()).toBe(true);

    // 実際にTodoが削除されたことを確認
    const findResult = await repository.findById(todo.id);
    expect(findResult).toBeNull();
  });

  test('存在しないIDを指定した場合はエラーを返す', async () => {
    const repository = new InMemoryTodoRepository();
    const useCase = new DeleteTodoUseCase(repository);

    const result = await useCase.execute({ id: 'non-existent-id' });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe('Todo not found');
    }
  });
});
