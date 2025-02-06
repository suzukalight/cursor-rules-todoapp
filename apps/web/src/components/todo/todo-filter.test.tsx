import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  it('ステータスフィルターが正しく動作する', async () => {
    render(<TodoFilter {...defaultProps} />);

    const statusSelect = screen.getByTestId('status-filter');
    fireEvent.click(statusSelect);

    await waitFor(() => {
      const pendingOption = screen.getByText('未着手');
      fireEvent.click(pendingOption);
    });

    expect(mockOnStatusChange).toHaveBeenCalledWith('pending');
  });

  it('優先度フィルターが正しく動作する', async () => {
    render(<TodoFilter {...defaultProps} />);

    const priorityFilter = screen.getByTestId('priority-filter');
    fireEvent.click(priorityFilter);

    await waitFor(() => {
      const highOption = screen.getByText('高');
      fireEvent.click(highOption);
    });

    expect(mockOnPriorityChange).toHaveBeenCalledWith('high');
  });

  it('表示モードの切り替えが正しく動作する', async () => {
    render(<TodoFilter {...defaultProps} />);

    const viewModeSelect = screen.getByRole('combobox', { name: /表示/i });
    fireEvent.click(viewModeSelect);

    await waitFor(() => {
      const groupedOption = screen.getByText('期限別');
      fireEvent.click(groupedOption);
    });

    expect(mockOnViewModeChange).toHaveBeenCalledWith('grouped');
  });
});
