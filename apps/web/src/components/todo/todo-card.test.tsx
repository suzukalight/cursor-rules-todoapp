import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { Todo } from '@cursor-rules-todoapp/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TodoCard } from './todo-card';

describe('TodoCardコンポーネント', () => {
  const createMockTodo = (overrides = {}): Todo => ({
    id: 'test-id',
    title: 'テストタスク',
    description: 'テストの説明文',
    priority: 'high',
    status: 'pending',
    dueDate: new Date('2024-12-31'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  });

  const mockTodo = createMockTodo();
  const mockOnUpdateTitle = vi.fn();
  const mockOnUpdateStatus = vi.fn();
  const mockOnUpdatePriority = vi.fn();
  const mockOnUpdateDueDate = vi.fn();

  const defaultProps = {
    todo: mockTodo,
    onUpdateTitle: mockOnUpdateTitle,
    onUpdateStatus: mockOnUpdateStatus,
    onUpdatePriority: mockOnUpdatePriority,
    onUpdateDueDate: mockOnUpdateDueDate,
    'data-testid': 'todo-card',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('タイトルと説明文が正しく表示される', () => {
    render(<TodoCard {...defaultProps} />);

    expect(screen.getByText('テストタスク')).toBeInTheDocument();
    expect(screen.getByText('テストの説明文')).toBeInTheDocument();
  });

  it('期限日が正しく表示される', () => {
    render(<TodoCard {...defaultProps} />);

    const dateButton = screen.getByText('2024/12/31');
    expect(dateButton).toBeInTheDocument();
  });

  describe('期限切れの表示', () => {
    it('未完了で期限切れの場合、警告が表示される', () => {
      const pastDueTodo = createMockTodo({
        dueDate: new Date('2024-01-01'),
        status: 'pending',
      });

      render(<TodoCard {...defaultProps} todo={pastDueTodo} />);

      expect(screen.getByText('期限切れ')).toBeInTheDocument();
      const card = screen.getByTestId('todo-card');
      expect(card.firstElementChild).toHaveClass('border-red-300', 'dark:border-red-700');
    });

    it('完了済みで期限切れの場合、警告は表示されない', () => {
      const completedPastDueTodo = createMockTodo({
        dueDate: new Date('2024-01-01'),
        status: 'completed',
      });

      render(<TodoCard {...defaultProps} todo={completedPastDueTodo} />);

      expect(screen.queryByText('期限切れ')).not.toBeInTheDocument();
      const card = screen.getByTestId('todo-card');
      expect(card.firstElementChild).not.toHaveClass('border-red-300', 'dark:border-red-700');
    });
  });

  it('タイトルを編集できる', async () => {
    render(<TodoCard {...defaultProps} />);

    const titleButton = screen.getByRole('button', { name: /タスク「テストタスク」を編集/ });
    fireEvent.click(titleButton);

    const input = screen.getByRole('textbox', { name: 'タスクのタイトルを編集' });
    fireEvent.change(input, { target: { value: '更新されたタスク' } });
    fireEvent.submit(input);

    expect(mockOnUpdateTitle).toHaveBeenCalledWith(mockTodo.id, '更新されたタスク');
  });

  it('優先度を変更できる', async () => {
    render(<TodoCard {...defaultProps} />);

    const priorityButton = screen.getByRole('combobox');
    fireEvent.click(priorityButton);

    await waitFor(() => {
      const mediumOption = screen.getByRole('option', { name: /中/ });
      fireEvent.click(mediumOption);
    });

    expect(mockOnUpdatePriority).toHaveBeenCalledWith(mockTodo.id, 'medium');
  });

  it('ステータスを変更できる', async () => {
    render(<TodoCard {...defaultProps} />);

    const statusButton = screen.getByRole('button', { name: 'タスクを完了にする' });
    fireEvent.click(statusButton);

    expect(mockOnUpdateStatus).toHaveBeenCalledWith(mockTodo.id, 'completed');
  });

  it('完了済みのタスクを未完了に戻せる', async () => {
    const completedTodo = createMockTodo({ status: 'completed' });
    render(<TodoCard {...defaultProps} todo={completedTodo} />);

    const statusButton = screen.getByRole('button', { name: 'タスクを未完了に戻す' });
    fireEvent.click(statusButton);

    expect(mockOnUpdateStatus).toHaveBeenCalledWith(mockTodo.id, 'pending');
  });

  it('完了済みのタスクは打ち消し線で表示される', () => {
    const completedTodo = createMockTodo({ status: 'completed' });
    render(<TodoCard {...defaultProps} todo={completedTodo} />);

    const title = screen.getByRole('button', { name: /タスク「テストタスク」を編集/ });
    const description = screen.getByText('テストの説明文');

    expect(title).toHaveClass('line-through', 'text-gray-500', 'dark:text-gray-400');
    expect(description).toHaveClass('line-through');
  });
});
