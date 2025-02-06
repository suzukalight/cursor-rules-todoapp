import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { trpc } from '../../utils/api';
import { TodoForm } from './todo-form';

vi.mock('../../utils/api', () => ({
  trpc: {
    todo: {
      create: {
        useMutation: vi.fn(),
      },
    },
  },
}));

const mockMutation = {
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  isLoading: false,
  isSuccess: false,
  isError: false,
  isIdle: true,
  status: 'idle',
  data: undefined,
  error: null,
  reset: vi.fn(),
  context: undefined,
  failureCount: 0,
  failureReason: null,
  isPaused: false,
  variables: undefined,
  trpc: { path: 'todo.create' },
};

describe('TodoForm', () => {
  it('フォームを表示できる', () => {
    // @ts-expect-error: tRPCの型定義の問題を後で修正
    vi.mocked(trpc.todo.create.useMutation).mockReturnValue(mockMutation);

    render(<TodoForm />);

    expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '作成' })).toBeInTheDocument();
  });

  it('フォームを送信できる', async () => {
    const mockMutateAsync = vi.fn();
    // @ts-expect-error: tRPCの型定義の問題を後で修正
    vi.mocked(trpc.todo.create.useMutation).mockReturnValue({
      ...mockMutation,
      mutateAsync: mockMutateAsync,
    });

    render(<TodoForm />);

    const titleInput = screen.getByLabelText('タイトル') as HTMLInputElement;
    const descriptionInput = screen.getByLabelText('説明') as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: '作成' });

    fireEvent.change(titleInput, { target: { value: 'テストTodo' } });
    fireEvent.change(descriptionInput, { target: { value: 'テストの説明' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        title: 'テストTodo',
        description: 'テストの説明',
      });
    });
  });

  it('送信中は送信ボタンを無効化する', () => {
    // @ts-expect-error: tRPCの型定義の問題を後で修正
    vi.mocked(trpc.todo.create.useMutation).mockReturnValue({
      ...mockMutation,
      isLoading: true,
    });

    render(<TodoForm />);

    const submitButton = screen.getByRole('button', { name: '作成中...' });
    expect(submitButton).toBeDisabled();
  });
});
