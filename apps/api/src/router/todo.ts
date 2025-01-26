import { ChangeTodoStatusUseCase, CreateTodoUseCase, type Todo, type TodoRepository, UpdateTodoUseCase } from '@cursor-rules-todoapp/domain';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const createTodoRouter = (todoRepository: TodoRepository) => {
  const createTodoUseCase = new CreateTodoUseCase(todoRepository);
  const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
  const changeTodoStatusUseCase = new ChangeTodoStatusUseCase(todoRepository);

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

    delete: t.procedure.input(z.string()).mutation(async ({ input }): Promise<void> => {
      await todoRepository.delete(input);
    }),
  });
}; 