# tRPCのDate型シリアライズ問題の解決

## 概要

tRPCを使用したTodoアプリケーションにおいて、`Date`オブジェクトのシリアライズ/デシリアライズ時に型の不整合が発生する問題を解決しました。SuperJSONを導入することで、クライアント-サーバー間でのデータ型の一貫性を確保しました。

## 変更日

2025-02-03

## 問題の背景

tRPCのデフォルトの動作では、`Date`オブジェクトはJSONシリアライズの過程で文字列に変換されます。これにより、以下のような問題が発生していました：

```typescript
TRPCClientError: [
  {
    "code": "invalid_type",
    "expected": "date",
    "received": "string",
    "path": ["dueDate"],
    "message": "Expected date, received string"
  }
]
```

## 解決方法

### 1. SuperJSONの導入

```bash
pnpm add -w superjson
```

### 2. サーバー側の設定（`apps/api/src/trpc.ts`）

```typescript
import { initTRPC } from '@trpc/server';
import type { Context } from './context';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
```

### 3. クライアント側の設定（`apps/web/src/utils/api.ts`）

```typescript
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';

export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
      headers: () => ({
        'x-trpc-source': 'react',
      }),
    }),
  ],
});
```

## 変更の影響

1. 型の安全性
   - `Date`オブジェクトが自動的に正しく変換されるようになりました
   - 手動での型変換が不要になりました

2. コードの簡潔化
   - 日付の変換処理を削除できました
   - エラーハンドリングが簡単になりました

3. パフォーマンス
   - データの変換が効率的に行われるようになりました
   - 余分な型変換処理が不要になりました

## テスト

以下の機能が正常に動作することを確認：

- Todoアイテムの期限日の設定
- 期限日の更新
- 期限日の削除
- 期限日によるフィルタリング

## 関連する変更

- [期限更新機能の追加](./add-duedate-update.md)

## 参考資料

- [tRPC公式ドキュメント - Data Transformers](https://trpc.io/docs/data-transformers)
- [SuperJSON公式ドキュメント](https://github.com/blitz-js/superjson)

## 今後の課題

- 他のデータ型（BigInt, Map, Set等）のシリアライズ対応の検討
- パフォーマンスモニタリングの導入
- エラーハンドリングの強化 