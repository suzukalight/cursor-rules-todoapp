# Todo API 使用例

## クライアントのセットアップ

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@cursor-rules-todoapp/api';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});
```

## 基本的な使用例

### Todo作成

```typescript
// 新しいTodoを作成
const todo = await client.todo.create.mutate({
  title: '牛乳を買う',
  description: 'スーパーで1リットルパックを2つ',
});

console.log(todo);
// {
//   id: '...',
//   title: '牛乳を買う',
//   description: 'スーパーで1リットルパックを2つ',
//   status: 'pending',
//   createdAt: '2024-03-21T12:00:00.000Z',
//   updatedAt: '2024-03-21T12:00:00.000Z'
// }
```

### Todo更新

```typescript
// タイトルと説明を更新
const updatedTodo = await client.todo.update.mutate({
  id: todo.id,
  title: '牛乳と卵を買う',
  description: 'スーパーで\n・牛乳1リットルパック×2\n・卵1パック',
});

// タイトルのみ更新
const titleOnlyUpdate = await client.todo.update.mutate({
  id: todo.id,
  title: '買い物に行く',
});

// 説明のみ更新
const descriptionOnlyUpdate = await client.todo.update.mutate({
  id: todo.id,
  description: '夕方6時までに行く',
});
```

### Todoステータス変更

```typescript
// Todoを完了にする
const completedTodo = await client.todo.changeStatus.mutate({
  id: todo.id,
  action: 'complete',
});

// Todoをキャンセルする
const cancelledTodo = await client.todo.changeStatus.mutate({
  id: todo.id,
  action: 'cancel',
});

// エラーハンドリング
try {
  await client.todo.changeStatus.mutate({
    id: todo.id,
    action: 'complete',
  });
} catch (error) {
  if (error.message.includes('already completed')) {
    console.error('このTodoは既に完了しています');
  }
}
```

### Todo取得

```typescript
// IDでTodoを取得
const todo = await client.todo.findById.query(todoId);
if (todo) {
  console.log(`${todo.title} (${todo.status})`);
} else {
  console.log('Todoが見つかりませんでした');
}

// 全Todoを取得
const todos = await client.todo.findAll.query();
console.log(`${todos.length}件のTodoがあります`);

// ステータスでフィルタリング（クライアントサイド）
const pendingTodos = todos.filter(todo => todo.status === 'pending');
const completedTodos = todos.filter(todo => todo.status === 'completed');
const cancelledTodos = todos.filter(todo => todo.status === 'cancelled');
```

### Todo削除

```typescript
// Todoを削除
await client.todo.delete.mutate(todoId);

// エラーハンドリング
try {
  await client.todo.delete.mutate(todoId);
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Todoが見つかりませんでした');
  }
}
```

## React Hooks での使用例

```typescript
import { trpc } from '../utils/trpc';

function TodoList() {
  // Todo一覧を取得
  const { data: todos, isLoading } = trpc.todo.findAll.useQuery();
  
  // Todo作成
  const createMutation = trpc.todo.create.useMutation({
    onSuccess: () => {
      // 作成成功時に一覧を再取得
      utils.todo.findAll.invalidate();
    },
  });

  // Todo更新
  const updateMutation = trpc.todo.update.useMutation({
    onSuccess: () => {
      utils.todo.findAll.invalidate();
    },
  });

  // Todoステータス変更
  const changeStatusMutation = trpc.todo.changeStatus.useMutation({
    onSuccess: () => {
      utils.todo.findAll.invalidate();
    },
  });

  // Todo削除
  const deleteMutation = trpc.todo.delete.useMutation({
    onSuccess: () => {
      utils.todo.findAll.invalidate();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {todos?.map(todo => (
        <div key={todo.id}>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <p>Status: {todo.status}</p>
          <button
            onClick={() => changeStatusMutation.mutate({
              id: todo.id,
              action: 'complete'
            })}
          >
            完了
          </button>
          <button
            onClick={() => deleteMutation.mutate(todo.id)}
          >
            削除
          </button>
        </div>
      ))}
    </div>
  );
}
``` 