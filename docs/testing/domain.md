# ドメイン層のテスト方針

## テストの階層

ドメイン層のテストは以下の3つの階層で実施します：

1. **ユニットテスト**
   - エンティティのテスト
   - バリューオブジェクトのテスト
   - ドメインサービスのテスト

2. **ユースケーステスト**
   - 各ユースケースの単体テスト
   - モックリポジトリを使用

3. **統合テスト**
   - 実際のリポジトリ実装を使用したテスト
   - インメモリデータベースを使用

## テスト方針

### エンティティのテスト

```typescript
describe('Todo', () => {
  describe('create', () => {
    it('should create a new todo with pending status', () => {
      const todo = Todo.create({
        title: 'Test Todo',
        description: 'Test Description',
        status: 'pending',
      });

      expect(todo.title).toBe('Test Todo');
      expect(todo.description).toBe('Test Description');
      expect(todo.status).toBe('pending');
      expect(todo.id).toBeDefined();
      expect(todo.createdAt).toBeDefined();
      expect(todo.updatedAt).toBeDefined();
      expect(todo.completedAt).toBeUndefined();
    });
  });

  describe('complete', () => {
    it('should complete a pending todo', () => {
      const todo = Todo.create({
        title: 'Test Todo',
        status: 'pending',
      });

      todo.complete();

      expect(todo.status).toBe('completed');
      expect(todo.completedAt).toBeDefined();
    });

    it('should throw error when completing an already completed todo', () => {
      const todo = Todo.create({
        title: 'Test Todo',
        status: 'pending',
      });

      todo.complete();

      expect(() => todo.complete()).toThrow('Todo is already completed');
    });
  });
});
```

### ユースケースのテスト

```typescript
describe('CreateTodoUseCase', () => {
  let mockTodoRepository: jest.Mocked<TodoRepository>;
  let useCase: CreateTodoUseCase;

  beforeEach(() => {
    mockTodoRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      transaction: jest.fn(),
    };
    useCase = new CreateTodoUseCase(mockTodoRepository);
  });

  it('should create and save a new todo', async () => {
    const input = {
      title: 'Test Todo',
      description: 'Test Description',
    };

    const result = await useCase.execute(input);

    expect(result.title).toBe(input.title);
    expect(result.description).toBe(input.description);
    expect(mockTodoRepository.save).toHaveBeenCalledWith(expect.any(Todo));
  });
});
```

## テストカバレッジ目標

- エンティティ: 100%
- ユースケース: 100%
- 統合テスト: 主要なフロー（ハッピーパス）のカバー

## テスト実行環境

- テストフレームワーク: Vitest
- モック: Vitest組み込みのモック機能
- カバレッジツール: v8

## CI/CD統合

- プルリクエスト時にすべてのテストを実行
- カバレッジレポートの生成と保存
- テストが失敗した場合はマージをブロック 