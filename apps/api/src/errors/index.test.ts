import { TRPCError } from '@trpc/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleError } from '.';

describe('handleError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('TRPCエラーをconsole.errorに出力する', () => {
    const error = new TRPCError({ code: 'NOT_FOUND', message: 'Not found' });
    handleError(error);
    expect(console.error).toHaveBeenCalledWith('[tRPC Error]', 'NOT_FOUND', 'Not found');
  });

  it('通常のエラーをconsole.errorに出力する', () => {
    const error = new Error('Something went wrong');
    handleError(error);
    expect(console.error).toHaveBeenCalledWith('[Error]', 'Something went wrong');
  });

  it('不明なエラーをconsole.errorに出力する', () => {
    const error = 'Unknown error';
    handleError(error);
    expect(console.error).toHaveBeenCalledWith('[Unknown Error]', 'Unknown error');
  });
});
