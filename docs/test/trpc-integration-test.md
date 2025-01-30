# tRPC統合テストガイド

## テストヘルパーの使用方法

### 基本的な使い方

```typescript
describe('Todo API', () => {
  let helper: TRPCTestHelper;

  beforeEach(() => {
    // 通常時はデバッグログを出力しない
    helper = new TRPCTestHelper(app, { debug: false });
  });

  it('Todoを作成して取得できる', async () => {
    // POSTリクエスト
    const createResponse = await helper.post('todo.create', {
      title: 'テストTodo',
      description: 'テストの説明',
    });
    helper.expectSuccess(createResponse);

    // GETリクエスト
    const findResponse = await helper.get('todo.findById', createResponse.data.id);
    helper.expectSuccess(findResponse);
  });

  it('存在しないTodoの取得でエラーになる', async () => {
    const response = await helper.get('todo.findById', 'non-existent-id');
    helper.expectError(response, 404, 'Todo not found');
  });
});
```

### デバッグモードの使用方法

問題が発生したときは、デバッグモードを有効にしてログを確認できます：

```typescript
// デバッグモードを有効にする
helper = new TRPCTestHelper(app, { debug: true });

// リクエストとレスポンスのログが出力される
const response = await helper.post('todo.create', {
  title: 'テストTodo',
  description: 'テストの説明',
});

// ログ出力例
// POST Request: { url: '/trpc/todo.create', body: { title: 'テストTodo', ... } }
// POST Response: { status: 200, text: '{"result":{...}}' }
```

### レスポンスの型定義

```typescript
interface APIResponse<T> {
  status: number;
  data?: T;
  error?: {
    message: string;
    [key: string]: unknown;
  };
}
```

## テストケース一覧

### 正常系テスト

1. Todoの作成
   - 必須項目のみで作成
   - 全項目を指定して作成
   - 作成後のデータ検証

2. Todoの取得
   - IDによる単一取得
   - 全件取得
   - データ形式の検証

3. Todoの更新
   - タイトルの更新
   - 説明の更新
   - ステータスの更新

### エラー系テスト

1. バリデーションエラー
   - 必須項目の欠落
   - 不正な形式のデータ
   - 不正なステータス値

2. 存在チェック
   - 存在しないIDの指定
   - 削除済みデータへのアクセス

3. リクエスト形式
   - 不正なJSONフォーマット
   - 不正なクエリパラメータ

## デバッグ方法

1. ログ出力の確認
   ```typescript
   // リクエストログ
   POST Request: {
     url: '/trpc/todo.create',
     body: { title: 'テストTodo' }
   }

   // レスポンスログ
   POST Response: {
     status: 200,
     text: '{"result":{"data":{"props":{...}}}}'
   }
   ```

2. エラーの切り分け
   - リクエストの形式を確認
   - レスポンスの構造を確認
   - エラーメッセージを分析

## テスト実行方法

```bash
# 全テストの実行
pnpm test

# 特定のテストファイルの実行
pnpm test src/integration-tests/api.test.ts

# ウォッチモードでの実行
pnpm test:watch
``` 