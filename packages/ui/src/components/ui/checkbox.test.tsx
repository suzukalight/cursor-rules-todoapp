import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('デフォルトでは未チェック状態', () => {
    render(<Checkbox />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white');
    expect(button).not.toHaveClass('bg-green-600');
  });

  it('チェック状態の場合は緑色の背景が表示される', () => {
    render(<Checkbox checked />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-green-600');
  });

  it('チェック状態の場合はチェックマークが表示される', () => {
    render(<Checkbox checked />);
    expect(screen.getByTitle('チェックマーク')).toBeInTheDocument();
  });

  it('クリックするとonCheckedChangeが呼ばれる', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByRole('button'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('チェック状態でクリックするとonCheckedChangeがfalseで呼ばれる', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox checked onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByRole('button'));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });
});
