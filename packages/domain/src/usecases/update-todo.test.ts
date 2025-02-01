import { Result } from '@cursor-rules-todoapp/common';
import { describe, expect, it, vi } from 'vitest';
import type { TodoRepository } from '../repositories/todo-repository';
import type { TodoDto } from '../todo/todo';
import { UpdateTodoUseCase } from './update-todo';

describe('UpdateTodoUseCase', () => {
  const mockTodoRepository: TodoRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
  };

  const useCase = new UpdateTodoUseCase(mockTodoRepository);

  const mockTodoDto: TodoDto = {
    id: 'test-id',
    title: '元のタイトル',
    description: '元の説明',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2024-03-21'),
    completedAt: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('正常系: タイトルを更新できること', async () => {
    // Arrange
    const input = {
      id: 'test-id',
      title: '新しいタイトル',
    };

    const updatedTodoDto: TodoDto = {
      ...mockTodoDto,
      title: input.title,
      updatedAt: new Date(),
    };

    vi.mocked(mockTodoRepository.findById).mockResolvedValue(mockTodoDto);
    vi.mocked(mockTodoRepository.save).mockResolvedValue(updatedTodoDto);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(updatedTodoDto);
      expect(result.value.title).toBe(input.title);
      expect(result.value.description).toBe(mockTodoDto.description);
      expect(result.value.priority).toBe(mockTodoDto.priority);
      expect(result.value.dueDate).toBe(mockTodoDto.dueDate);
    }
  });

  it('正常系: 説明を更新できること', async () => {
    // Arrange
    const input = {
      id: 'test-id',
      description: '新しい説明',
    };

    const updatedTodoDto: TodoDto = {
      ...mockTodoDto,
      description: input.description,
      updatedAt: new Date(),
    };

    vi.mocked(mockTodoRepository.findById).mockResolvedValue(mockTodoDto);
    vi.mocked(mockTodoRepository.save).mockResolvedValue(updatedTodoDto);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(updatedTodoDto);
      expect(result.value.description).toBe(input.description);
    }
  });

  it('正常系: 説明を削除できること', async () => {
    // Arrange
    const input = {
      id: 'test-id',
      description: undefined,
    };

    const updatedTodoDto: TodoDto = {
      ...mockTodoDto,
      description: undefined,
      updatedAt: new Date(),
    };

    vi.mocked(mockTodoRepository.findById).mockResolvedValue(mockTodoDto);
    vi.mocked(mockTodoRepository.save).mockResolvedValue(updatedTodoDto);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(updatedTodoDto);
      expect(result.value.description).toBeUndefined();
    }
  });

  it('正常系: 優先度を更新できること', async () => {
    // Arrange
    const input = {
      id: 'test-id',
      priority: 'high' as const,
    };

    const updatedTodoDto: TodoDto = {
      ...mockTodoDto,
      priority: input.priority,
      updatedAt: new Date(),
    };

    vi.mocked(mockTodoRepository.findById).mockResolvedValue(mockTodoDto);
    vi.mocked(mockTodoRepository.save).mockResolvedValue(updatedTodoDto);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(updatedTodoDto);
      expect(result.value.priority).toBe(input.priority);
    }
  });

  it('正常系: 期限を更新できること', async () => {
    // Arrange
    const input = {
      id: 'test-id',
      dueDate: new Date('2024-03-22'),
    };

    const updatedTodoDto: TodoDto = {
      ...mockTodoDto,
      dueDate: input.dueDate,
      updatedAt: new Date(),
    };

    vi.mocked(mockTodoRepository.findById).mockResolvedValue(mockTodoDto);
    vi.mocked(mockTodoRepository.save).mockResolvedValue(updatedTodoDto);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(updatedTodoDto);
      expect(result.value.dueDate).toBe(input.dueDate);
    }
  });

  it('異常系: 存在しないTodoの場合はエラーを返すこと', async () => {
    // Arrange
    const input = {
      id: 'non-existent-id',
      title: '新しいタイトル',
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

  it('異常系: リポジトリでエラーが発生した場合はエラーを返すこと', async () => {
    // Arrange
    const input = {
      id: 'test-id',
      title: '新しいタイトル',
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
