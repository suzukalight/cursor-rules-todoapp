import { describe, expect, it, vi } from 'vitest';
import { Todo } from '../entities/todo';
import type { TodoRepository } from '../repositories/todo-repository';
import { ChangeTodoStatusUseCase } from './change-todo-status';

describe('ChangeTodoStatusUseCase', () => {
  const mockTodoRepository: TodoRepository = {
    save: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
  };

  const useCase = new ChangeTodoStatusUseCase(mockTodoRepository);

  it('Todoを完了状態に変更できる', async () => {
    const todo = Todo.create({ title: 'test todo', status: 'pending' });
    vi.spyOn(mockTodoRepository, 'findById').mockResolvedValueOnce(todo);

    await useCase.execute({ id: todo.id, action: 'complete' });

    expect(mockTodoRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'completed',
        completedAt: expect.any(Date),
      })
    );
  });

  it('Todoをキャンセル状態に変更できる', async () => {
    const todo = Todo.create({ title: 'test todo', status: 'pending' });
    vi.spyOn(mockTodoRepository, 'findById').mockResolvedValueOnce(todo);

    await useCase.execute({ id: todo.id, action: 'cancel' });

    expect(mockTodoRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'cancelled',
      })
    );
  });

  it('存在しないTodoの場合はエラーを返す', async () => {
    vi.spyOn(mockTodoRepository, 'findById').mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: 'non-existent-id', action: 'complete' })).rejects.toThrow(
      'Todo not found'
    );
  });

  it('既に完了済みのTodoを完了しようとするとエラーを返す', async () => {
    const todo = Todo.create({ title: 'test todo', status: 'completed' });
    vi.spyOn(mockTodoRepository, 'findById').mockResolvedValueOnce(todo);

    await expect(useCase.execute({ id: todo.id, action: 'complete' })).rejects.toThrow(
      'Todo is already completed'
    );
  });

  it('既にキャンセル済みのTodoをキャンセルしようとするとエラーを返す', async () => {
    const todo = Todo.create({ title: 'test todo', status: 'cancelled' });
    vi.spyOn(mockTodoRepository, 'findById').mockResolvedValueOnce(todo);

    await expect(useCase.execute({ id: todo.id, action: 'cancel' })).rejects.toThrow(
      'Todo is already cancelled'
    );
  });
});
