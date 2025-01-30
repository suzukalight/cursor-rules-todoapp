import type { Express } from 'express';
import request from 'supertest';
import { expect } from 'vitest';

interface APIResponse<T> {
  status: number;
  data?: T;
  error?: {
    message: string;
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
  async post<TInput, TOutput>(endpoint: string, input: TInput): Promise<APIResponse<TOutput>> {
    const response = await request(this.app)
      .post(`/trpc/${endpoint}`)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(input));

    this.log('POST Request:', {
      url: `/trpc/${endpoint}`,
      body: input,
    });
    this.log('POST Response:', {
      status: response.status,
      text: response.text,
    });

    if (response.status === 200) {
      const result = JSON.parse(response.text);
      return {
        status: response.status,
        data: result.result.data.props as TOutput,
      };
    }

    return {
      status: response.status,
      error: JSON.parse(response.text).error,
    };
  }

  /**
   * GETリクエストを送信する
   */
  async get<TInput, TOutput>(endpoint: string, input?: TInput): Promise<APIResponse<TOutput>> {
    const url = input
      ? `/trpc/${endpoint}?input=${encodeURIComponent(JSON.stringify(input))}`
      : `/trpc/${endpoint}`;

    const response = await request(this.app).get(url).send();

    this.log('GET Request:', { url });
    this.log('GET Response:', {
      status: response.status,
      text: response.text,
    });

    if (response.status === 200) {
      const result = JSON.parse(response.text);
      // findAllの場合は配列の各要素のpropsを取得
      if (Array.isArray(result.result.data)) {
        return {
          status: response.status,
          data: result.result.data.map((item: { props: unknown }) => item.props) as TOutput,
        };
      }
      // 通常のレスポンス
      return {
        status: response.status,
        data: result.result.data.props as TOutput,
      };
    }

    return {
      status: response.status,
      error: JSON.parse(response.text).error,
    };
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
