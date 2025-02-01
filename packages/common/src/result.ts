export class Result<T, E extends Error> {
  private constructor(
    private readonly _value: T | null,
    private readonly _error: E | null
  ) {}

  static ok<T, E extends Error>(value: T): Result<T, E> {
    return new Result<T, E>(value, null);
  }

  static err<T, E extends Error>(error: E): Result<T, E> {
    return new Result<T, E>(null, error);
  }

  isOk(): boolean {
    return this._error === null;
  }

  isErr(): boolean {
    return this._error !== null;
  }

  get value(): T {
    if (this._error !== null) {
      throw new Error('Cannot get value from error result');
    }
    return this._value!;
  }

  get error(): E {
    if (this._error === null) {
      throw new Error('Cannot get error from ok result');
    }
    return this._error;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this._error !== null) {
      return Result.err(this._error);
    }
    return Result.ok(fn(this._value!));
  }

  mapErr<F extends Error>(fn: (error: E) => F): Result<T, F> {
    if (this._error === null) {
      return Result.ok(this._value!);
    }
    return Result.err(fn(this._error));
  }

  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this._error !== null) {
      return Result.err(this._error);
    }
    return fn(this._value!);
  }
}
