import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import type { TodoUseCase } from '../usecases/todo';

const createTodoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.date().optional(),
});

const updateTodoSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.date().optional(),
});

const findByIdSchema = z.object({
  id: z.string(),
});

const changeStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'completed']),
});

const filterSchema = z.object({
  status: z.enum(['pending', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDateAfter: z.date().optional(),
  dueDateBefore: z.date().optional(),
});

const sortSchema = z.object({
  sortBy: z.enum(['createdAt', 'priority', 'dueDate']),
  order: z.enum(['asc', 'desc']),
});

export const todoRouter = ({ todoUseCase }: { todoUseCase: TodoUseCase }) =>
  router({
    create: publicProcedure.input(createTodoSchema).mutation(async ({ input }) => {
      const todo = await todoUseCase.create(input);
      if (!todo.isOk()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: todo.error.message,
        });
      }
      return todo.value;
    }),

    findAll: publicProcedure.query(async () => {
      const todos = await todoUseCase.findAll();
      if (!todos.isOk()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: todos.error.message,
        });
      }
      return todos.value;
    }),

    findById: publicProcedure.input(findByIdSchema).query(async ({ input }) => {
      const todo = await todoUseCase.findById(input.id);
      if (!todo.isOk()) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: todo.error.message,
        });
      }
      return todo.value;
    }),

    update: publicProcedure.input(updateTodoSchema).mutation(async ({ input }) => {
      const todo = await todoUseCase.update(input);
      if (!todo.isOk()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: todo.error.message,
        });
      }
      return todo.value;
    }),

    delete: publicProcedure.input(findByIdSchema).mutation(async ({ input }) => {
      const result = await todoUseCase.delete(input);
      if (!result.isOk()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: result.error.message,
        });
      }
      return result.value;
    }),

    changeStatus: publicProcedure.input(changeStatusSchema).mutation(async ({ input }) => {
      const todo =
        input.status === 'completed'
          ? await todoUseCase.complete(input)
          : await todoUseCase.cancel(input);
      if (!todo.isOk()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: todo.error.message,
        });
      }
      return todo.value;
    }),

    filter: publicProcedure.input(filterSchema).query(async ({ input }) => {
      const todos = await todoUseCase.filter(input);
      if (!todos.isOk()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: todos.error.message,
        });
      }
      return todos.value;
    }),

    sort: publicProcedure.input(sortSchema).query(async ({ input }) => {
      const todos = await todoUseCase.sort(input);
      if (!todos.isOk()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: todos.error.message,
        });
      }
      return todos.value;
    }),
  });
