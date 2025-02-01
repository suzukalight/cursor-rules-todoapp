import { Result } from '@cursor-rules-todoapp/common';
import { describe, expect, it, vi } from 'vitest';
import type { TodoRepository } from '../repositories/todo-repository';
import type { TodoDto } from '../todo/todo';
import { FindTodoUseCase } from './find-todo';

describe('FindTodoUseCase', () => {
  const mockTodoRepository: TodoRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
  };

  const useCase = new FindTodoUseCase(mockTodoRepository);

  const mockTodoDto1: TodoDto = {
    id: 'test-id-1',
    title: 'テストタスク1',
    description: 'テストの説明1',
    status: 'pending',
    priority: 'high',
    dueDate: new Date('2024-03-21'),
    completedAt: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTodoDto2: TodoDto = {
    id: 'test-id-2',
    title: 'テストタスク2',
    description: 'テストの説明2',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date('2024-03-22'),
    completedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('findAll', () => {
    it('正常系: すべてのTodoを取得できること', async () => {
      // Arrange
      const mockTodos = [mockTodoDto1, mockTodoDto2];
      vi.mocked(mockTodoRepository.findAll).mockResolvedValue(mockTodos);

      // Act
      const result = await useCase.findAll();

      // Assert
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual(mockTodos);
        expect(result.value).toHaveLength(2);
        expect(result.value[0]).toEqual(mockTodoDto1);
        expect(result.value[1]).toEqual(mockTodoDto2);
      }
    });

    it('正常系: Todoが存在しない場合は空配列を返すこと', async () => {
      // Arrange
      vi.mocked(mockTodoRepository.findAll).mockResolvedValue([]);

      // Act
      const result = await useCase.findAll();

      // Assert
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual([]);
        expect(result.value).toHaveLength(0);
      }
    });

    it('異常系: リポジトリでエラーが発生した場合はエラーを返すこと', async () => {
      // Arrange
      vi.mocked(mockTodoRepository.findAll).mockRejectedValue(new Error('Repository error'));

      // Act
      const result = await useCase.findAll();

      // Assert
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('Repository error');
      }
    });
  });

  describe('findById', () => {
    it('正常系: 指定したIDのTodoを取得できること', async () => {
      // Arrange
      vi.mocked(mockTodoRepository.findById).mockResolvedValue(mockTodoDto1);

      // Act
      const result = await useCase.findById('test-id-1');

      // Assert
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual(mockTodoDto1);
        expect(result.value.id).toBe('test-id-1');
        expect(result.value.title).toBe('テストタスク1');
      }
    });

    it('異常系: 存在しないIDの場合はエラーを返すこと', async () => {
      // Arrange
      vi.mocked(mockTodoRepository.findById).mockResolvedValue(null);

      // Act
      const result = await useCase.findById('non-existent-id');

      // Assert
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('Todo not found');
      }
    });

    it('異常系: リポジトリでエラーが発生した場合はエラーを返すこと', async () => {
      // Arrange
      vi.mocked(mockTodoRepository.findById).mockRejectedValue(new Error('Repository error'));

      // Act
      const result = await useCase.findById('test-id-1');

      // Assert
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('Repository error');
      }
    });
  });
});
