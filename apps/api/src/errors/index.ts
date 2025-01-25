import { TRPCError } from '@trpc/server';
import { ZodError } from 'zod';

export const handleError = (error: unknown) => {
  if (error instanceof ZodError) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Invalid input: ${error.errors.map((e) => e.message).join(', ')}`,
    });
  }

  if (error instanceof Error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }

  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
}; 