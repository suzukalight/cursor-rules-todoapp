# SQLiteリポジトリの実装

## 概要

SQLiteリポジトリは、ドメイン層で定義されたリポジトリインターフェースの具体的な実装を提供します。
Prismaを使用してSQLiteデータベースとの通信を行い、ドメインモデルとデータベースモデル間の変換を担当します。

## 主要コンポーネント

### 1. データベーススキーマ

```prisma
model Todo {
  id          String    @id
  title       String
  description String?
  status      String    @default("pending")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  completedAt DateTime?

  @@map("todos")
}
```

### 2. データマッパー

`TodoMapper`クラスは、ドメインモデルとPrismaモデル間の変換を担当します：

- `toDomain`: Prismaモデルからドメインモデルへの変換
- `toPrisma`: ドメインモデルからPrismaモデルへの変換

### 3. リポジトリ実装

`TodoRepository`クラスは以下の機能を提供します：

- `save`: Todoの作成・更新
- `findById`: IDによるTodoの検索
- `findAll`: 全Todoの取得
- `delete`: Todoの削除
- `transaction`: トランザクション管理

## テスト戦略

1. **単体テスト**
   - 各メソッドの基本的な動作確認
   - エッジケースの処理
   - トランザクションの動作確認

2. **テストデータ管理**
   - テスト前にデータベースをクリーンアップ
   - テスト後にコネクションを切断

3. **トランザクションテスト**
   - 正常系：トランザクション内での操作の成功
   - 異常系：エラー時のロールバック確認

## 設定と環境変数

必要な環境変数：
- `DATABASE_URL`: SQLiteデータベースの接続URL

## 依存関係

- `@cursor-rules-todoapp/domain`: ドメインモデルとインターフェース
- `@prisma/client`: データベースアクセス
- `prisma`: スキーマ管理とマイグレーション

## 使用方法

```typescript
import { PrismaClient } from '@prisma/client';
import { TodoRepository } from '@cursor-rules-todoapp/repo-sqlite';

const prisma = new PrismaClient();
const todoRepository = new TodoRepository(prisma);

// Todoの作成
const todo = Todo.create({
  title: 'タスク',
  status: 'pending',
});
await todoRepository.save(todo);

// トランザクションの使用
await todoRepository.transaction(async () => {
  await todoRepository.save(todo1);
  await todoRepository.save(todo2);
});
```

## 注意事項

1. **NULL処理**
   - オプショナルな値（description, completedAt）のNULL変換に注意
   - ドメインモデルではundefined、DBではnullを使用

2. **トランザクション**
   - 複数の操作を伴う場合は必ずトランザクションを使用
   - エラー時は自動的にロールバック

3. **接続管理**
   - PrismaClientのインスタンスは適切に管理
   - テスト時はafterEachで必ず切断 