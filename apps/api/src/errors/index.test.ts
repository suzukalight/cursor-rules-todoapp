import { TRPCError } from '@trpc/server';
import { describe, expect, it } from 'vitest';
import { handleError } from '.';

describe('handleError', () => {
  it('TRPCエラーをそのまま返す', () => {
    const error = new TRPCError({ code: 'NOT_FOUND', message: 'Not found' });
    expect(() => handleError(error)).toThrow(error);
  });

  it('その他のエラーはINTERNAL_SERVER_ERRORに変換する', () => {
    const error = new Error('Something went wrong');
    expect(() => handleError(error)).toThrow(TRPCError);
    expect(() => handleError(error)).toThrow('Internal server error');
  });
}); 