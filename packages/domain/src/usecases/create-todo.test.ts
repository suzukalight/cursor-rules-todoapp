import { describe, expect, it, vi } from 'vitest';
import type { TodoRepository } from '../repositories/todo-repository';
import type { TodoDto } from '../todo/todo';
import { CreateTodoUseCase } from './create-todo';

describe('CreateTodoUseCase', () => {
  const mockTodoRepository: TodoRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
  };

  const useCase = new CreateTodoUseCase(mockTodoRepository);

  it('正常系: TodoDtoを返すこと', async () => {
    // Arrange
    const input = {
      title: 'テストタスク',
      description: 'テストの説明',
      priority: 'high' as const,
      dueDate: new Date('2024-03-21'),
    };

    const mockTodoDto: TodoDto = {
      id: 'test-id',
      title: input.title,
      description: input.description,
      status: 'pending',
      priority: input.priority,
      dueDate: input.dueDate,
      completedAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockTodoRepository.save).mockResolvedValue(mockTodoDto);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(mockTodoDto);
      expect(result.value.title).toBe(input.title);
      expect(result.value.description).toBe(input.description);
      expect(result.value.priority).toBe(input.priority);
      expect(result.value.dueDate).toBe(input.dueDate);
      expect(result.value.status).toBe('pending');
      expect(result.value.completedAt).toBeUndefined();
    }
  });

  it('正常系: 必須項目のみでTodoを作成できること', async () => {
    // Arrange
    const input = {
      title: 'テストタスク',
    };

    const mockTodoDto: TodoDto = {
      id: 'test-id',
      title: input.title,
      description: undefined,
      status: 'pending',
      priority: 'medium',
      dueDate: undefined,
      completedAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockTodoRepository.save).mockResolvedValue(mockTodoDto);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(mockTodoDto);
      expect(result.value.title).toBe(input.title);
      expect(result.value.priority).toBe('medium');
      expect(result.value.description).toBeUndefined();
      expect(result.value.dueDate).toBeUndefined();
    }
  });

  it('異常系: タイトルが空の場合はエラーを返すこと', async () => {
    // Arrange
    const input = {
      title: '',
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
    }
  });

  it('異常系: リポジトリでエラーが発生した場合はエラーを返すこと', async () => {
    // Arrange
    const input = {
      title: 'テストタスク',
    };

    vi.mocked(mockTodoRepository.save).mockRejectedValue(new Error('Repository error'));

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
