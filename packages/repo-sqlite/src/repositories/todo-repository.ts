import type {
  TodoRepository as ITodoRepository,
  TodoDto,
  TodoId,
  TodoPriority,
  TodoStatus,
} from '@cursor-rules-todoapp/domain';
import type { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { TodoMapper } from '../mappers/todo-mapper';

export class TodoRepository implements ITodoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(todo: TodoDto): Promise<TodoDto> {
    const result = await this.prisma.todo.upsert({
      where: { id: todo.id },
      create: TodoMapper.toPrisma(todo),
      update: TodoMapper.toPrisma(todo),
    });
    return TodoMapper.toDto(result);
  }

  async findById(id: TodoId): Promise<TodoDto | null> {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });
    return todo ? TodoMapper.toDto(todo) : null;
  }

  async findAll(): Promise<TodoDto[]> {
    const todos = await this.prisma.todo.findMany();
    return todos.map(TodoMapper.toDto);
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
    try {
      return await this.prisma.$transaction(
        async (prisma) => {
          const txRepository = new TodoRepository(prisma as PrismaClient);
          try {
            const result = await operation.call(txRepository);
            return result;
          } catch (error) {
            if (error instanceof Error && error.name === 'TestError') {
              throw error;
            }
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
              throw error;
            }
            if (error instanceof Error) {
              throw error;
            }
            throw new Error('Transaction operation failed');
          }
        },
        {
          timeout: 10000, // 10秒
          maxWait: 5000, // 最大待機時間
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'TestError') {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw error;
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Transaction failed');
    }
  }
}
