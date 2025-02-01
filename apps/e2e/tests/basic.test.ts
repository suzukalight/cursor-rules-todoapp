import { expect, test } from '@playwright/test';

test.describe('基本的なページ表示', () => {
  test.beforeEach(async ({ page }) => {
    // データベースのリセット
    await page.goto('/api/test/reset-db');
    await page.waitForResponse('/api/test/reset-db');
  });

  test('ページタイトルが正しく表示される', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Todo App/, { timeout: 60000 });
  });

  test('新規作成ボタンが表示される', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const button = page.getByTestId('create-todo-button');
    await expect(button).toBeVisible({ timeout: 60000 });
  });

  test('フィルターが表示される', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const filter = page.getByTestId('status-filter');
    await expect(filter).toBeVisible({ timeout: 60000 });
  });

  test('TODOリストが表示される', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const list = page.getByTestId('todo-list');
    await expect(list).toBeVisible({ timeout: 60000 });
  });

  test('初期状態でTODOが空であることが確認できる', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="todo-list"]');
    const emptyMessage = page.getByTestId('empty-todo-message');
    await expect(emptyMessage).toBeVisible({ timeout: 60000 });
  });
});
