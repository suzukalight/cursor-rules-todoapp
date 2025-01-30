import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './input';

describe('Input', () => {
  it('正しくレンダリングされる', () => {
    render(<Input placeholder="テキストを入力" />);
    expect(screen.getByPlaceholderText('テキストを入力')).toBeInTheDocument();
  });

  it('テキスト入力を処理できる', async () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'こんにちは、世界！');
    expect(input).toHaveValue('こんにちは、世界！');
  });

  it('カスタムクラス名を適用できる', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('異なる入力タイプを処理できる', () => {
    const { container } = render(<Input type="password" />);
    const input = container.querySelector('input[type="password"]');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('無効化できる', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('変更イベントを処理できる', async () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'あ');
    expect(handleChange).toHaveBeenCalled();
  });
});
