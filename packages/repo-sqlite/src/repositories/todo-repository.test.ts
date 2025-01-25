import { Todo } from '@cursor-rules-todoapp/domain';
import { PrismaClient } from '@prisma/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TodoRepository } from './todo-repository';

describe('TodoRepository', () => {
  let prisma: PrismaClient;
  let repository: TodoRepository;

  beforeEach(async () => {
    prisma = new PrismaClient();
    repository = new TodoRepository(prisma);

    // クリーンアップ
    await prisma.todo.deleteMany();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  describe('save', () => {
    it('should create a new todo', async () => {
      const todo = Todo.create({
        title: 'Test Todo',
        description: 'Test Description',
        status: 'pending',
      });

      await repository.save(todo);

      const saved = await prisma.todo.findUnique({
        where: { id: todo.id },
      });

      expect(saved).not.toBeNull();
      expect(saved?.title).toBe('Test Todo');
      expect(saved?.description).toBe('Test Description');
      expect(saved?.status).toBe('pending');
    });

    it('should update an existing todo', async () => {
      const todo = Todo.create({
        title: 'Test Todo',
        status: 'pending',
      });

      await repository.save(todo);
      todo.updateTitle('Updated Title');
      await repository.save(todo);

      const updated = await prisma.todo.findUnique({
        where: { id: todo.id },
      });

      expect(updated?.title).toBe('Updated Title');
    });
  });

  describe('findById', () => {
    it('should return null for non-existent todo', async () => {
      const result = await repository.findById('non-existent-id');
      expect(result).toBeNull();
    });

    it('should find an existing todo', async () => {
      const todo = Todo.create({
        title: 'Test Todo',
        status: 'pending',
      });

      await repository.save(todo);

      const found = await repository.findById(todo.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(todo.id);
      expect(found?.title).toBe(todo.title);
    });
  });

  describe('findAll', () => {
    it('should return all todos', async () => {
      const todo1 = Todo.create({
        title: 'Todo 1',
        status: 'pending',
      });

      const todo2 = Todo.create({
        title: 'Todo 2',
        status: 'pending',
      });

      await repository.save(todo1);
      await repository.save(todo2);

      const todos = await repository.findAll();
      expect(todos).toHaveLength(2);
      expect(todos.map(t => t.title)).toContain('Todo 1');
      expect(todos.map(t => t.title)).toContain('Todo 2');
    });
  });

  describe('delete', () => {
    it('should delete a todo', async () => {
      const todo = Todo.create({
        title: 'Test Todo',
        status: 'pending',
      });

      await repository.save(todo);
      await repository.delete(todo.id);

      const deleted = await prisma.todo.findUnique({
        where: { id: todo.id },
      });

      expect(deleted).toBeNull();
    });
  });

  describe('transaction', () => {
    it('should handle successful transaction', async () => {
      const result = await repository.transaction(async () => {
        const todo = Todo.create({
          title: 'Transaction Todo',
          status: 'pending',
        });
        await repository.save(todo);
        return todo;
      });

      const saved = await prisma.todo.findUnique({
        where: { id: result.id },
      });
      expect(saved).not.toBeNull();
      expect(saved?.title).toBe('Transaction Todo');
    });

    it('should rollback on error', async () => {
      const todo = Todo.create({
        title: 'Pre-transaction Todo',
        status: 'pending',
      });
      await repository.save(todo);

      try {
        await repository.transaction(async () => {
          await repository.delete(todo.id);
          throw new Error('Test error');
        });
      } catch (_error) {
        // エラーは期待通り
      }

      const stillExists = await prisma.todo.findUnique({
        where: { id: todo.id },
      });
      expect(stillExists).not.toBeNull();
    });
  });
}); 