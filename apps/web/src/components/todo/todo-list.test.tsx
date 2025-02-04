import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { Todo } from '@cursor-rules-todoapp/common';
import { describe, expect, it, vi } from 'vitest';
import { TodoList } from './todo-list';

describe('TodoListコンポーネント', () => {
  const mockHandlers = {
    onUpdateStatus: vi.fn(),
    onUpdatePriority: vi.fn(),
    onUpdateDueDate: vi.fn(),
    onCreateTodo: vi.fn(),
  };

  const mockTodos: Todo[] = [
    {
      id: '1',
      title: 'テストタスク1',
      status: 'pending',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'テストタスク2',
      status: 'completed',
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it('タスクリストが正しく表示される', () => {
    render(<TodoList todos={mockTodos} viewMode="list" {...mockHandlers} />);
    expect(screen.getByText('テストタスク1')).toBeInTheDocument();
    expect(screen.getByText('テストタスク2')).toBeInTheDocument();
  });

  it('タスクが空の場合、メッセージが表示される', () => {
    render(<TodoList todos={[]} viewMode="list" {...mockHandlers} />);
    expect(screen.getByText('TODOがありません')).toBeInTheDocument();
  });

  it('タスクの状態を切り替えることができる', () => {
    render(<TodoList todos={mockTodos} viewMode="list" {...mockHandlers} />);
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    expect(mockHandlers.onUpdateStatus).toHaveBeenCalledWith('1', 'completed');
  });

  it('タスクの優先度を変更できる', () => {
    render(<TodoList todos={mockTodos} viewMode="list" {...mockHandlers} />);
    const priorityButton = screen.getAllByRole('button', { name: /優先度/i })[0];
    fireEvent.click(priorityButton);
    const highPriorityOption = screen.getByText('高');
    fireEvent.click(highPriorityOption);
    expect(mockHandlers.onUpdatePriority).toHaveBeenCalledWith('1', 'high');
  });

  it('タスクの期限を変更できる', () => {
    render(<TodoList todos={mockTodos} viewMode="list" {...mockHandlers} />);
    const dateButton = screen.getAllByRole('button', { name: /期限/i })[0];
    fireEvent.click(dateButton);
    const today = new Date();
    const dateInput = screen.getByRole('textbox', { name: /期限/i });
    fireEvent.change(dateInput, { target: { value: today.toISOString().split('T')[0] } });
    expect(mockHandlers.onUpdateDueDate).toHaveBeenCalledWith('1', today);
  });

  it('各Todoカードが正しく表示される', () => {
    render(<TodoList todos={mockTodos} viewMode="list" {...mockHandlers} />);
    const todoCards = screen.getAllByTestId('todo-item');
    expect(todoCards).toHaveLength(2);
  });
});
