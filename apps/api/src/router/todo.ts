import { ChangeTodoStatusUseCase, CreateTodoUseCase, DeleteTodoUseCase, type Todo, TodoNotFoundError, type TodoRepository, UpdateTodoUseCase } from '@cursor-rules-todoapp/domain';
import { TRPCError, initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const createTodoRouter = (todoRepository: TodoRepository) => {
  const createTodoUseCase = new CreateTodoUseCase(todoRepository);
  const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
  const changeTodoStatusUseCase = new ChangeTodoStatusUseCase(todoRepository);
  const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);

  return t.router({
    create: t.procedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }): Promise<Todo> => {
        return createTodoUseCase.execute(input);
      }),

    update: t.procedure
      .input(
        z.object({
          id: z.string(),
          title: z.string().min(1).optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }): Promise<Todo> => {
        return updateTodoUseCase.execute(input);
      }),

    changeStatus: t.procedure
      .input(
        z.object({
          id: z.string(),
          action: z.enum(['complete', 'cancel']),
        })
      )
      .mutation(async ({ input }): Promise<Todo> => {
        return changeTodoStatusUseCase.execute(input);
      }),

    findById: t.procedure
      .input(z.string())
      .query(async ({ input }): Promise<Todo | null> => {
        return todoRepository.findById(input);
      }),

    findAll: t.procedure.query(async (): Promise<Todo[]> => {
      return todoRepository.findAll();
    }),

    delete: t.procedure
      .input(
        z.object({
          id: z.string(),
        })
      )
      .mutation(async ({ input }): Promise<void> => {
        try {
          await deleteTodoUseCase.execute(input.id);
        } catch (error: unknown) {
          if (error instanceof TodoNotFoundError) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: error.message,
            });
          }
          throw error;
        }
      }),
  });
}; 