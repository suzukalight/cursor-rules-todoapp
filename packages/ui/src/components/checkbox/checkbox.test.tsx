import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders correctly', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('handles check state', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Check me" />);
    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).not.toBeChecked();
    await act(async () => {
      await user.click(checkbox);
    });
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });

  it('can be controlled', async () => {
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

  it('handles indeterminate state', async () => {
    render(<Checkbox checked="indeterminate" />);
    const checkbox = screen.getByRole('checkbox');
    await waitFor(() => {
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
    });
  });

  it('can be disabled', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('handles keyboard interaction', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Keyboard test" />);
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

  it('handles onChange events', async () => {
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