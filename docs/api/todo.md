# Todo API

## エンドポイント一覧

### Todo作成

```typescript
POST /api/trpc/todo.create

// リクエスト
{
  title: string;      // タイトル（必須）
  description?: string; // 説明（任意）
}

// レスポンス
{
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
```

### Todo更新

```typescript
POST /api/trpc/todo.update

// リクエスト
{
  id: string;         // Todo ID（必須）
  title?: string;     // 新しいタイトル（任意）
  description?: string; // 新しい説明（任意）
}

// レスポンス
{
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// エラー
- Todo not found: 指定されたIDのTodoが見つからない場合
```

### Todoステータス変更

```typescript
POST /api/trpc/todo.changeStatus

// リクエスト
{
  id: string;         // Todo ID（必須）
  action: 'complete' | 'cancel'; // 実行するアクション（必須）
}

// レスポンス
{
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// エラー
- Todo not found: 指定されたIDのTodoが見つからない場合
- Todo is already completed: 既に完了済みのTodoを完了しようとした場合
- Todo is already cancelled: 既にキャンセル済みのTodoをキャンセルしようとした場合
```

### Todo取得（ID指定）

```typescript
GET /api/trpc/todo.findById

// リクエスト
id: string  // Todo ID（必須）

// レスポンス
{
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
} | null  // Todoが見つからない場合はnull
```

### Todo一覧取得

```typescript
GET /api/trpc/todo.findAll

// リクエスト
なし

// レスポンス
{
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}[]
```

### Todo削除

```typescript
POST /api/trpc/todo.delete

// リクエスト
id: string  // Todo ID（必須）

// レスポンス
void  // 成功時は何も返さない
```

## 型定義

### Todo

```typescript
interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

type TodoStatus = 'pending' | 'completed' | 'cancelled';
```

## エラーハンドリング

各APIは以下のような形式でエラーを返します：

```typescript
{
  error: {
    message: string;  // エラーメッセージ
    code: string;     // エラーコード
  }
}
```

### 共通エラー

- `NOT_FOUND`: リソースが見つからない
- `INVALID_INPUT`: 入力値が不正
- `INVALID_STATE`: 不正な状態遷移 