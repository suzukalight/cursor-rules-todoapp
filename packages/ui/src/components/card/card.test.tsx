import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { Card, CardContent, CardFooter, CardHeader } from './card';

describe('Card', () => {
  it('renders card with content', () => {
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

  it('applies custom className to Card', () => {
    render(<Card className="custom-class">Content</Card>);
    const card = screen.getByText('Content');
    expect(card).toHaveClass('custom-class');
  });

  it('applies custom className to CardHeader', () => {
    render(<CardHeader className="custom-header">Header</CardHeader>);
    const header = screen.getByText('Header').closest('div');
    expect(header).toHaveClass('custom-header');
  });

  it('applies custom className to CardContent', () => {
    render(<CardContent className="custom-content">Content</CardContent>);
    const content = screen.getByText('Content');
    expect(content).toHaveClass('custom-content');
  });

  it('applies custom className to CardFooter', () => {
    render(<CardFooter className="custom-footer">Footer</CardFooter>);
    const footer = screen.getByText('Footer');
    expect(footer).toHaveClass('custom-footer');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders nested content correctly', () => {
    render(
      <Card>
        <CardHeader>
          <h2>Title</h2>
          <p>Subtitle</p>
        </CardHeader>
        <CardContent>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </CardContent>
        <CardFooter>
          <button type="button">Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
}); 