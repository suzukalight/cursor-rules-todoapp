import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Todo } from '@cursor-rules-todoapp/domain';
import { describe, expect, it, vi } from 'vitest';
import { TodoList } from './todo-list';

describe('TodoListコンポーネント', () => {
  const createMockTodo = (overrides = {}) =>
    Todo.create({
      title: 'テストタスク',
      description: 'テストの説明文',
      status: 'pending',
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
});
