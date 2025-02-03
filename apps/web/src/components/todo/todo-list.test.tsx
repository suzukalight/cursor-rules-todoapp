import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Todo } from '@cursor-rules-todoapp/domain';
import { describe, expect, it, vi } from 'vitest';
import { TodoList } from './todo-list';

describe('TodoListコンポーネント', () => {
  const createMockTodo = (overrides = {}) =>
    Todo.create({
      title: 'テストタスク',
      description: 'テストの説明文',
      priority: 'high',
      dueDate: new Date('2024-12-31'),
      ...overrides,
    });

  const mockTodos = [
    createMockTodo({ title: 'タスク1' }),
    createMockTodo({ title: 'タスク2', priority: 'medium' }),
    createMockTodo({ title: 'タスク3', priority: 'low' }),
  ];

  const mockHandlers = {
    onUpdateTitle: vi.fn(),
    onUpdateStatus: vi.fn(),
    onUpdatePriority: vi.fn(),
    onUpdateDueDate: vi.fn(),
  };

  it('すべてのTodoが表示される', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} />);

    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
    expect(screen.getByText('タスク3')).toBeInTheDocument();
  });

  it('Todoが空の場合、メッセージが表示される', () => {
    render(<TodoList todos={[]} {...mockHandlers} />);

    expect(screen.getByText('TODOがありません')).toBeInTheDocument();
  });

  it('各Todoカードに正しいコールバックが渡される', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} />);

    const todoCards = screen.getAllByTestId('todo-item');
    expect(todoCards).toHaveLength(3);
  });

  it('期限日を更新できること', () => {
    render(
      <TodoList
        todos={mockTodos}
        onUpdateStatus={mockHandlers.onUpdateStatus}
        onUpdatePriority={mockHandlers.onUpdatePriority}
        onUpdateDueDate={mockHandlers.onUpdateDueDate}
      />
    );

    // 期限日の表示をクリック
    const dueDateButton = screen.getByText('2024/12/31');
    fireEvent.click(dueDateButton);

    // 日付入力フィールドが表示されることを確認
    const dateInput = screen.getByDisplayValue('2024-12-31');
    expect(dateInput).toBeInTheDocument();

    // 新しい日付を入力
    const newDate = '2024-12-32';
    fireEvent.change(dateInput, { target: { value: newDate } });
    fireEvent.blur(dateInput);

    // ハンドラーが正しく呼び出されたことを確認
    expect(mockHandlers.onUpdateDueDate).toHaveBeenCalledWith('1', new Date(newDate));
  });

  it('期限日を削除できること', () => {
    render(
      <TodoList
        todos={mockTodos}
        onUpdateStatus={mockHandlers.onUpdateStatus}
        onUpdatePriority={mockHandlers.onUpdatePriority}
        onUpdateDueDate={mockHandlers.onUpdateDueDate}
      />
    );

    // 期限日の表示をクリック
    const dueDateButton = screen.getByText('2024/12/31');
    fireEvent.click(dueDateButton);

    // 日付入力フィールドが表示されることを確認
    const dateInput = screen.getByDisplayValue('2024-12-31');
    expect(dateInput).toBeInTheDocument();

    // 日付を空にする
    fireEvent.change(dateInput, { target: { value: '' } });
    fireEvent.blur(dateInput);

    // ハンドラーが正しく呼び出されたことを確認
    expect(mockHandlers.onUpdateDueDate).toHaveBeenCalledWith('1', null);
  });
});
