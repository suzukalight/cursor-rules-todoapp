import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TodoFilter } from './todo-filter';

describe('TodoFilterコンポーネント', () => {
  const mockOnStatusChange = vi.fn();
  const mockOnSearchQueryChange = vi.fn();
  const mockOnPriorityChange = vi.fn();
  const mockOnViewModeChange = vi.fn();

  const defaultProps = {
    status: 'all' as const,
    onStatusChange: mockOnStatusChange,
    priority: 'all' as const,
    onPriorityChange: mockOnPriorityChange,
    searchQuery: '',
    onSearchQueryChange: mockOnSearchQueryChange,
    viewMode: 'list' as const,
    onViewModeChange: mockOnViewModeChange,
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

    const pendingOption = screen.getByRole('option', { name: '未着手' });
    fireEvent.click(pendingOption);

    expect(mockOnStatusChange).toHaveBeenCalledWith('pending');
  });

  it('優先度フィルターが正しく動作する', () => {
    render(<TodoFilter {...defaultProps} />);

    const prioritySelect = screen.getByRole('combobox', { name: /優先度/i });
    fireEvent.click(prioritySelect);

    // 高優先度を選択
    const highOption = screen.getByRole('option', { name: '高' });
    fireEvent.click(highOption);
    expect(mockOnPriorityChange).toHaveBeenCalledWith('high');

    // 中優先度を選択
    fireEvent.click(prioritySelect);
    const mediumOption = screen.getByRole('option', { name: '中' });
    fireEvent.click(mediumOption);
    expect(mockOnPriorityChange).toHaveBeenCalledWith('medium');

    // 低優先度を選択
    fireEvent.click(prioritySelect);
    const lowOption = screen.getByRole('option', { name: '低' });
    fireEvent.click(lowOption);
    expect(mockOnPriorityChange).toHaveBeenCalledWith('low');

    // すべてを選択
    fireEvent.click(prioritySelect);
    const allOption = screen.getByRole('option', { name: 'すべて' });
    fireEvent.click(allOption);
    expect(mockOnPriorityChange).toHaveBeenCalledWith('all');
  });

  it('表示モードの切り替えが正しく動作する', () => {
    render(<TodoFilter {...defaultProps} />);

    const viewModeSelect = screen.getByRole('combobox', { name: /表示/i });
    fireEvent.click(viewModeSelect);

    const groupedOption = screen.getByRole('option', { name: '期限日でグループ化' });
    fireEvent.click(groupedOption);

    expect(mockOnViewModeChange).toHaveBeenCalledWith('grouped');
  });
});
