import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TodoRepository } from '../repositories/todo-repository';
import type { TodoDto } from '../todo/todo';
import { FilterTodoUseCase } from './filter-todo';

describe('FilterTodoUseCase', () => {
  const mockTodoRepository: TodoRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
  };

  const useCase = new FilterTodoUseCase(mockTodoRepository);

  const mockTodos: TodoDto[] = [
    {
      id: 'test-id-1',
      title: 'テストタスク1',
      description: 'テストの説明1',
      status: 'pending',
      priority: 'high',
      dueDate: new Date('2024-03-21'),
      completedAt: undefined,
      createdAt: new Date(),
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
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'test-id-3',
      title: 'テストタスク3',
      description: 'テストの説明3',
      status: 'pending',
      priority: 'low',
      dueDate: undefined,
      completedAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.mocked(mockTodoRepository.findAll).mockResolvedValue(mockTodos);
  });

  it('正常系: ステータスでフィルタリングできること', async () => {
    // Arrange
    const input = {
      status: 'pending' as const,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toHaveLength(2);
      expect(result.value.every((todo) => todo.status === 'pending')).toBe(true);
    }
  });

  it('正常系: 優先度でフィルタリングできること', async () => {
    // Arrange
    const input = {
      priority: 'high' as const,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toHaveLength(1);
      expect(result.value.every((todo) => todo.priority === 'high')).toBe(true);
    }
  });

  it('正常系: 期限でフィルタリングできること', async () => {
    // Arrange
    const input = {
      dueDateBefore: new Date('2024-03-22T23:59:59.999Z'),
      dueDateAfter: new Date('2024-03-20T00:00:00.000Z'),
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const filteredTodos = result.value.filter((todo) => todo.dueDate);
      expect(filteredTodos).toHaveLength(2);
      expect(
        filteredTodos.every((todo) => {
          const dueDate = todo.dueDate!;
          return dueDate >= input.dueDateAfter! && dueDate <= input.dueDateBefore!;
        })
      ).toBe(true);
    }
  });

  it('正常系: 複数の条件でフィルタリングできること', async () => {
    // Arrange
    const input = {
      status: 'pending' as const,
      priority: 'high' as const,
      dueDateBefore: new Date('2024-03-22'),
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toHaveLength(1);
      expect(result.value[0].status).toBe('pending');
      expect(result.value[0].priority).toBe('high');
      expect(result.value[0].dueDate).toBeDefined();
    }
  });

  it('正常系: フィルタリング条件に合致するTodoが存在しない場合は空配列を返すこと', async () => {
    // Arrange
    const input = {
      status: 'completed' as const,
      priority: 'high' as const,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toHaveLength(0);
    }
  });

  it('正常系: フィルタリング条件が指定されていない場合は全てのTodoを返すこと', async () => {
    // Arrange
    const input = {};

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(mockTodos);
      expect(result.value).toHaveLength(3);
    }
  });

  it('異常系: リポジトリでエラーが発生した場合はエラーを返すこと', async () => {
    // Arrange
    const input = {
      status: 'pending' as const,
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
