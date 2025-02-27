import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { cn } from '../../lib/utils';
import { Button, buttonVariants } from './button';

describe('Button', () => {
  it('正しくレンダリングされる', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(cn(buttonVariants({ variant: 'default', size: 'default' })));
    expect(button).toHaveTextContent('Click me');
  });

  it('デフォルトのバリアントスタイルが適用される', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(cn(buttonVariants({ variant: 'default' })));
  });

  it('カスタムバリアントスタイルが適用される', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(cn(buttonVariants({ variant: 'secondary' })));
  });

  it('サイズスタイルが適用される', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(cn(buttonVariants({ size: 'lg' })));
  });

  it('クリックイベントを処理できる', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button with ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('asChildがtrueの場合、子コンポーネントとしてレンダリングされる', () => {
    render(
      <Button asChild>
        <a href="/">Link Button</a>
      </Button>
    );
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveClass(cn(buttonVariants()));
  });

  it('アクセシビリティに対応している', () => {
    render(<Button aria-label="アクセシブルなボタン">Click me</Button>);
    const button = screen.getByLabelText('アクセシブルなボタン');
    expect(button).toBeInTheDocument();
  });

  it('無効化できる', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
  });
});
