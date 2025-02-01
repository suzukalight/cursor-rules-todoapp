import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import type { TodoUseCase } from '../usecases/todo';

const sortInputSchema = z.object({
  sortBy: z.enum(['createdAt', 'priority', 'dueDate']),
  order: z.enum(['asc', 'desc']),
});

export const sortRouter = ({ todoUseCase }: { todoUseCase: TodoUseCase }) =>
  router({
    sort: publicProcedure.input(sortInputSchema).query(async ({ input }) => {
      const result = await todoUseCase.sort(input);
      if (result.isErr()) {
        throw result.error;
      }
      return result.value;
    }),
  });
