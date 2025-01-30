import { ChangeTodoStatusUseCase, CreateTodoUseCase, DeleteTodoUseCase, FindTodoUseCase, type Todo, TodoNotFoundError, type TodoRepository, UpdateTodoUseCase } from '@cursor-rules-todoapp/domain';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { trpc } from './trpc';

export const createTodoRouter = (todoRepository: TodoRepository) => {
  const createTodoUseCase = new CreateTodoUseCase(todoRepository);
  const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
  const changeTodoStatusUseCase = new ChangeTodoStatusUseCase(todoRepository);
  const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);
  const findTodoUseCase = new FindTodoUseCase(todoRepository);

  return trpc.router({
    create: trpc.procedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }): Promise<Todo> => {
        return createTodoUseCase.execute(input);
      }),

    update: trpc.procedure
      .input(
        z.object({
          id: z.string(),
          title: z.string().min(1).optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }): Promise<Todo> => {
        console.log('Update Todo Handler:', { input });
        return updateTodoUseCase.execute(input);
      }),

    changeStatus: trpc.procedure
      .input(
        z.object({
          id: z.string(),
          action: z.enum(['complete', 'cancel']),
        })
      )
      .mutation(async ({ input }): Promise<Todo> => {
        return changeTodoStatusUseCase.execute(input);
      }),

    findById: trpc.procedure
      .input(z.string())
      .query(async ({ input }): Promise<Todo> => {
        console.log('Find Todo Handler:', { input });
        try {
          return await findTodoUseCase.findById(input);
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

    findAll: trpc.procedure.query(async (): Promise<Todo[]> => {
      return findTodoUseCase.findAll();
    }),

    delete: trpc.procedure
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