import { describe, expect, it } from 'vitest';
import { createContainer } from '.';

describe('Container', () => {
  it('コンテナを作成できる', () => {
    const container = createContainer();
    expect(container).toBeDefined();
  });

  it('todoRepositoryを取得できる', () => {
    const container = createContainer();
    expect(container.todoRepository).toBeDefined();
  });
});
