import { TRPCError } from '@trpc/server';

export const handleError = (error: unknown): never => {
  if (error instanceof TRPCError) {
    throw error;
  }

  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Internal server error',
  });
}; 