import type { Express } from 'express';
import type { Response } from 'superagent';
import request from 'supertest';
import { expect } from 'vitest';

interface APIResponse<T> {
  status: number;
  data?: T;
  error?: {
    message: string;
    code: string;
    data?: unknown;
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
      .send({ json: input });

    this.log('POST Request:', {
      url: `/trpc/${endpoint}`,
      body: { json: input },
    });
    this.log('POST Response:', {
      status: response.status,
      text: response.text,
    });

    return this.convertResponse(response, response.text);
  }

  /**
   * GETリクエストを送信する
   */
  async get<TInput extends object | string | undefined, TOutput>(
    endpoint: string,
    input?: TInput
  ): Promise<APIResponse<TOutput>> {
    const url = input
      ? `/trpc/${endpoint}?input=${encodeURIComponent(JSON.stringify({ json: input }))}`
      : `/trpc/${endpoint}`;

    const response = await request(this.app)
      .get(url)
      .set('Content-Type', 'application/json')
      .send();

    this.log('GET Request:', { url });
    this.log('GET Response:', {
      status: response.status,
      text: response.text,
    });

    return this.convertResponse(response, response.text);
  }

  private convertResponse<T>(response: Response, text: string): APIResponse<T> {
    try {
      const result = JSON.parse(text);

      // エラーレスポンスの場合
      if (result.error) {
        return {
          status: response.status,
          error: {
            message: result.error.json.message,
            code: result.error.json.code.toString(),
            data: result.error.json.data,
          },
          data: undefined,
        };
      }

      // 成功レスポンスの場合
      return {
        status: response.status,
        error: undefined,
        data: result.result.data.json,
      };
    } catch (error) {
      return {
        status: response.status,
        error: {
          message: 'Failed to parse response',
          code: '-32603',
          data: { error },
        },
        data: undefined,
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
