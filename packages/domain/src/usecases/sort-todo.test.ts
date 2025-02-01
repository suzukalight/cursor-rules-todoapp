import { Result } from '@cursor-rules-todoapp/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TodoRepository } from '../repositories/todo-repository';
import type { TodoDto } from '../todo/todo';
import { SortTodoUseCase } from './sort-todo';

describe('SortTodoUseCase', () => {
  const mockTodoRepository: TodoRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
  };

  const useCase = new SortTodoUseCase(mockTodoRepository);

  const mockTodos: TodoDto[] = [
    {
      id: 'test-id-1',
      title: 'テストタスク1',
      description: 'テストの説明1',
      status: 'pending',
      priority: 'low',
      dueDate: new Date('2024-03-21'),
      completedAt: undefined,
      createdAt: new Date('2024-03-21T00:00:00.000Z'),
      updatedAt: new Date(),
    },
    {
      id: 'test-id-2',
      title: 'テストタスク2',
      description: 'テストの説明2',
      status: 'completed',
      priority: 'medium',
      dueDate: new Date('2024-03-22'),
      completedAt: new Date(),
      createdAt: new Date('2024-03-22T00:00:00.000Z'),
      updatedAt: new Date(),
    },
    {
      id: 'test-id-3',
      title: 'テストタスク3',
      description: 'テストの説明3',
      status: 'pending',
      priority: 'high',
      dueDate: undefined,
      completedAt: undefined,
      createdAt: new Date('2024-03-23T00:00:00.000Z'),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.mocked(mockTodoRepository.findAll).mockResolvedValue(mockTodos);
  });

  describe('作成日時でソート', () => {
    it('正常系: 作成日時の昇順でソートできること', async () => {
      // Arrange
      const input = {
        sortBy: 'createdAt' as const,
        order: 'asc' as const,
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(3);
        expect(result.value[0].id).toBe('test-id-1');
        expect(result.value[1].id).toBe('test-id-2');
        expect(result.value[2].id).toBe('test-id-3');
      }
    });

    it('正常系: 作成日時の降順でソートできること', async () => {
      // Arrange
      const input = {
        sortBy: 'createdAt' as const,
        order: 'desc' as const,
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(3);
        expect(result.value[0].id).toBe('test-id-3');
        expect(result.value[1].id).toBe('test-id-2');
        expect(result.value[2].id).toBe('test-id-1');
      }
    });
  });

  describe('優先度でソート', () => {
    it('正常系: 優先度の昇順でソートできること', async () => {
      // Arrange
      const input = {
        sortBy: 'priority' as const,
        order: 'asc' as const,
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(3);
        expect(result.value[0].priority).toBe('low');
        expect(result.value[1].priority).toBe('medium');
        expect(result.value[2].priority).toBe('high');
      }
    });

    it('正常系: 優先度の降順でソートできること', async () => {
      // Arrange
      const input = {
        sortBy: 'priority' as const,
        order: 'desc' as const,
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(3);
        expect(result.value[0].priority).toBe('high');
        expect(result.value[1].priority).toBe('medium');
        expect(result.value[2].priority).toBe('low');
      }
    });
  });

  describe('期限でソート', () => {
    it('正常系: 期限の昇順でソートできること', async () => {
      // Arrange
      const input = {
        sortBy: 'dueDate' as const,
        order: 'asc' as const,
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(3);
        expect(result.value[0].id).toBe('test-id-3'); // 期限なし
        expect(result.value[1].id).toBe('test-id-1'); // 2024-03-21
        expect(result.value[2].id).toBe('test-id-2'); // 2024-03-22
      }
    });

    it('正常系: 期限の降順でソートできること', async () => {
      // Arrange
      const input = {
        sortBy: 'dueDate' as const,
        order: 'desc' as const,
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(3);
        expect(result.value[0].id).toBe('test-id-2'); // 2024-03-22
        expect(result.value[1].id).toBe('test-id-1'); // 2024-03-21
        expect(result.value[2].id).toBe('test-id-3'); // 期限なし
      }
    });
  });

  it('異常系: リポジトリでエラーが発生した場合はエラーを返すこと', async () => {
    // Arrange
    const input = {
      sortBy: 'createdAt' as const,
      order: 'asc' as const,
    };

    vi.mocked(mockTodoRepository.findAll).mockRejectedValue(new Error('Repository error'));

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('Repository error');
    }
  });
});
