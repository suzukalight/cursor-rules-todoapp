# エラーハンドリング

## 概要

APIのエラーハンドリングは、tRPCのエラーシステムを使用して実装されています。エラーは適切なエラーコードとメッセージを含み、クライアントサイドで適切に処理できるように設計されています。

## エラーの種類

### システムエラー

| エラーコード | 説明 | 対処方法 |
|------------|------|----------|
| `INTERNAL_SERVER_ERROR` | サーバー内部で予期せぬエラーが発生 | システム管理者に連絡 |
| `TIMEOUT` | リクエストがタイムアウト | 再試行するか、ネットワーク状態を確認 |
| `UNAUTHORIZED` | 認証が必要 | ログインを促す |
| `FORBIDDEN` | アクセス権限がない | 適切な権限を持つユーザーでログイン |

### 入力エラー

| エラーコード | 説明 | 対処方法 |
|------------|------|----------|
| `BAD_REQUEST` | リクエストの形式が不正 | 入力値を確認 |
| `PARSE_ERROR` | リクエストのパースに失敗 | 入力形式を確認 |
| `VALIDATION_ERROR` | 入力値のバリデーションに失敗 | エラーメッセージに従って入力を修正 |

### ビジネスロジックエラー

| エラーコード | 説明 | 対処方法 |
|------------|------|----------|
| `NOT_FOUND` | リソースが見つからない | IDや検索条件を確認 |
| `CONFLICT` | リソースの競合が発生 | 最新の状態を確認して再試行 |
| `INVALID_STATE` | 不正な状態遷移 | 現在の状態を確認 |

## サーバーサイドの実装

```typescript
// エラーハンドリングミドルウェア
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    onError: ({ error }) => {
      handleError(error);
    },
  })
);

// エラーハンドラー
export const handleError = (error: unknown): void => {
  if (error instanceof TRPCError) {
    console.error('[tRPC Error]', error.code, error.message);
    return;
  }

  if (error instanceof Error) {
    console.error('[Error]', error.message);
    return;
  }

  console.error('[Unknown Error]', error);
};
```

## クライアントサイドの実装

### 基本的なエラーハンドリング

```typescript
try {
  const todo = await api.todo.findById.query(id);
} catch (error) {
  if (error instanceof TRPCClientError) {
    switch (error.data?.code) {
      case 'NOT_FOUND':
        // Todoが見つからない場合の処理
        break;
      case 'VALIDATION_ERROR':
        // バリデーションエラーの処理
        break;
      default:
        // その他のエラーの処理
        break;
    }
  }
}
```

### React Hooksでのエラーハンドリング

```typescript
// データ取得時のエラーハンドリング
const { data: todos, error } = api.todo.findAll.useQuery(undefined, {
  retry: false,
  onError: (error) => {
    // エラー発生時の処理
    console.error('Todoの取得に失敗しました:', error);
  },
});

// データ更新時のエラーハンドリング
const { mutate: updateTodo } = api.todo.update.useMutation({
  onError: (error) => {
    if (error.data?.code === 'NOT_FOUND') {
      // Todoが見つからない場合の処理
      console.error('指定されたTodoが見つかりません');
    } else if (error.data?.code === 'VALIDATION_ERROR') {
      // バリデーションエラーの処理
      console.error('入力値が不正です:', error.message);
    } else {
      // その他のエラーの処理
      console.error('予期せぬエラーが発生しました:', error);
    }
  },
});
```

## エラーメッセージのカスタマイズ

エラーメッセージは、以下のように状況に応じてカスタマイズできます：

```typescript
throw new TRPCError({
  code: 'NOT_FOUND',
  message: `ID ${id} のTodoは存在しません`,
  // 開発環境でのみ表示される追加情報
  cause: {
    details: '詳細な情報',
    timestamp: new Date(),
  },
});
```

## エラー発生時のユーザー体験

1. **分かりやすいエラーメッセージ**
   - 技術的な詳細は隠し、ユーザーが理解できる言葉で表示
   - 問題の解決方法を提案

2. **適切なUIフィードバック**
   - エラーの種類に応じた表示方法
   - トースト通知やエラーバナーの使用

3. **リカバリーオプション**
   - 再試行ボタンの提供
   - 代替手段の提案
   - 前の状態への復帰オプション

## ベストプラクティス

1. **エラーの集中管理**
   - エラーコードとメッセージの一元管理
   - 一貫性のあるエラーフォーマット

2. **適切なログ記録**
   - エラーの詳細な情報をログに記録
   - 開発環境と本番環境で異なるログレベル

3. **グレースフルデグラデーション**
   - 部分的な機能停止時でもアプリケーションを継続
   - 代替機能の提供 