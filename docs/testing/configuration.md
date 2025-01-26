# テスト設定ガイド

## Vitestの設定

### 基本設定

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // グローバル設定
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    
    // カバレッジ設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
    },

    // タイムアウト設定
    timeout: 10000,
    
    // 並列実行
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
  },
});
```

### パッケージごとの設定

```typescript
// packages/domain/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // ドメイン層特有の設定
    environment: 'node',
    coverage: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
});

// apps/web/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Web層特有の設定
    environment: 'jsdom',
    coverage: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
});
```

## テストセットアップ

### グローバルセットアップ

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { server } from './mocks/server';

// MSWのセットアップ
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// グローバルモック
vi.mock('@trpc/client', () => ({
  createTRPCProxyClient: vi.fn(),
}));

// テスト用ユーティリティ
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

### Testing Libraryの設定

```typescript
// src/test/test-utils.tsx
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

export function renderWithProviders(ui: React.ReactElement) {
  const [queryClient] = useState(() => createTestQueryClient());

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}
```

## MSWの設定

### ハンドラーの定義

```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/trpc/todo.create', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '1',
        title: 'テストタスク',
        status: 'pending',
        createdAt: new Date().toISOString(),
      })
    );
  }),
];
```

### サーバーの設定

```typescript
// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

## Prismaのテスト設定

### テスト用データベース

```typescript
// packages/repo-sqlite/src/test/prisma.ts
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

export async function setupTestDatabase() {
  // マイグレーション実行
  execSync('pnpm prisma migrate reset --force');
  
  // 初期データ投入
  await prisma.todo.createMany({
    data: [
      {
        id: '1',
        title: 'テストタスク1',
        status: 'pending',
      },
      {
        id: '2',
        title: 'テストタスク2',
        status: 'completed',
      },
    ],
  });
}
```

## GitHub Actionsの設定

### テスト実行ワークフロー

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
          
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Run tests
        run: pnpm test
        
      - name: Upload coverage
        uses: actions/upload-artifact@v2
        with:
          name: coverage
          path: coverage/
```

## スクリプトの設定

### package.jsonの設定

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:changed": "vitest related --changed"
  }
}
```

## デバッグ設定

### VS Code設定

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Current Test",
      "autoAttachChildProcesses": true,
      "skipFiles": ["<node_internals>/**", "**/node_modules/**"],
      "program": "${workspaceRoot}/node_modules/vitest/vitest.mjs",
      "args": ["run", "${relativeFile}"],
      "smartStep": true,
      "console": "integratedTerminal"
    }
  ]
}
``` 