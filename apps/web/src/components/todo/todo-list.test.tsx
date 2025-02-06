import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { Todo } from '@cursor-rules-todoapp/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TodoList } from './todo-list';

describe('TodoListコンポーネント', () => {
  const mockTodos: Todo[] = [
    {
      id: '1',
      title: 'テストタスク1',
      status: 'pending',
      priority: 'medium',
      dueDate: undefined,
      createdAt: new Date('2024-03-01T00:00:00.000Z'),
      updatedAt: new Date('2024-03-01T00:00:00.000Z'),
    },
    {
      id: '2',
      title: 'テストタスク2',
      status: 'completed',
      priority: 'high',
      dueDate: undefined,
      createdAt: new Date('2024-03-01T00:00:00.000Z'),
      updatedAt: new Date('2024-03-01T00:00:00.000Z'),
    },
  ];

  const mockHandlers = {
    onUpdateStatus: vi.fn(),
    onUpdatePriority: vi.fn(),
    onUpdateDueDate: vi.fn(),
    onCreateTodo: vi.fn(),
  };

  const defaultProps = {
    todos: mockTodos,
    viewMode: 'list' as const,
    ...mockHandlers,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('タスクリストが正しく表示される', () => {
    render(<TodoList {...defaultProps} />);
    expect(screen.getByText('テストタスク1')).toBeInTheDocument();
    expect(screen.getByText('テストタスク2')).toBeInTheDocument();
  });

  it('タスクが空の場合、メッセージが表示される', () => {
    render(<TodoList todos={[]} viewMode="list" {...mockHandlers} />);
    expect(screen.getByText('TODOがありません')).toBeInTheDocument();
  });

  it('タスクの状態を切り替えることができる', async () => {
    render(<TodoList {...defaultProps} />);

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    expect(mockHandlers.onUpdateStatus).toHaveBeenCalledWith('1', 'completed');
  });

  it('タスクの優先度を変更できる', async () => {
    render(<TodoList {...defaultProps} />);

    // 優先度のトリガーボタンをクリック
    const priorityTrigger = screen.getAllByRole('combobox')[0];
    fireEvent.click(priorityTrigger);

    // 高優先度を選択
    await waitFor(() => {
      const highPriorityOption = screen.getByRole('option', { name: '高' });
      fireEvent.click(highPriorityOption);
    });

    expect(mockHandlers.onUpdatePriority).toHaveBeenCalledWith('1', 'high');
  });

  it('タスクの期限を変更できる', async () => {
    render(<TodoList {...defaultProps} />);

    // 期限なしボタンをクリック
    const dateButton = screen.getAllByRole('button', { name: /期限なし/ })[0];
    fireEvent.click(dateButton);

    // 日付を入力
    const dateInput = screen.getByLabelText('期限') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2024-03-01' } });
    fireEvent.blur(dateInput);

    expect(mockHandlers.onUpdateDueDate).toHaveBeenCalledWith('1', new Date('2024-03-01'));
  });

  it('グループ表示モードで正しく表示される', () => {
    const todosWithDueDate: Todo[] = [
      {
        id: '1',
        title: '今日のタスク',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date('2024-03-01T00:00:00.000Z'),
        createdAt: new Date('2024-03-01T00:00:00.000Z'),
        updatedAt: new Date('2024-03-01T00:00:00.000Z'),
      },
      {
        id: '2',
        title: '期限なしタスク',
        status: 'pending',
        priority: 'medium',
        dueDate: undefined,
        createdAt: new Date('2024-03-01T00:00:00.000Z'),
        updatedAt: new Date('2024-03-01T00:00:00.000Z'),
      },
    ];

    render(<TodoList todos={todosWithDueDate} viewMode="grouped" {...mockHandlers} />);

    // 各グループのヘッダーが表示されることを確認
    expect(screen.getByRole('heading', { name: '今日' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '期限なし' })).toBeInTheDocument();

    // タスクが正しいグループに表示されることを確認
    expect(screen.getByText('今日のタスク')).toBeInTheDocument();
    expect(screen.getByText('期限なしタスク')).toBeInTheDocument();
  });
});
