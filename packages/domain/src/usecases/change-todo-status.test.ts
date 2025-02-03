import { describe, expect, it, vi } from 'vitest';
import type { TodoRepository } from '../repositories/todo-repository';
import type { TodoDto } from '../todo/todo';
import { ChangeTodoStatusUseCase } from './change-todo-status';

describe('ChangeTodoStatusUseCase', () => {
  const mockTodoRepository: TodoRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
  };

  const useCase = new ChangeTodoStatusUseCase(mockTodoRepository);

  const mockPendingTodoDto: TodoDto = {
    id: 'test-id',
    title: 'テストタスク',
    description: 'テストの説明',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2024-03-21'),
    completedAt: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCompletedTodoDto: TodoDto = {
    ...mockPendingTodoDto,
    status: 'completed',
    completedAt: new Date(),
  };

  it('正常系: Todoを完了状態に変更できること', async () => {
    // Arrange
    const input = {
      id: 'test-id',
      status: 'completed' as const,
    };

    vi.mocked(mockTodoRepository.findById).mockResolvedValue(mockPendingTodoDto);
    vi.mocked(mockTodoRepository.save).mockResolvedValue(mockCompletedTodoDto);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(mockCompletedTodoDto);
      expect(result.value.status).toBe('completed');
      expect(result.value.completedAt).toBeDefined();
    }
  });

  it('正常系: Todoを未完了状態に変更できること', async () => {
    // Arrange
    const input = {
      id: 'test-id',
      status: 'pending' as const,
    };

    vi.mocked(mockTodoRepository.findById).mockResolvedValue(mockCompletedTodoDto);
    vi.mocked(mockTodoRepository.save).mockResolvedValue(mockPendingTodoDto);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(mockPendingTodoDto);
      expect(result.value.status).toBe('pending');
      expect(result.value.completedAt).toBeUndefined();
    }
  });

  it('異常系: 存在しないTodoの場合はエラーを返すこと', async () => {
    // Arrange
    const input = {
      id: 'non-existent-id',
      status: 'completed' as const,
    };

    vi.mocked(mockTodoRepository.findById).mockResolvedValue(null);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('Todo not found');
    }
  });

  it('異常系: すでに完了状態のTodoを完了状態に変更しようとした場合はエラーを返すこと', async () => {
    // Arrange
    const input = {
      id: 'test-id',
      status: 'completed' as const,
    };

    vi.mocked(mockTodoRepository.findById).mockResolvedValue(mockCompletedTodoDto);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('Todo is already completed');
    }
  });

  it('異常系: すでに未完了状態のTodoを未完了状態に変更しようとした場合はエラーを返すこと', async () => {
    // Arrange
    const input = {
      id: 'test-id',
      status: 'pending' as const,
    };

    vi.mocked(mockTodoRepository.findById).mockResolvedValue(mockPendingTodoDto);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('Todo is already pending');
    }
  });

  it('異常系: リポジトリでエラーが発生した場合はエラーを返すこと', async () => {
    // Arrange
    const input = {
      id: 'test-id',
      status: 'completed' as const,
    };

    vi.mocked(mockTodoRepository.findById).mockRejectedValue(new Error('Repository error'));

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
