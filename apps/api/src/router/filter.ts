import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import type { TodoUseCase } from '../usecases/todo';

const filterInputSchema = z.object({
  status: z.enum(['pending', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDateBefore: z.date().optional(),
  dueDateAfter: z.date().optional(),
});

export const filterRouter = ({ todoUseCase }: { todoUseCase: TodoUseCase }) =>
  router({
    filter: publicProcedure.input(filterInputSchema).query(async ({ input }) => {
      const result = await todoUseCase.filter(input);
      if (result.isErr()) {
        throw result.error;
      }
      return result.value;
    }),
  });
