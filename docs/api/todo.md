# Todo API

## 概要

TodoアプリケーションのAPIエンドポイントです。tRPCを使用して実装されています。

## エンドポイント

### create

新しいTodoを作成します。

- **メソッド**: `mutation`
- **入力**:
  ```typescript
  {
    title: string;      // 必須、1文字以上
    description?: string; // オプション
  }
  ```
- **戻り値**: `Todo`
- **エラー**:
  - バリデーションエラー: タイトルが空の場合

### update

既存のTodoを更新します。

- **メソッド**: `mutation`
- **入力**:
  ```typescript
  {
    id: string;         // 必須
    title?: string;     // オプション、1文字以上
    description?: string; // オプション
  }
  ```
- **戻り値**: `Todo`
- **エラー**:
  - `NOT_FOUND`: 指定されたIDのTodoが存在しない場合
  - バリデーションエラー: タイトルが空の場合

### changeStatus

Todoのステータスを変更します。

- **メソッド**: `mutation`
- **入力**:
  ```typescript
  {
    id: string;
    action: 'complete' | 'cancel';
  }
  ```
- **戻り値**: `Todo`
- **エラー**:
  - `NOT_FOUND`: 指定されたIDのTodoが存在しない場合

### findById

指定されたIDのTodoを取得します。

- **メソッド**: `query`
- **入力**: `string` (Todo ID)
- **戻り値**: `Todo`
- **エラー**:
  - `NOT_FOUND`: 指定されたIDのTodoが存在しない場合

### findAll

すべてのTodoを取得します。

- **メソッド**: `query`
- **入力**: なし
- **戻り値**: `Todo[]`

### delete

指定されたTodoを削除します。

- **メソッド**: `mutation`
- **入力**:
  ```typescript
  {
    id: string;
  }
  ```
- **戻り値**: `void`
- **エラー**:
  - `NOT_FOUND`: 指定されたIDのTodoが存在しない場合

## 型定義

### Todo

```typescript
type TodoStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
```

### ステータス

| ステータス | ラベル |
|------------|--------|
| pending | 未着手 |
| in-progress | 進行中 |
| completed | 完了 |
| cancelled | キャンセル |

## エラーハンドリング

APIは以下のエラーを返す可能性があります：

- `NOT_FOUND`: リソースが見つからない
- `BAD_REQUEST`: リクエストが不正
- `INTERNAL_SERVER_ERROR`: サーバー内部エラー

エラーレスポンスの形式：

```typescript
{
  code: string;    // エラーコード
  message: string; // エラーメッセージ
  cause?: unknown; // エラーの原因（開発環境のみ）
}
``` 