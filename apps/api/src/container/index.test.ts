import { describe, expect, it } from 'vitest';
import { createContainer } from '../container';

const TEST_DATABASE_URL = 'file:./test.db?mode=memory&cache=shared';

describe('Container', () => {
  it('コンテナを作成できる', () => {
    const container = createContainer(TEST_DATABASE_URL);
    expect(container).toBeDefined();
  });

  it('todoRepositoryを取得できる', () => {
    const container = createContainer(TEST_DATABASE_URL);
    expect(container.todoRepository).toBeDefined();
  });
});
