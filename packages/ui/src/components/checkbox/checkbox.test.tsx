import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders correctly', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('handles check state', async () => {
    render(<Checkbox label="Check me" />);
    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('can be controlled', () => {
    const { rerender } = render(<Checkbox checked />);
    expect(screen.getByRole('checkbox')).toBeChecked();

    rerender(<Checkbox checked={false} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('handles indeterminate state', () => {
    render(<Checkbox checked="indeterminate" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
  });

  it('can be disabled', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('handles keyboard interaction', async () => {
    render(<Checkbox label="Keyboard test" />);
    const checkbox = screen.getByRole('checkbox');
    
    await userEvent.tab();
    expect(checkbox).toHaveFocus();
    
    await userEvent.keyboard('[Space]');
    expect(checkbox).toBeChecked();
  });

  it('handles onChange events', async () => {
    const handleChange = vi.fn();
    render(<Checkbox onCheckedChange={handleChange} />);
    
    await userEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });
}); 