import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TodoFilter } from './todo-filter';

describe('TodoFilterコンポーネント', () => {
  const mockOnStatusChange = vi.fn();
  const mockOnSearchQueryChange = vi.fn();
  const mockOnSortByChange = vi.fn();

  const defaultProps = {
    status: 'all' as const,
    onStatusChange: mockOnStatusChange,
    searchQuery: '',
    onSearchQueryChange: mockOnSearchQueryChange,
    sortBy: 'createdAt' as const,
    onSortByChange: mockOnSortByChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('検索フィールドが正しく動作する', () => {
    render(<TodoFilter {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('タスクを検索...');
    fireEvent.change(searchInput, { target: { value: 'テスト' } });

    expect(mockOnSearchQueryChange).toHaveBeenCalledWith('テスト');
  });

  it('ステータスフィルターが正しく動作する', () => {
    render(<TodoFilter {...defaultProps} />);

    const statusSelect = screen.getByRole('combobox', { name: /ステータス/i });
    fireEvent.click(statusSelect);

    const pendingOption = screen.getByRole('option', { name: '未完了' });
    fireEvent.click(pendingOption);

    expect(mockOnStatusChange).toHaveBeenCalledWith('pending');
  });

  it('並び替えが正しく動作する', () => {
    render(<TodoFilter {...defaultProps} />);

    const sortSelect = screen.getByRole('combobox', { name: /並び替え/i });
    fireEvent.click(sortSelect);

    const updatedAtOption = screen.getByRole('option', { name: '更新日' });
    fireEvent.click(updatedAtOption);

    expect(mockOnSortByChange).toHaveBeenCalledWith('updatedAt');
  });
});
