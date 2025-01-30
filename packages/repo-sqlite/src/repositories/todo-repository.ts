import type { Todo } from '@cursor-rules-todoapp/domain';
import type { TodoRepository as ITodoRepository, TodoId } from '@cursor-rules-todoapp/domain';
import type { PrismaClient } from '@prisma/client';
import { TodoMapper } from '../mappers/todo-mapper';

export class TodoRepository implements ITodoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(todo: Todo): Promise<void> {
    const data = TodoMapper.toPrisma(todo);
    await this.prisma.todo.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async findById(id: TodoId): Promise<Todo | null> {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) return null;
    return TodoMapper.toDomain(todo);
  }

  async findAll(): Promise<Todo[]> {
    const todos = await this.prisma.todo.findMany();
    return todos.map(TodoMapper.toDomain);
  }

  async delete(id: TodoId): Promise<void> {
    await this.prisma.todo.delete({
      where: { id },
    });
  }

  async transaction<T>(operation: () => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(
      async (tx) => {
        const tempRepo = new TodoRepository(tx as unknown as PrismaClient);
        return await operation.call(tempRepo);
      },
      {
        timeout: 10000, // 10秒
        maxWait: 5000, // 5秒
      }
    );
  }
}
