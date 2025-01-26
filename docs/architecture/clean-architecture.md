# クリーンアーキテクチャ

## 概要

このプロジェクトは、Robert C. Martinのクリーンアーキテクチャの原則に従って設計されています。この設計により、以下の利点を得ています：

- ビジネスロジックの独立性
- テスト容易性
- フレームワークやデータベースからの独立性
- 依存関係の明確な方向性

## アーキテクチャの層

### 1. エンティティ層（Domain）

ビジネスロジックの中核を担う層です。

```typescript
// packages/domain/src/entities/todo.ts
export class Todo {
  private readonly props: TodoProps;

  // ファクトリメソッド
  public static create(props: Omit<TodoProps, 'id' | 'createdAt' | 'updatedAt'>): Todo {
    const now = new Date();
    return new Todo({
      ...props,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }

  // ビジネスロジック
  public complete(): void {
    if (this.status === 'completed') {
      throw new Error('Todo is already completed');
    }
    this.props.status = 'completed';
    this.props.completedAt = new Date();
    this.props.updatedAt = new Date();
  }
}
```

### 2. ユースケース層（Application）

アプリケーションの具体的なユースケースを実装する層です。

```typescript
// packages/domain/src/usecases/create-todo.ts
export class CreateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(input: CreateTodoInput): Promise<Todo> {
    const todo = Todo.create({
      title: input.title,
      description: input.description,
      status: 'pending',
    });

    await this.todoRepository.save(todo);
    return todo;
  }
}
```

### 3. インターフェースアダプター層（Interface Adapters）

外部インターフェースとドメイン層の橋渡しを行う層です。

```typescript
// apps/api/src/router/todo.ts
export const createTodoRouter = (todoRepository: TodoRepository) => {
  const createTodoUseCase = new CreateTodoUseCase(todoRepository);
  
  return trpc.router({
    create: trpc.procedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }): Promise<Todo> => {
        return createTodoUseCase.execute(input);
      }),
  });
};
```

### 4. フレームワーク・ドライバー層（Frameworks & Drivers）

外部フレームワークやツールとの統合を行う層です。

```typescript
// packages/repo-sqlite/src/repositories/todo-repository.ts
export class TodoRepository implements TodoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(todo: Todo): Promise<void> {
    await this.prisma.todo.upsert({
      where: { id: todo.id },
      create: this.toData(todo),
      update: this.toData(todo),
    });
  }
}
```

## 依存関係の方向

依存関係は、常に外側から内側に向かって流れます：

```plaintext
UI/Web → API/Controllers → UseCases → Entities
```

## パッケージ構成

### @cursor-rules-todoapp/domain

- エンティティ
- ユースケース
- リポジトリインターフェース
- ドメインサービス

### @cursor-rules-todoapp/repo-sqlite

- SQLiteリポジトリの実装
- Prismaとの統合
- データマッピング

### apps/api

- tRPCルーター
- エラーハンドリング
- DIコンテナ

### apps/web

- Reactコンポーネント
- ページ実装
- APIクライアント

## 重要な設計原則

1. **依存性逆転の原則（DIP）**
   - インターフェースを使用して依存関係を抽象化
   - 具体的な実装は外側の層で提供

2. **単一責任の原則（SRP）**
   - 各クラスは単一の責任のみを持つ
   - ユースケースは1つの具体的なタスクに特化

3. **インターフェース分離の原則（ISP）**
   - リポジトリインターフェースは必要最小限のメソッドのみを定義
   - クライアントに不要なメソッドを強制しない

## テスト戦略

1. **ドメインテスト**
   - エンティティの振る舞いをユニットテストでカバー
   - ビジネスルールの検証

2. **ユースケーステスト**
   - モックリポジトリを使用
   - ビジネスフローの検証

3. **インテグレーションテスト**
   - 実際のデータベースを使用
   - エンドツーエンドの動作確認

## エラーハンドリング

1. **ドメインエラー**
   - ビジネスルール違反を表現
   - カスタムエラークラスを使用

2. **アプリケーションエラー**
   - ユースケース実行時のエラー
   - 適切なエラーコードとメッセージ

3. **インフラストラクチャエラー**
   - データベースエラー
   - ネットワークエラー

## トランザクション管理

- リポジトリレベルでトランザクションを管理
- ユースケースでトランザクションスコープを制御

```typescript
export interface TodoRepository {
  transaction<T>(operation: () => Promise<T>): Promise<T>;
}
``` 