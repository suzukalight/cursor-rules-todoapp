import { CreateTodoUseCase, type Todo, type TodoRepository } from '@cursor-rules-todoapp/domain';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const createTodoRouter = (todoRepository: TodoRepository) => {
  const createTodoUseCase = new CreateTodoUseCase(todoRepository);

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