import { describe, expect, it, vi } from 'vitest';
import { Todo } from '../entities/todo';
import { TodoNotFoundError } from '../errors/todo-error';
import type { TodoRepository } from '../repositories/todo-repository';
import { FindTodoUseCase } from './find-todo';

describe('FindTodoUseCase', () => {
  const mockTodoRepository: TodoRepository = {
    save: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
  };

  const useCase = new FindTodoUseCase(mockTodoRepository);

  describe('findById', () => {
    it('指定したIDのTodoを取得できる', async () => {
      const todo = Todo.create({ title: 'test todo', status: 'pending' });
      vi.spyOn(mockTodoRepository, 'findById').mockResolvedValueOnce(todo);

      const result = await useCase.findById(todo.id);

      expect(result).toEqual(todo);
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(todo.id);
    });

    it('存在しないTodoの場合はエラーを返す', async () => {
      const id = 'non-existent-id';
      vi.spyOn(mockTodoRepository, 'findById').mockResolvedValueOnce(null);

      await expect(useCase.findById(id)).rejects.toThrow(TodoNotFoundError);
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('findAll', () => {
    it('全てのTodoを取得できる', async () => {
      const todos = [
        Todo.create({ title: 'todo 1', status: 'pending' }),
        Todo.create({ title: 'todo 2', status: 'pending' }),
      ];
      vi.spyOn(mockTodoRepository, 'findAll').mockResolvedValueOnce(todos);

      const result = await useCase.findAll();

      expect(result).toEqual(todos);
      expect(mockTodoRepository.findAll).toHaveBeenCalled();
    });

    it('Todoが存在しない場合は空配列を返す', async () => {
      vi.spyOn(mockTodoRepository, 'findAll').mockResolvedValueOnce([]);

      const result = await useCase.findAll();

      expect(result).toEqual([]);
      expect(mockTodoRepository.findAll).toHaveBeenCalled();
    });
  });
});
