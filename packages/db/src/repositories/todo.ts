import { Todo, CreateTodoInput, UpdateTodoInput } from '@cursor-rules-todoapp/common';
import { prisma } from '../client';

export class TodoRepository {
  async findAll(): Promise<Todo[]> {
    return prisma.todo.findMany();
  }

  async findById(id: string): Promise<Todo | null> {
    return prisma.todo.findUnique({
      where: { id },
    });
  }

  async create(input: CreateTodoInput): Promise<Todo> {
    return prisma.todo.create({
      data: {
        ...input,
        status: 'pending',
      },
    });
  }

  async update(id: string, input: UpdateTodoInput): Promise<Todo> {
    return prisma.todo.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string): Promise<Todo> {
    return prisma.todo.delete({
      where: { id },
    });
  }
} 