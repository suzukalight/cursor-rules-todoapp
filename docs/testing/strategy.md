# テスト戦略とベストプラクティス

## 概要

このプロジェクトでは、以下の目的でテストを実装しています：

- ビジネスロジックの正確性の確保
- リグレッションの防止
- コードの品質維持
- ドキュメントとしての役割

## テストの種類

### 1. ユニットテスト

**対象**:
- エンティティ
- ユースケース
- 値オブジェクト
- ユーティリティ関数

**特徴**:
- 独立性の高い小さなテスト
- モックを活用
- 高速な実行
- 高いカバレッジ

**例**:
```typescript
describe('Todo Entity', () => {
  it('タイトルを更新できる', () => {
    const todo = Todo.create({ title: '古いタイトル' });
    todo.updateTitle('新しいタイトル');
    expect(todo.title).toBe('新しいタイトル');
  });

  it('完了済みのTodoを再度完了しようとするとエラーになる', () => {
    const todo = Todo.create({ title: 'タスク' });
    todo.complete();
    expect(() => todo.complete()).toThrow('Todo is already completed');
  });
});
```

### 2. インテグレーションテスト

**対象**:
- リポジトリ
- APIエンドポイント
- ユースケースの連携

**特徴**:
- 実際のデータベースを使用
- 複数のコンポーネントの連携
- エンドツーエンドの動作確認

**例**:
```typescript
describe('TodoRepository', () => {
  let repository: TodoRepository;
  let prisma: PrismaClient;

  beforeEach(async () => {
    prisma = new PrismaClient();
    repository = new TodoRepository(prisma);
    await prisma.todo.deleteMany();
  });

  it('Todoを保存して取得できる', async () => {
    const todo = Todo.create({ title: 'テストタスク' });
    await repository.save(todo);
    const found = await repository.findById(todo.id);
    expect(found).toEqual(todo);
  });
});
```

### 3. UIコンポーネントテスト

**対象**:
- Reactコンポーネント
- カスタムフック
- ユーティリティ関数

**特徴**:
- レンダリングのテスト
- ユーザーインタラクション
- アクセシビリティ
- スナップショットテスト

**例**:
```typescript
describe('TodoForm', () => {
  it('フォームを送信するとTodoが作成される', async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('タイトル'), 'テストタスク');
    await userEvent.click(screen.getByText('作成'));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'テストタスク',
    });
  });
});
```

## テストの原則

### 1. テストの独立性

- 各テストは他のテストに依存しない
- テストの順序は結果に影響しない
- テストデータは各テストで初期化

### 2. テストの可読性

- テスト名は日本語で記述
- Arrange-Act-Assert パターンの使用
- テストの意図が明確になるように記述

### 3. テストの保守性

- DRYよりも明確さを優先
- ヘルパー関数の適切な使用
- テストデータの一元管理

## テスト環境

### 1. テストツール

- **Vitest**: テストランナー
- **Testing Library**: UIテスト
- **MSW**: APIモック
- **Prisma**: テストDB

### 2. テストの実行

```bash
# 全てのテストを実行
pnpm test

# 特定のパッケージのテストを実行
pnpm test --filter @cursor-rules-todoapp/domain

# 変更されたファイルのみテスト
pnpm test --changed

# カバレッジレポートの生成
pnpm test --coverage
```

## テストカバレッジ

### 1. カバレッジ目標

- ドメイン層: 100%
- ユースケース層: 100%
- インターフェース層: 90%以上
- UI層: 80%以上

### 2. カバレッジレポート

```plaintext
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   92.34 |    85.71 |   89.47 |   92.31 |
 domain/src/entities     |     100 |      100 |     100 |     100 |
 domain/src/usecases     |     100 |      100 |     100 |     100 |
 web/src/components      |   85.71 |    78.57 |   83.33 |   85.71 |
--------------------------|---------|----------|---------|---------|
```

## テストのベストプラクティス

### 1. テストの構造

```typescript
describe('機能カテゴリ', () => {
  describe('テスト対象', () => {
    // セットアップ
    beforeEach(() => {
      // テストの準備
    });

    // クリーンアップ
    afterEach(() => {
      // テストの後片付け
    });

    it('期待される動作の説明', () => {
      // Arrange（準備）
      const input = ...;

      // Act（実行）
      const result = ...;

      // Assert（検証）
      expect(result).toBe(...);
    });
  });
});
```

### 2. モックの使用

```typescript
// リポジトリのモック
const mockTodoRepository: TodoRepository = {
  save: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  delete: vi.fn(),
};

// APIのモック
const mockApi = {
  todo: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};
```

### 3. テストデータ

```typescript
// テストデータファクトリ
const createTodo = (override?: Partial<TodoProps>): Todo => {
  return Todo.create({
    title: 'テストタスク',
    status: 'pending',
    ...override,
  });
};
```

## CI/CDでのテスト

### 1. GitHub Actions

```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
    - run: pnpm install
    - run: pnpm test
    - run: pnpm test:coverage
```

### 2. テスト結果の管理

- GitHub Actionsでの自動テスト
- カバレッジレポートの保存
- テスト失敗時の通知

## デバッグとトラブルシューティング

### 1. テストの失敗

- エラーメッセージの確認
- テストの独立性の確認
- 非同期処理の適切な処理

### 2. フラッキーテスト

- タイミングに依存しないテスト
- 適切なセットアップとクリーンアップ
- テスト環境の一貫性 