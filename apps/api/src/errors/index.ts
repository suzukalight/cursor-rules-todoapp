import { TRPCError } from '@trpc/server';

export const handleError = (error: unknown): void => {
  if (error instanceof TRPCError) {
    console.error('[tRPC Error]', error.code, error.message);
    return;
  }

  if (error instanceof Error) {
    console.error('[Error]', error.message);
    return;
  }

  console.error('[Unknown Error]', error);
}; 