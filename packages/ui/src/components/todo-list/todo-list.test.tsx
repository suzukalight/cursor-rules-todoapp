import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TodoList } from './todo-list';

describe('TodoList', () => {
  it('デフォルトのタイトル「今日」が表示される', () => {
    render(<TodoList>テストコンテンツ</TodoList>);
    expect(screen.getByText('今日')).toBeInTheDocument();
  });

  it('カスタムタイトルが表示される', () => {
    render(<TodoList title="明日">テストコンテンツ</TodoList>);
    expect(screen.getByText('明日')).toBeInTheDocument();
  });

  it('マイプロジェクトセクションが表示される', () => {
    render(<TodoList>テストコンテンツ</TodoList>);
    expect(screen.getByText('マイプロジェクト')).toBeInTheDocument();
  });

  it('子要素が表示される', () => {
    render(<TodoList>テストコンテンツ</TodoList>);
    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument();
  });
}); 