import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { Label } from './label';

describe('Label', () => {
  it('renders correctly', () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('shows required mark when required prop is true', () => {
    render(<Label required>Required Field</Label>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Label className="custom-class">Custom Label</Label>);
    expect(screen.getByText('Custom Label')).toHaveClass('custom-class');
  });

  it('associates with form element using htmlFor', () => {
    render(
      <>
        <Label htmlFor="test-input">Label Text</Label>
        <input id="test-input" />
      </>
    );
    const label = screen.getByText('Label Text');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('handles disabled state through peer styling', () => {
    render(
      <div>
        <Label>Disabled Label</Label>
        <input disabled />
      </div>
    );
    const label = screen.getByText('Disabled Label');
    expect(label).toHaveClass('peer-disabled:opacity-70');
  });
}); 