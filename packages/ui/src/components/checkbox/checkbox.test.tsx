import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('正しくレンダリングされる', () => {
    render(<Checkbox label="利用規約に同意する" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('利用規約に同意する')).toBeInTheDocument();
  });

  it('チェック状態を制御できる', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="チェックする" />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
    await act(async () => {
      await user.click(checkbox);
    });
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });

  it('制御コンポーネントとして動作する', async () => {
    const { rerender } = render(<Checkbox checked />);
    await waitFor(() => {
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    await act(async () => {
      rerender(<Checkbox checked={false} />);
    });
    await waitFor(() => {
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  it('不確定状態を処理できる', async () => {
    render(<Checkbox checked="indeterminate" />);
    const checkbox = screen.getByRole('checkbox');
    await waitFor(() => {
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
    });
  });

  it('無効化できる', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('キーボード操作に対応している', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="キーボードテスト" />);
    const checkbox = screen.getByRole('checkbox');

    await act(async () => {
      await user.tab();
    });
    expect(checkbox).toHaveFocus();

    await act(async () => {
      await user.keyboard('[Space]');
    });
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });

  it('変更イベントを処理できる', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox onCheckedChange={handleChange} />);

    await act(async () => {
      await user.click(screen.getByRole('checkbox'));
    });
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });
});
