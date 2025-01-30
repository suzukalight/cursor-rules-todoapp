import { TestDatabase } from '@cursor-rules-todoapp/repo-sqlite';
import { expect, test } from '@playwright/test';

test.describe('TODOアプリのE2Eテスト', () => {
  let testDb: TestDatabase;

  test.beforeAll(async () => {
    await TestDatabase.initialize();
  });

  test.beforeEach(async () => {
    // テストごとに新しいDBを用意
    testDb = new TestDatabase();
    await testDb.setup();

    // テスト用の環境変数を設定
    process.env.DATABASE_URL = testDb.getDatabaseUrl();
  });

  test.afterEach(async () => {
    await testDb.cleanup();
  });

  test('初期表示の確認', async ({ page }) => {
    await page.goto('/');
    
    // ページタイトルの確認
    await expect(page).toHaveTitle('Todo App');
    
    // 新規作成ボタンの存在確認
    const createButton = page.getByRole('button', { name: '作成' });
    await expect(createButton).toBeVisible();
    
    // フィルターの存在確認
    const statusFilterLabel = page.getByText('ステータス');
    await expect(statusFilterLabel).toBeVisible();
    const statusFilter = page.getByRole('combobox', { name: 'ステータス' });
    await expect(statusFilter).toBeVisible();

    // 初期状態ではTODOが空であることを確認
    const todoList = page.getByTestId('todo-list');
    await expect(todoList).toBeVisible();
    const todos = await page.getByTestId('todo-item').all();
    expect(todos).toHaveLength(0);
  });
}); 