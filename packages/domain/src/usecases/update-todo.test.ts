import { describe, expect, it, vi } from 'vitest';
import { Todo } from '../entities/todo';
import type { TodoRepository } from '../repositories/todo-repository';
import { UpdateTodoUseCase } from './update-todo';

describe('UpdateTodoUseCase', () => {
  const mockTodoRepository: TodoRepository = {
    save: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
  };

  const useCase = new UpdateTodoUseCase(mockTodoRepository);

  it('タイトルを更新できる', async () => {
    const todo = Todo.create({ title: 'old title', status: 'pending' });
    vi.spyOn(mockTodoRepository, 'findById').mockResolvedValueOnce(todo);

    await useCase.execute({ id: todo.id, title: 'new title' });

    expect(mockTodoRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      title: 'new title',
    }));
  });

  it('説明を更新できる', async () => {
    const todo = Todo.create({ title: 'title', status: 'pending' });
    vi.spyOn(mockTodoRepository, 'findById').mockResolvedValueOnce(todo);

    await useCase.execute({ id: todo.id, description: 'new description' });

    expect(mockTodoRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      description: 'new description',
    }));
  });

  it('存在しないTodoの場合はエラーを返す', async () => {
    vi.spyOn(mockTodoRepository, 'findById').mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: 'non-existent-id', title: 'new title' }))
      .rejects.toThrow('Todo not found');
  });
}); 