# 開発者向けガイド

## 概要

このガイドでは、開発環境のセットアップから、コーディング規約、テスト方針、デプロイメントまでの開発プロセス全体について説明します。

## 開発環境のセットアップ

### 1. 必要なツール

```bash
# 必須ツール
Node.js: 20.x
pnpm: 8.x
Git: 2.x
Docker: 24.x
Docker Compose: 2.x

# 推奨ツール
VSCode
Cursor
Biome
```

### 2. 環境構築手順

```bash
# リポジトリのクローン
git clone https://github.com/your-org/cursor-rules-todoapp.git
cd cursor-rules-todoapp

# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集して必要な値を設定

# データベースの起動
docker-compose up -d

# マイグレーションの実行
pnpm prisma migrate dev

# 開発サーバーの起動
pnpm dev
```

## プロジェクト構成

### 1. ディレクトリ構造

```plaintext
root/
├── apps/
│   ├── web/              # Webアプリケーション
│   │   ├── src/
│   │   │   ├── app/     # ページコンポーネント
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   └── tests/
│   └── api/             # APIサーバー
│       ├── src/
│       │   ├── router/
│       │   ├── services/
│       │   └── utils/
│       └── tests/
├── packages/
│   ├── domain/         # ドメインロジック
│   ├── repo-sqlite/    # SQLiteリポジトリ
│   ├── ui/            # UIコンポーネント
│   └── common/        # 共通ユーティリティ
└── docs/              # ドキュメント
```

### 2. 依存関係の管理

```json
// package.json
{
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^1.10.0"
  },
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

## コーディング規約

### 1. 命名規則

```typescript
// パスカルケース: クラス、インターフェース、型
class UserService {}
interface UserRepository {}
type UserResponse = {
  id: string;
  name: string;
};

// キャメルケース: 変数、関数、メソッド
const userData = {};
function getUserById() {}
const calculateTotal = () => {};

// スネークケース: 定数
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = '/api/v1';
```

### 2. ファイル構成

```typescript
// コンポーネントファイル (*.tsx)
import { FC } from 'react';
import styles from './Component.module.css';

interface Props {
  // プロパティの定義
}

export const Component: FC<Props> = (props) => {
  // 実装
};

// フックファイル (*.hooks.ts)
export const useCustomHook = () => {
  // フックの実装
};

// ユーティリティファイル (*.utils.ts)
export const utilityFunction = () => {
  // ユーティリティ関数の実装
};
```

## テスト方針

### 1. ユニットテスト

```typescript
// src/components/TodoItem.test.tsx
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoItem } from './TodoItem';

test('完了状態のTodoアイテムが正しく表示される', () => {
  const todo = {
    id: '1',
    title: 'テストタスク',
    completed: true,
  };

  render(<TodoItem todo={todo} />);
  
  expect(screen.getByText('テストタスク')).toBeInTheDocument();
  expect(screen.getByRole('checkbox')).toBeChecked();
});
```

### 2. 統合テスト

```typescript
// src/features/todo/todo.test.ts
import { test, expect } from 'vitest';
import { TodoService } from './todo.service';
import { TodoRepository } from './todo.repository';

test('Todoの作成と取得が正しく動作する', async () => {
  const repo = new TodoRepository();
  const service = new TodoService(repo);

  const todo = await service.createTodo({
    title: 'テストタスク',
  });

  const retrieved = await service.getTodoById(todo.id);
  expect(retrieved).toEqual(todo);
});
```

## エラー処理

### 1. エラークラス

```typescript
// src/errors/application-error.ts
export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource: string, id: string) {
    super(
      `${resource} with id ${id} not found`,
      'NOT_FOUND',
      404
    );
  }
}
```

### 2. エラーハンドリング

```typescript
// src/middleware/error-handler.ts
import { NextFunction, Request, Response } from 'express';
import { ApplicationError } from '../errors';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApplicationError) {
    return res.status(error.statusCode).json({
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }

  // 予期せぬエラー
  console.error(error);
  return res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
};
```

## パフォーマンス最適化

### 1. フロントエンド最適化

```typescript
// next.config.js
module.exports = {
  // 画像最適化
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // バンドル最適化
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
    };
    return config;
  },
};

// コンポーネントの最適化
import { memo } from 'react';

export const TodoList = memo(({ todos }) => {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
});
```

### 2. バックエンド最適化

```typescript
// src/services/cache.service.ts
import { LRUCache } from 'lru-cache';

export class CacheService {
  private cache: LRUCache<string, any>;

  constructor() {
    this.cache = new LRUCache({
      max: 500,
      ttl: 1000 * 60 * 5, // 5分
    });
  }

  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const cached = this.cache.get(key);
    if (cached) return cached as T;

    const value = await fn();
    this.cache.set(key, value);
    return value;
  }
}
```

## デバッグ方法

### 1. ログ設定

```typescript
// src/utils/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

// 使用例
logger.info({ userId }, 'ユーザーがログインしました');
logger.error(
  { err, requestId },
  'リクエストの処理中にエラーが発生しました'
);
```

### 2. デバッグツール

```typescript
// launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug API",
      "program": "${workspaceFolder}/apps/api/src/main.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "sourceMaps": true
    }
  ]
}
```

## CI/CD

### 1. プルリクエストワークフロー

```yaml
# .github/workflows/pr.yml
name: Pull Request

on:
  pull_request:
    branches: [main, develop]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

### 2. デプロイワークフロー

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - name: Deploy
        run: |
          echo "Deploying to production..."
          # デプロイスクリプト
```

## トラブルシューティング

### 1. よくある問題

1. **ビルドエラー**
   ```bash
   # node_modulesの削除と再インストール
   rm -rf node_modules
   pnpm install
   ```

2. **テストの失敗**
   ```bash
   # テストの詳細ログ
   pnpm test --verbose
   ```

3. **データベース接続エラー**
   ```bash
   # データベースの状態確認
   docker-compose ps
   docker-compose logs db
   ```

### 2. デバッグ方法

1. **APIのデバッグ**
   ```bash
   # 詳細ログの有効化
   LOG_LEVEL=debug pnpm dev
   ```

2. **フロントエンドのデバッグ**
   ```bash
   # React Developer Toolsの使用
   # Chromeの開発者ツールでComponents/Profilerタブを確認
   ``` 