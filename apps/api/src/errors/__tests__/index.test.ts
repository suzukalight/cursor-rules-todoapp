import { TRPCError } from '@trpc/server';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { handleError } from '../index';

describe('handleError', () => {
  it('should handle ZodError', () => {
    const schema = z.object({
      title: z.string().min(1),
    });
    const error = schema.safeParse({}).error;

    expect(() => handleError(error)).toThrow(TRPCError);
    expect(() => handleError(error)).toThrow('Invalid input');
  });

  it('should handle Error', () => {
    const error = new Error('Test error');

    expect(() => handleError(error)).toThrow(TRPCError);
    expect(() => handleError(error)).toThrow('Test error');
  });

  it('should handle unknown error', () => {
    expect(() => handleError('unknown error')).toThrow(TRPCError);
    expect(() => handleError('unknown error')).toThrow('An unexpected error occurred');
  });
}); 