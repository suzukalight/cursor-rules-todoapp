import type { Express } from 'express';
import request from 'supertest';
import { expect } from 'vitest';

interface APIResponse<T> {
  status: number;
  data?: T;
  error?: {
    message: string;
    code: string;
    [key: string]: unknown;
  };
}

interface TRPCTestHelperOptions {
  debug?: boolean;
}

/**
 * tRPC APIリクエストのヘルパー関数
 */
export class TRPCTestHelper {
  private readonly debug: boolean;

  constructor(
    private readonly app: Express,
    options: TRPCTestHelperOptions = {}
  ) {
    this.debug = options.debug ?? false;
  }

  /**
   * デバッグログを出力する
   */
  private log(message: string, data: unknown) {
    if (this.debug) {
      // biome-ignore lint/suspicious/noConsoleLog: テストのデバッグ用途のため許容
      console.log(message, data);
    }
  }

  /**
   * POSTリクエストを送信する
   */
  async post<TInput extends object, TOutput>(
    endpoint: string,
    input: TInput
  ): Promise<APIResponse<TOutput>> {
    const response = await request(this.app)
      .post(`/trpc/${endpoint}`)
      .set('Content-Type', 'application/json')
      .send({ input });

    this.log('POST Request:', {
      url: `/trpc/${endpoint}`,
      body: { input },
    });
    this.log('POST Response:', {
      status: response.status,
      text: response.text,
    });

    try {
      const result = JSON.parse(response.text);
      if (result.error) {
        return {
          status: result.error.data?.httpStatus ?? 500,
          error: {
            message: result.error.message,
            code: result.error.code,
            ...result.error,
          },
        };
      }

      return {
        status: 200,
        data: result.result.data as TOutput,
      };
    } catch (error) {
      this.log('Parse Error:', error);
      return {
        status: 500,
        error: {
          message: 'Failed to parse response',
          code: 'PARSE_ERROR',
        },
      };
    }
  }

  /**
   * GETリクエストを送信する
   */
  async get<TInput extends object | string | undefined, TOutput>(
    endpoint: string,
    input?: TInput
  ): Promise<APIResponse<TOutput>> {
    const url = input
      ? `/trpc/${endpoint}?input=${encodeURIComponent(JSON.stringify({ input }))}`
      : `/trpc/${endpoint}`;

    const response = await request(this.app).get(url).send();

    this.log('GET Request:', { url });
    this.log('GET Response:', {
      status: response.status,
      text: response.text,
    });

    try {
      const result = JSON.parse(response.text);
      if (result.error) {
        return {
          status: result.error.data?.httpStatus ?? 500,
          error: {
            message: result.error.message,
            code: result.error.code,
            ...result.error,
          },
        };
      }

      return {
        status: 200,
        data: result.result.data as TOutput,
      };
    } catch (error) {
      this.log('Parse Error:', error);
      return {
        status: 500,
        error: {
          message: 'Failed to parse response',
          code: 'PARSE_ERROR',
        },
      };
    }
  }

  /**
   * レスポンスが成功であることを検証する
   */
  expectSuccess<T>(response: APIResponse<T>) {
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.error).toBeUndefined();
  }

  /**
   * レスポンスがエラーであることを検証する
   */
  expectError<T>(response: APIResponse<T>, expectedStatus: number, expectedMessage?: string) {
    expect(response.status).toBe(expectedStatus);
    expect(response.error).toBeDefined();
    expect(response.data).toBeUndefined();
    if (expectedMessage && response.error) {
      expect(response.error.message).toContain(expectedMessage);
    }
  }
}
