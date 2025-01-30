import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Todo } from '@cursor-rules-todoapp/domain';
import { describe, expect, it, vi } from 'vitest';
import { TodoList } from './todo-list';

describe('TodoListコンポーネント', () => {
  const mockTodos = [
    Todo.create({
      title: 'タスク1',
      description: '説明1',
      status: 'pending',
    }),
    Todo.create({
      title: 'タスク2',
      description: '説明2',
      status: 'completed',
    }),
    Todo.create({
      title: 'タスク3',
      description: '説明3',
      status: 'cancelled',
    }),
  ];

  const mockOnUpdateTitle = vi.fn();
  const mockOnUpdateStatus = vi.fn();

  it('すべてのTodoが表示される', () => {
    render(
      <TodoList
        todos={mockTodos}
        onUpdateTitle={mockOnUpdateTitle}
        onUpdateStatus={mockOnUpdateStatus}
      />
    );

    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
    expect(screen.getByText('タスク3')).toBeInTheDocument();
  });

  it('空のTodoリストが表示される', () => {
    render(
      <TodoList todos={[]} onUpdateTitle={mockOnUpdateTitle} onUpdateStatus={mockOnUpdateStatus} />
    );

    const grid = screen.getByRole('generic');
    expect(grid).toBeEmptyDOMElement();
  });
});
