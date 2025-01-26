import { Todo } from '@cursor-rules-todoapp/domain';
import type { TodoRepository } from '@cursor-rules-todoapp/domain';
import { describe, expect, it, vi } from 'vitest';
import { createTodoRouter } from './todo';

describe('todoRouter', () => {
  const mockTodoRepository: TodoRepository = {
    save: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
  };

  const router = createTodoRouter(mockTodoRepository);
  const caller = router.createCaller({});

  describe('create', () => {
    it('新しいTodoを作成できる', async () => {
      const input = { title: 'test todo' };
      vi.spyOn(mockTodoRepository, 'save').mockResolvedValueOnce();

      const result = await caller.create(input);

      expect(result).toEqual(expect.objectContaining(input));
      expect(mockTodoRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('既存のTodoを更新できる', async () => {
      const todo = Todo.create({ title: 'old title', status: 'pending' });
      const input = { id: todo.id, title: 'new title' };
      vi.spyOn(mockTodoRepository, 'findById').mockResolvedValueOnce(todo);
      vi.spyOn(mockTodoRepository, 'save').mockResolvedValueOnce();

      const result = await caller.update(input);

      expect(result).toEqual(expect.objectContaining({ title: 'new title' }));
      expect(mockTodoRepository.save).toHaveBeenCalled();
    });
  });

  describe('changeStatus', () => {
    it('Todoのステータスを変更できる', async () => {
      const todo = Todo.create({ title: 'test todo', status: 'pending' });
      const input = { id: todo.id, action: 'complete' as const };
      vi.spyOn(mockTodoRepository, 'findById').mockResolvedValueOnce(todo);
      vi.spyOn(mockTodoRepository, 'save').mockResolvedValueOnce();

      const result = await caller.changeStatus(input);

      expect(result).toEqual(expect.objectContaining({ status: 'completed' }));
      expect(mockTodoRepository.save).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('指定したIDのTodoを取得できる', async () => {
      const todo = Todo.create({ title: 'test todo', status: 'pending' });
      vi.spyOn(mockTodoRepository, 'findById').mockResolvedValueOnce(todo);

      const result = await caller.findById(todo.id);

      expect(result).toEqual(todo);
    });
  });

  describe('findAll', () => {
    it('全てのTodoを取得できる', async () => {
      const todos = [
        Todo.create({ title: 'todo 1', status: 'pending' }),
        Todo.create({ title: 'todo 2', status: 'pending' }),
      ];
      vi.spyOn(mockTodoRepository, 'findAll').mockResolvedValueOnce(todos);

      const result = await caller.findAll();

      expect(result).toEqual(todos);
    });
  });

  describe('delete', () => {
    it('指定したTodoを削除できる', async () => {
      const todo = Todo.create({ title: 'test todo', status: 'pending' });
      vi.spyOn(mockTodoRepository, 'delete').mockResolvedValueOnce();

      await caller.delete(todo.id);

      expect(mockTodoRepository.delete).toHaveBeenCalledWith(todo.id);
    });
  });
}); 