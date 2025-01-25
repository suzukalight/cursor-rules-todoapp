# ドメイン層の設計と実装

## アーキテクチャ概要

本プロジェクトではクリーンアーキテクチャを採用し、以下の層構造を持つように設計しています：

```
packages/
  ├── domain/          # ドメイン層（エンティティ、ユースケース、リポジトリインターフェース）
  ├── repo-sqlite/     # インフラ層（SQLiteリポジトリの実装）
  └── repo-postgres/   # インフラ層（将来的なPostgreSQLリポジトリの実装）
```

## ドメインモデル

### Todo エンティティ

```typescript
export type TodoStatus = 'pending' | 'completed' | 'cancelled';

export interface TodoProps {
  id: TodoId;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
```

#### 設計方針

1. **不変性の保証**
   - privateなpropsを使用し、外部からの直接的な状態変更を防止
   - 状態変更は必ずメソッドを通じて行う

2. **ファクトリメソッド**
   - `create`: 新規作成用のファクトリメソッド
   - `reconstruct`: DBからの再構築用のファクトリメソッド

3. **ドメインロジック**
   - `complete()`: Todoの完了処理
   - `cancel()`: Todoのキャンセル処理
   - `updateTitle()`: タイトルの更新
   - `updateDescription()`: 説明の更新

## リポジトリ

### TodoRepository インターフェース

```typescript
export interface TodoRepository {
  save(todo: Todo): Promise<void>;
  findById(id: TodoId): Promise<Todo | null>;
  findAll(): Promise<Todo[]>;
  delete(id: TodoId): Promise<void>;
  transaction<T>(operation: () => Promise<T>): Promise<T>;
}
```

#### 設計方針

1. **依存性の逆転**
   - インターフェースのみをドメイン層で定義
   - 実装の詳細はインフラ層に委譲

2. **トランザクション管理**
   - リポジトリレベルでトランザクションを制御
   - 実装の詳細は各リポジトリに委ねる

## ユースケース

### CreateTodoUseCase

```typescript
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

#### 設計方針

1. **単一責任の原則**
   - 各ユースケースは1つの責務のみを持つ
   - 入力データの受け取りから、ドメインモデルの操作、永続化までを一貫して処理

2. **依存性の注入**
   - リポジトリはコンストラクタインジェクションで注入
   - テスタビリティの向上

## 今後の課題

1. **エラーハンドリング**
   - ドメイン固有の例外クラスの定義
   - エラーの階層構造の設計

2. **バリデーション**
   - 入力値のバリデーション方針の決定
   - バリデーションルールの実装場所の検討

3. **トランザクション管理**
   - トランザクションの境界の明確化
   - 複数リポジトリ間のトランザクション管理 