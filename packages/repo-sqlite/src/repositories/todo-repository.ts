import type { PrismaClient } from '@prisma/client';
import type { Todo, TodoId } from '@cursor-rules-todoapp/domain';
import type { TodoRepository as ITodoRepository } from '@cursor-rules-todoapp/domain';
import { TodoMapper } from '../mappers/todo-mapper';

type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export class TodoRepository implements ITodoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(todo: Todo): Promise<void> {
    await this.prisma.todo.upsert({
      where: { id: todo.id },
      create: TodoMapper.toPrisma(todo),
      update: TodoMapper.toPrisma(todo),
    });
  }

  async findById(id: TodoId): Promise<Todo | null> {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });
    return todo ? TodoMapper.toDomain(todo) : null;
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
      async (tx: TransactionClient) => {
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
