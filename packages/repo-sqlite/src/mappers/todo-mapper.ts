import { Todo } from '@cursor-rules-todoapp/domain';
import type { Todo as PrismaTodo } from '@prisma/client';

export const TodoMapper = {
  toDomain(prismaModel: PrismaTodo): Todo {
    return Todo.reconstruct({
      id: prismaModel.id,
      title: prismaModel.title,
      description: prismaModel.description ?? undefined,
      status: prismaModel.status as 'pending' | 'completed' | 'cancelled',
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt,
      completedAt: prismaModel.completedAt ?? undefined,
    });
  },

  toPrisma(domain: Todo): PrismaTodo {
    return {
      id: domain.id,
      title: domain.title,
      description: domain.description ?? null,
      status: domain.status,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      completedAt: domain.completedAt ?? null,
    };
  },
} as const; 