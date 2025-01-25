import { describe, it, expect, beforeEach } from 'vitest';
import { TodoRepository } from './todo';
import { prisma } from '../client';

describe('TodoRepository', () => {
  let repository: TodoRepository;

  beforeEach(async () => {
    await prisma.todo.deleteMany();
    repository = new TodoRepository();
  });

  it('should create a todo', async () => {
    const todo = await repository.create({
      title: 'Test Todo',
      description: 'Test Description',
    });

    expect(todo.id).toBeDefined();
    expect(todo.title).toBe('Test Todo');
    expect(todo.description).toBe('Test Description');
    expect(todo.status).toBe('pending');
  });

  it('should find a todo by id', async () => {
    const created = await repository.create({
      title: 'Test Todo',
    });

    const found = await repository.findById(created.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
  });

  it('should update a todo', async () => {
    const created = await repository.create({
      title: 'Test Todo',
    });

    const updated = await repository.update(created.id, {
      title: 'Updated Todo',
      status: 'completed',
    });

    expect(updated.title).toBe('Updated Todo');
    expect(updated.status).toBe('completed');
  });

  it('should delete a todo', async () => {
    const created = await repository.create({
      title: 'Test Todo',
    });

    await repository.delete(created.id);
    const found = await repository.findById(created.id);
    expect(found).toBeNull();
  });
}); 