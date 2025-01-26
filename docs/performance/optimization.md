# パフォーマンス最適化ガイド

## 概要

このガイドでは、アプリケーションのパフォーマンスを最適化するための戦略と具体的な実装方法を説明します。

## パフォーマンス目標

### レスポンスタイム

- API応答時間: 500ms以内
- 画面初期表示: 1.5秒以内
- インタラクション: 100ms以内

### リソース使用量

- メモリ使用量: 512MB以内
- CPU使用率: 50%以下
- ディスク使用量: 1GB以内

### 同時接続

- 同時接続数: 100以上
- リクエストレート: 1000req/分以上

## フロントエンドの最適化

### 1. バンドルサイズの最適化

```typescript
// next.config.js
module.exports = {
  // コード分割の設定
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 70000,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };
    return config;
  },
};
```

### 2. コンポーネントの最適化

```typescript
// メモ化による再レンダリングの防止
const TodoList = memo(({ todos }: TodoListProps) => {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
});

// 仮想スクロールの実装
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualTodoList = ({ todos }: TodoListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: todos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((item) => (
          <TodoItem key={item.key} todo={todos[item.index]} />
        ))}
      </div>
    </div>
  );
};
```

### 3. データフェッチの最適化

```typescript
// キャッシュの設定
const { data: todos } = api.todo.findAll.useQuery(undefined, {
  staleTime: 1000 * 60, // 1分間はキャッシュを使用
  cacheTime: 1000 * 60 * 5, // 5分間キャッシュを保持
});

// プリフェッチの実装
const prefetchTodos = async () => {
  await queryClient.prefetchQuery(['todos'], () => api.todo.findAll.query());
};
```

## バックエンドの最適化

### 1. データベースの最適化

```typescript
// インデックスの設定
model Todo {
  id          String   @id
  title       String
  status      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([status])
  @@index([createdAt])
}

// クエリの最適化
const findTodos = async (status: TodoStatus): Promise<Todo[]> => {
  return prisma.todo.findMany({
    where: { status },
    select: {
      id: true,
      title: true,
      status: true,
    },
  });
};
```

### 2. キャッシュ戦略

```typescript
// メモリキャッシュの実装
import { LRUCache } from 'lru-cache';

const todoCache = new LRUCache<string, Todo>({
  max: 500, // 最大500件
  ttl: 1000 * 60 * 5, // 5分間
});

class TodoRepository implements TodoRepository {
  async findById(id: string): Promise<Todo | null> {
    // キャッシュからの取得
    const cached = todoCache.get(id);
    if (cached) return cached;

    // DBからの取得
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (todo) {
      todoCache.set(id, todo);
    }
    return todo;
  }
}
```

### 3. N+1問題の解決

```typescript
// 一括取得の実装
const findTodosWithDetails = async (): Promise<TodoWithDetails[]> => {
  return prisma.todo.findMany({
    include: {
      tags: true,
      assignee: true,
    },
  });
};
```

## インフラストラクチャの最適化

### 1. コネクションプール

```typescript
// Prismaのコネクションプール設定
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  connection: {
    pool: {
      min: 5,
      max: 10,
    },
  },
});
```

### 2. 負荷分散

```typescript
// ロードバランサーの設定
export const config = {
  api: {
    bodyParser: false,
  },
  experimental: {
    regions: ['iad1', 'sfo1'],
    fallback: {
      iad1: 'sfo1',
      sfo1: 'iad1',
    },
  },
};
```

## モニタリングと計測

### 1. パフォーマンスメトリクス

```typescript
// カスタムメトリクスの実装
const measureApiResponse = async (name: string, fn: () => Promise<any>) => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    console.log(`API ${name}: ${duration}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`API ${name} failed: ${duration}ms`, error);
    throw error;
  }
};
```

### 2. エラー監視

```typescript
// エラートラッキングの実装
const trackError = (error: Error, context: Record<string, any> = {}) => {
  console.error('Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...context,
  });
};
```

## パフォーマンステスト

### 1. 負荷テスト

```typescript
// k6を使用した負荷テスト
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3000/api/todos');
  check(res, {
    'is status 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

### 2. メモリリーク検出

```typescript
// メモリ使用量の監視
import { PerformanceObserver } from 'perf_hooks';

const obs = new PerformanceObserver((list) => {
  const entry = list.getEntries()[0];
  console.log(`Memory used: ${entry.detail.usedJSHeapSize / 1024 / 1024} MB`);
});
obs.observe({ entryTypes: ['gc'] });
```

## ベストプラクティス

1. **レンダリングの最適化**
   - 不要な再レンダリングの防止
   - コンポーネントの適切な分割
   - メモ化の活用

2. **データ取得の最適化**
   - 必要なデータのみ取得
   - キャッシュの活用
   - バッチ処理の実装

3. **リソース管理**
   - メモリリークの防止
   - コネクションプールの適切な設定
   - リソースの適切な解放 