# APIクライアントの使用方法

## セットアップ

APIクライアントは、tRPCを使用して実装されています。以下の手順でセットアップを行います。

```typescript
// utils/api.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@cursor-rules-todoapp/api';

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
    }),
  ],
});
```

## 使用例

### Todo作成

```typescript
const createTodo = async () => {
  try {
    const todo = await api.todo.create.mutate({
      title: 'タスクのタイトル',
      description: 'タスクの説明',
    });
    console.log('作成されたTodo:', todo);
  } catch (error) {
    console.error('Todoの作成に失敗しました:', error);
  }
};
```

### Todo更新

```typescript
const updateTodo = async (id: string) => {
  try {
    const todo = await api.todo.update.mutate({
      id,
      title: '新しいタイトル',
      description: '新しい説明',
    });
    console.log('更新されたTodo:', todo);
  } catch (error) {
    console.error('Todoの更新に失敗しました:', error);
  }
};
```

### ステータス変更

```typescript
const completeTodo = async (id: string) => {
  try {
    const todo = await api.todo.changeStatus.mutate({
      id,
      action: 'complete',
    });
    console.log('完了したTodo:', todo);
  } catch (error) {
    console.error('Todoの完了に失敗しました:', error);
  }
};
```

### Todo取得

```typescript
// 単一のTodo取得
const getTodo = async (id: string) => {
  try {
    const todo = await api.todo.findById.query(id);
    console.log('取得したTodo:', todo);
  } catch (error) {
    console.error('Todoの取得に失敗しました:', error);
  }
};

// 全てのTodo取得
const getAllTodos = async () => {
  try {
    const todos = await api.todo.findAll.query();
    console.log('全てのTodo:', todos);
  } catch (error) {
    console.error('Todoの取得に失敗しました:', error);
  }
};
```

### Todo削除

```typescript
const deleteTodo = async (id: string) => {
  try {
    await api.todo.delete.mutate({ id });
    console.log('Todoを削除しました');
  } catch (error) {
    console.error('Todoの削除に失敗しました:', error);
  }
};
```

## エラーハンドリング

APIクライアントは、以下のようなエラーを返す可能性があります：

```typescript
import { TRPCClientError } from '@trpc/client';

try {
  await api.todo.findById.query('non-existent-id');
} catch (error) {
  if (error instanceof TRPCClientError) {
    // エラーコードとメッセージを取得
    console.error('エラーコード:', error.data?.code);
    console.error('エラーメッセージ:', error.message);
  }
}
```

## React Hooks

React環境では、`@trpc/react-query`を使用してより便利なフックを利用できます：

```typescript
import { api } from '../utils/api';

// データ取得
const { data: todos, isLoading } = api.todo.findAll.useQuery();

// データ更新
const { mutate: createTodo } = api.todo.create.useMutation({
  onSuccess: (newTodo) => {
    console.log('Todoが作成されました:', newTodo);
  },
  onError: (error) => {
    console.error('Todoの作成に失敗しました:', error);
  },
});

// 使用例
createTodo({
  title: '新しいタスク',
  description: 'タスクの説明',
});
``` 