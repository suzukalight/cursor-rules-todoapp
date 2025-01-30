import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Todo } from '@cursor-rules-todoapp/domain';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TodoCard } from './todo-card';

describe('TodoCardコンポーネント', () => {
  const mockTodo = Todo.create({
    title: 'テストタスク',
    description: 'テストの説明文',
    status: 'pending',
  });

  const mockOnUpdateTitle = vi.fn();
  const mockOnUpdateStatus = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('タイトルと説明文が正しく表示される', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onUpdateTitle={mockOnUpdateTitle}
        onUpdateStatus={mockOnUpdateStatus}
      />
    );

    expect(screen.getByText('テストタスク')).toBeInTheDocument();
    expect(screen.getByText('説明を表示')).toBeInTheDocument();
  });

  it('タイトルを編集できる', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onUpdateTitle={mockOnUpdateTitle}
        onUpdateStatus={mockOnUpdateStatus}
      />
    );

    // 編集ボタンをクリック
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // 入力フィールドが表示される
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('テストタスク');

    // 新しいタイトルを入力
    fireEvent.change(input, { target: { value: '更新されたタスク' } });
    fireEvent.blur(input);

    // onUpdateTitleが呼ばれる
    expect(mockOnUpdateTitle).toHaveBeenCalledWith(mockTodo.id, '更新されたタスク');
  });

  it('説明文を表示/非表示できる', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onUpdateTitle={mockOnUpdateTitle}
        onUpdateStatus={mockOnUpdateStatus}
      />
    );

    // 初期状態では説明文は非表示
    expect(screen.queryByText('テストの説明文')).not.toBeInTheDocument();

    // 説明を表示ボタンをクリック
    const toggleButton = screen.getByText('説明を表示');
    fireEvent.click(toggleButton);

    // 説明文が表示される
    expect(screen.getByText('テストの説明文')).toBeInTheDocument();

    // もう一度クリックで非表示
    fireEvent.click(screen.getByText('説明を閉じる'));
    expect(screen.queryByText('テストの説明文')).not.toBeInTheDocument();
  });

  it('ステータスを更新できる', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onUpdateTitle={mockOnUpdateTitle}
        onUpdateStatus={mockOnUpdateStatus}
      />
    );

    // 完了ボタンをクリック
    const completeButton = screen.getByText('完了');
    fireEvent.click(completeButton);
    expect(mockOnUpdateStatus).toHaveBeenCalledWith(mockTodo.id, 'completed');

    // キャンセルボタンをクリック
    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);
    expect(mockOnUpdateStatus).toHaveBeenCalledWith(mockTodo.id, 'cancelled');
  });
});
