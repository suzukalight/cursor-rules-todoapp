import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { Card, CardContent, CardFooter, CardHeader } from './card';

describe('Card', () => {
  it('コンテンツ付きのカードをレンダリングできる', () => {
    render(
      <Card>
        <CardHeader>Header Content</CardHeader>
        <CardContent>Main Content</CardContent>
        <CardFooter>Footer Content</CardFooter>
      </Card>
    );

    expect(screen.getByText('Header Content')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('カスタムクラス名をCardに適用できる', () => {
    render(<Card className="custom-class">Content</Card>);
    const card = screen.getByText('Content');
    expect(card).toHaveClass('custom-class');
  });

  it('カスタムクラス名をCardHeaderに適用できる', () => {
    render(<CardHeader className="custom-header">Header</CardHeader>);
    const header = screen.getByText('Header').closest('div');
    expect(header).toHaveClass('custom-header');
  });

  it('カスタムクラス名をCardContentに適用できる', () => {
    render(<CardContent className="custom-content">Content</CardContent>);
    const content = screen.getByText('Content');
    expect(content).toHaveClass('custom-content');
  });

  it('カスタムクラス名をCardFooterに適用できる', () => {
    render(<CardFooter className="custom-footer">Footer</CardFooter>);
    const footer = screen.getByText('Footer');
    expect(footer).toHaveClass('custom-footer');
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('ネストされたコンテンツが正しくレンダリングされる', () => {
    render(
      <Card>
        <CardHeader>
          <h2>タイトル</h2>
          <p>サブタイトル</p>
        </CardHeader>
        <CardContent>
          <p>段落1</p>
          <p>段落2</p>
        </CardContent>
        <CardFooter>
          <button type="button">アクション</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('タイトル')).toBeInTheDocument();
    expect(screen.getByText('サブタイトル')).toBeInTheDocument();
    expect(screen.getByText('段落1')).toBeInTheDocument();
    expect(screen.getByText('段落2')).toBeInTheDocument();
    expect(screen.getByText('アクション')).toBeInTheDocument();
  });
});
