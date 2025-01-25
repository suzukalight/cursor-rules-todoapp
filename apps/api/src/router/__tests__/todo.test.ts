import { Todo, type TodoRepository } from '@cursor-rules-todoapp/domain';
import type { inferProcedureInput } from '@trpc/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTodoRouter } from '../todo';

describe('TodoRouter', () => {
  let mockTodoRepository: TodoRepository;
  let router: ReturnType<typeof createTodoRouter>;

  beforeEach(() => {
    mockTodoRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
      transaction: vi.fn(),
    };
    router = createTodoRouter(mockTodoRepository);
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const input: inferProcedureInput<typeof router.create> = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      vi.mocked(mockTodoRepository.save).mockResolvedValueOnce();

      const caller = router.createCaller({});
      const result = await caller.create(input);

      expect(result).toMatchObject({
        title: input.title,
        description: input.description,
        status: 'pending',
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.completedAt).toBeUndefined();
      expect(mockTodoRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        title: input.title,
        description: input.description,
      }));
    });
  });

  describe('findById', () => {
    it('should find a todo by id', async () => {
      const todo = Todo.create({
        title: 'Test Todo',
        description: 'Test Description',
        status: 'pending',
      });

      vi.mocked(mockTodoRepository.findById).mockResolvedValueOnce(todo);

      const caller = router.createCaller({});
      const result = await caller.findById('1');

      expect(result).toMatchObject({
        title: todo.title,
        description: todo.description,
        status: todo.status,
      });
      expect(result?.id).toBeDefined();
      expect(result?.createdAt).toBeInstanceOf(Date);
      expect(result?.updatedAt).toBeInstanceOf(Date);
      expect(result?.completedAt).toBeUndefined();
      expect(mockTodoRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null when todo not found', async () => {
      vi.mocked(mockTodoRepository.findById).mockResolvedValueOnce(null);

      const caller = router.createCaller({});
      const result = await caller.findById('1');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all todos', async () => {
      const todos = [
        Todo.create({
          title: 'Test Todo 1',
          description: 'Test Description 1',
          status: 'pending',
        }),
        Todo.create({
          title: 'Test Todo 2',
          description: 'Test Description 2',
          status: 'pending',
        }),
      ];

      vi.mocked(mockTodoRepository.findAll).mockResolvedValueOnce(todos);

      const caller = router.createCaller({});
      const result = await caller.findAll();

      expect(result).toHaveLength(2);
      result.forEach((todo, index) => {
        expect(todo).toMatchObject({
          title: todos[index].title,
          description: todos[index].description,
          status: todos[index].status,
        });
        expect(todo.id).toBeDefined();
        expect(todo.createdAt).toBeInstanceOf(Date);
        expect(todo.updatedAt).toBeInstanceOf(Date);
        expect(todo.completedAt).toBeUndefined();
      });
      expect(mockTodoRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a todo', async () => {
      const caller = router.createCaller({});
      await caller.delete('1');

      expect(mockTodoRepository.delete).toHaveBeenCalledWith('1');
    });
  });
}); 