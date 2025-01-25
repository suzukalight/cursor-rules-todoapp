# APIサーバーの実装

## 概要

APIサーバーは、tRPCを使用してドメインロジックをクライアントに公開します。
クリーンアーキテクチャの原則に従い、依存性の注入を活用して実装の詳細を抽象化しています。

## 主要コンポーネント

### 1. tRPCルーター

```typescript
export const createTodoRouter = (todoRepository: TodoRepository) => {
  const createTodoUseCase = new CreateTodoUseCase(todoRepository);

  return t.router({
    create: t.procedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }): Promise<Todo> => {
        return createTodoUseCase.execute(input);
      }),
    // ...
  });
};
```

- 入力バリデーション（Zod）
- エンドポイントの型安全性
- ユースケースの活用

### 2. DIコンテナ

```typescript
export const createContainer = (): Container => {
  const prisma = new PrismaClient();
  const todoRepository = new TodoRepository(prisma);

  return {
    todoRepository,
  };
};
```

- 依存関係の管理
- インスタンスの生成と注入
- テスト時のモック容易性

### 3. エラーハンドリング

```typescript
export const handleError = (error: unknown) => {
  if (error instanceof ZodError) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Invalid input: ${error.errors.map((e) => e.message).join(', ')}`,
    });
  }
  // ...
};
```

- バリデーションエラーの処理
- エラーメッセージの標準化
- クライアントへの適切なエラー伝達

## エンドポイント

1. **Todo作成**
   - パス: `/trpc/create`
   - メソッド: `mutation`
   - 入力: `{ title: string, description?: string }`

2. **Todo取得**
   - パス: `/trpc/findById`
   - メソッド: `query`
   - 入力: `string`（TodoのID）

3. **Todo一覧取得**
   - パス: `/trpc/findAll`
   - メソッド: `query`
   - 入力: なし

4. **Todo削除**
   - パス: `/trpc/delete`
   - メソッド: `mutation`
   - 入力: `string`（TodoのID）

## 設定

1. **サーバー設定**
   - ポート: 3001（デフォルト）
   - CORS: 有効
   - JSON解析: 有効

2. **環境変数**
   - `PORT`: サーバーポート番号
   - `DATABASE_URL`: データベース接続URL（repo-sqliteから継承）

## 依存関係

- `@trpc/server`: APIエンドポイントの実装
- `express`: HTTPサーバー
- `zod`: 入力バリデーション
- `@cursor-rules-todoapp/domain`: ドメインロジック
- `@cursor-rules-todoapp/repo-sqlite`: データアクセス

## 使用方法

```typescript
// サーバーの起動
pnpm dev  // 開発モード
pnpm start  // 本番モード

// クライアントからの利用
const client = createTRPCClient({
  url: 'http://localhost:3001/trpc',
});

// Todoの作成
const todo = await client.create.mutate({
  title: 'タスク',
  description: '説明',
});
```

## 注意事項

1. **エラーハンドリング**
   - すべてのエラーを適切にキャッチし変換
   - クライアントに意味のあるエラーメッセージを提供
   - 機密情報の漏洩を防止

2. **バリデーション**
   - すべての入力を厳密に検証
   - 不正な入力は早期にリジェクト

3. **パフォーマンス**
   - 大量のデータ取得時はページネーションを検討
   - N+1問題に注意

4. **セキュリティ**
   - CORSの適切な設定
   - 入力のサニタイズ
   - レート制限の検討 