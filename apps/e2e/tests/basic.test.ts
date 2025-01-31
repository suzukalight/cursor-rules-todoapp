import { test, expect } from '@playwright/test';

test.describe('基本的なページ表示', () => {
  test('ページタイトルが正しく表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Todo App/);
  });

  test('新規作成ボタンが表示される', async ({ page }) => {
    await page.goto('/');
    const button = page.getByTestId('create-todo-button');
    await expect(button).toBeVisible();
  });

  test('フィルターが表示される', async ({ page }) => {
    await page.goto('/');
    const filter = page.getByTestId('status-filter');
    await expect(filter).toBeVisible();
  });

  test('TODOリストが表示される', async ({ page }) => {
    await page.goto('/');
    const list = page.getByTestId('todo-list');
    await expect(list).toBeVisible();
  });

  test('初期状態でTODOが空であることが確認できる', async ({ page }) => {
    await page.goto('/');
    const emptyMessage = page.getByText('TODOがありません');
    await expect(emptyMessage).toBeVisible();
  });
}); 