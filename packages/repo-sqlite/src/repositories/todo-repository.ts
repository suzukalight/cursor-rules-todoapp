import type {
  TodoRepository as ITodoRepository,
  Todo,
  TodoId,
  TodoPriority,
  TodoStatus,
  TodoDto,
} from '@cursor-rules-todoapp/domain';
import type { PrismaClient } from '@prisma/client';
import { TodoMapper } from '../mappers/todo-mapper';

type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export class TodoRepository implements ITodoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(todo: Todo): Promise<Todo> {
    const result = await this.prisma.todo.upsert({
      where: { id: todo.id },
      create: TodoMapper.toPrisma(todo),
      update: TodoMapper.toPrisma(todo),
    });
    return TodoMapper.toDomain(result);
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

  async updateTitle(id: TodoId, title: string): Promise<void> {
    await this.prisma.todo.update({
      where: { id },
      data: { title, updatedAt: new Date() },
    });
  }

  async updateStatus(id: TodoId, status: TodoStatus): Promise<void> {
    await this.prisma.todo.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
        completedAt: status === 'completed' ? new Date() : null,
      },
    });
  }

  async updatePriority(id: TodoId, priority: TodoPriority): Promise<void> {
    await this.prisma.todo.update({
      where: { id },
      data: { priority, updatedAt: new Date() },
    });
  }

  async updateDueDate(id: TodoId, dueDate: Date | undefined): Promise<void> {
    await this.prisma.todo.update({
      where: { id },
      data: { dueDate, updatedAt: new Date() },
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
