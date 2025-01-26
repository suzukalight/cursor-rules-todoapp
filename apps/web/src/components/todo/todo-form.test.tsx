import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { api } from '../../utils/api';
import { TodoForm } from './todo-form';

describe('TodoForm', () => {
  it('フォームを表示できる', () => {
    render(<TodoForm />);
    
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
    expect(screen.getByText('Todoを作成')).toBeInTheDocument();
  });

  it('フォームを送信できる', async () => {
    const mockMutate = vi.fn();
    vi.spyOn(api.todo.create, 'useMutation').mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });

    render(<TodoForm />);
    
    const titleInput = screen.getByLabelText('タイトル') as HTMLInputElement;
    const descriptionInput = screen.getByLabelText('説明') as HTMLTextAreaElement;
    const submitButton = screen.getByText('Todoを作成');

    fireEvent.change(titleInput, { target: { value: 'テストTodo' } });
    fireEvent.change(descriptionInput, { target: { value: 'テストの説明' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        title: 'テストTodo',
        description: 'テストの説明',
      });
    });
  });

  it('送信後にフォームをリセットする', async () => {
    const onSuccess = vi.fn();
    let mutationCallback: () => void = () => {};
    
    vi.spyOn(api.todo.create, 'useMutation').mockImplementation(({ onSuccess: callback }: { onSuccess: () => void }) => {
      mutationCallback = callback;
      return {
        mutate: vi.fn(),
        isLoading: false,
      };
    });

    render(<TodoForm onSuccess={onSuccess} />);
    
    const titleInput = screen.getByLabelText('タイトル') as HTMLInputElement;
    const descriptionInput = screen.getByLabelText('説明') as HTMLTextAreaElement;

    fireEvent.change(titleInput, { target: { value: 'テストTodo' } });
    fireEvent.change(descriptionInput, { target: { value: 'テストの説明' } });

    mutationCallback();

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('送信中は送信ボタンを無効化する', () => {
    vi.spyOn(api.todo.create, 'useMutation').mockReturnValue({
      mutate: vi.fn(),
      isLoading: true,
    });

    render(<TodoForm />);
    
    const submitButton = screen.getByText('作成中...');
    expect(submitButton).toBeDisabled();
  });
}); 