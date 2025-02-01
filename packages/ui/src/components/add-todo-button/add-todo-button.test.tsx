import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AddTodoButton } from './add-todo-button';

describe('AddTodoButton', () => {
  it('「タスクを追加」というテキストが表示される', () => {
    render(<AddTodoButton />);
    expect(screen.getByText('タスクを追加')).toBeInTheDocument();
  });

  it('プラス記号が表示される', () => {
    render(<AddTodoButton />);
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('クリックするとonClickが呼ばれる', async () => {
    const onClick = vi.fn();
    render(<AddTodoButton onClick={onClick} />);

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
