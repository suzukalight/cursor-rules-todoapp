import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Todo } from '@cursor-rules-todoapp/domain';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TodoCard } from './todo-card';

describe('TodoCardコンポーネント', () => {
  const createMockTodo = (overrides = {}) =>
    Todo.create({
      title: 'テストタスク',
      description: 'テストの説明文',
      priority: 'high',
      dueDate: new Date('2024-12-31'),
      ...overrides,
    });

  const mockTodo = createMockTodo();
  const mockOnUpdateTitle = vi.fn();
  const mockOnUpdateStatus = vi.fn();
  const mockOnUpdatePriority = vi.fn();
  const mockOnUpdateDueDate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('タイトルと説明文が正しく表示される', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onUpdateTitle={mockOnUpdateTitle}
        onUpdateStatus={mockOnUpdateStatus}
        onUpdatePriority={mockOnUpdatePriority}
        onUpdateDueDate={mockOnUpdateDueDate}
      />
    );

    expect(screen.getByText('テストタスク')).toBeInTheDocument();
    expect(screen.getByText('テストの説明文')).toBeInTheDocument();
  });

  it('優先度が正しく表示される', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onUpdateTitle={mockOnUpdateTitle}
        onUpdateStatus={mockOnUpdateStatus}
        onUpdatePriority={mockOnUpdatePriority}
        onUpdateDueDate={mockOnUpdateDueDate}
      />
    );

    const priorityIcon = screen.getByLabelText('優先度: 高');
    expect(priorityIcon).toBeInTheDocument();
    expect(priorityIcon).toHaveClass('text-red-500');
  });

  it('期限日が正しく表示される', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onUpdateTitle={mockOnUpdateTitle}
        onUpdateStatus={mockOnUpdateStatus}
        onUpdatePriority={mockOnUpdatePriority}
        onUpdateDueDate={mockOnUpdateDueDate}
      />
    );

    expect(screen.getByText('2024/12/31')).toBeInTheDocument();
  });

  it('期限切れの場合、警告が表示される', () => {
    const pastDueTodo = createMockTodo({
      dueDate: new Date('2024-01-01'),
    });

    render(
      <TodoCard
        todo={pastDueTodo}
        onUpdateTitle={mockOnUpdateTitle}
        onUpdateStatus={mockOnUpdateStatus}
        onUpdatePriority={mockOnUpdatePriority}
        onUpdateDueDate={mockOnUpdateDueDate}
      />
    );

    expect(screen.getByText('期限切れ')).toBeInTheDocument();
  });

  it('タイトルを編集できる', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onUpdateTitle={mockOnUpdateTitle}
        onUpdateStatus={mockOnUpdateStatus}
        onUpdatePriority={mockOnUpdatePriority}
        onUpdateDueDate={mockOnUpdateDueDate}
      />
    );

    const titleButton = screen.getByRole('button', { name: /タスク「テストタスク」を編集/ });
    fireEvent.click(titleButton);

    const input = screen.getByRole('textbox', { name: 'タスクのタイトルを編集' });
    fireEvent.change(input, { target: { value: '更新されたタスク' } });
    fireEvent.submit(input);

    expect(mockOnUpdateTitle).toHaveBeenCalledWith(mockTodo.id, '更新されたタスク');
  });

  it('優先度を変更できる', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onUpdateTitle={mockOnUpdateTitle}
        onUpdateStatus={mockOnUpdateStatus}
        onUpdatePriority={mockOnUpdatePriority}
        onUpdateDueDate={mockOnUpdateDueDate}
      />
    );

    const priorityButton = screen.getByLabelText('優先度: 高');
    fireEvent.click(priorityButton);

    const mediumOption = screen.getByRole('option', { name: '中' });
    fireEvent.click(mediumOption);

    expect(mockOnUpdatePriority).toHaveBeenCalledWith(mockTodo.id, 'medium');
  });

  it('期限日を変更できる', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onUpdateTitle={mockOnUpdateTitle}
        onUpdateStatus={mockOnUpdateStatus}
        onUpdatePriority={mockOnUpdatePriority}
        onUpdateDueDate={mockOnUpdateDueDate}
      />
    );

    const dateButton = screen.getByText('2024/12/31');
    fireEvent.click(dateButton);

    const newDate = new Date('2025-01-01');
    const dateCell = screen.getByRole('gridcell', { name: '2025-01-01' });
    fireEvent.click(dateCell);

    expect(mockOnUpdateDueDate).toHaveBeenCalledWith(mockTodo.id, newDate);
  });

  it('ステータスを更新できる', () => {
    render(
      <TodoCard
        todo={mockTodo}
        onUpdateTitle={mockOnUpdateTitle}
        onUpdateStatus={mockOnUpdateStatus}
        onUpdatePriority={mockOnUpdatePriority}
        onUpdateDueDate={mockOnUpdateDueDate}
      />
    );

    const completeButton = screen.getByLabelText('タスクを完了にする');
    fireEvent.click(completeButton);
    expect(mockOnUpdateStatus).toHaveBeenCalledWith(mockTodo.id, 'completed');

    const inProgressButton = screen.getByLabelText('タスクを進行中にする');
    fireEvent.click(inProgressButton);
    expect(mockOnUpdateStatus).toHaveBeenCalledWith(mockTodo.id, 'in-progress');
  });
});
