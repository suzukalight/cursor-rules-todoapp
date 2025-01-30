import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Textarea } from './textarea';

describe('Textarea', () => {
  it('正しくレンダリングされる', () => {
    render(<Textarea placeholder="テキストを入力" />);
    expect(screen.getByPlaceholderText('テキストを入力')).toBeInTheDocument();
  });

  it('テキスト入力を処理できる', async () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'こんにちは、世界！');
    expect(textarea).toHaveValue('こんにちは、世界！');
  });

  it('複数行のテキストを処理できる', async () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, '1行目{enter}2行目');
    expect(textarea).toHaveValue('1行目\n2行目');
  });

  it('カスタムクラス名を適用できる', () => {
    render(<Textarea className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('無効化できる', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('変更イベントを処理できる', async () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'あ');
    expect(handleChange).toHaveBeenCalled();
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
