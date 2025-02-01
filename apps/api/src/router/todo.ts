import {
  ChangeTodoStatusUseCase,
  CreateTodoUseCase,
  DeleteTodoUseCase,
  FindTodoUseCase,
  type Todo,
  TodoNotFoundError,
  type TodoRepository,
  UpdateTodoUseCase,
} from '@cursor-rules-todoapp/domain';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import type { TodoUseCase } from '../usecases/todo';
import { trpc } from './trpc';

const todoInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.date().optional(),
});

const todoIdSchema = z.object({
  id: z.string(),
});

const filterInputSchema = z.object({
  status: z.enum(['pending', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDateBefore: z.date().optional(),
  dueDateAfter: z.date().optional(),
});

const sortInputSchema = z.object({
  sortBy: z.enum(['createdAt', 'priority', 'dueDate']),
  order: z.enum(['asc', 'desc']),
});

export const todoRouter = ({ todoUseCase }: { todoUseCase: TodoUseCase }) => {
  return router({
    findAll: publicProcedure.query(async () => {
      const result = await todoUseCase.findAll();
      if (result.isErr()) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }
      return result.value;
    }),

    findById: publicProcedure.input(todoIdSchema).query(async ({ input }) => {
      const result = await todoUseCase.findById(input.id);
      if (result.isErr()) {
        if (result.error.message === 'Todo not found') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error.message,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }
      return result.value;
    }),

    create: publicProcedure.input(todoInputSchema).mutation(async ({ input }) => {
      const result = await todoUseCase.create(input);
      if (result.isErr()) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }
      return result.value;
    }),

    update: publicProcedure
      .input(todoIdSchema.merge(todoInputSchema.partial()))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const result = await todoUseCase.update({ id, ...data });
        if (result.isErr()) {
          if (result.error.message === 'Todo not found') {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error.message,
            });
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error.message,
          });
        }
        return result.value;
      }),

    delete: publicProcedure.input(todoIdSchema).mutation(async ({ input }) => {
      const result = await todoUseCase.delete(input);
      if (result.isErr()) {
        if (result.error.message === 'Todo not found') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error.message,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }
      return result.value;
    }),

    changeStatus: publicProcedure
      .input(todoIdSchema.merge(z.object({ status: z.enum(['pending', 'completed']) })))
      .mutation(async ({ input }) => {
        const result =
          input.status === 'completed'
            ? await todoUseCase.complete(input)
            : await todoUseCase.cancel(input);
        if (result.isErr()) {
          if (result.error.message === 'Todo not found') {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error.message,
            });
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error.message,
          });
        }
        return result.value;
      }),

    filter: publicProcedure.input(filterInputSchema).query(async ({ input }) => {
      const result = await todoUseCase.filter(input);
      if (result.isErr()) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }
      return result.value;
    }),

    sort: publicProcedure.input(sortInputSchema).query(async ({ input }) => {
      const result = await todoUseCase.sort(input);
      if (result.isErr()) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }
      return result.value;
    }),
  });
};
