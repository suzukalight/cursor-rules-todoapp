import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

describe('Dialog', () => {
  // TODO: Most tests are temporarily disabled due to Radix UI's Presence component issues
  // See docs/testing/dialog.md for more details

  it('renders trigger button correctly', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole('button')).toHaveTextContent('Open Dialog');
  });

  it('opens and closes dialog on click', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    // Initially dialog should be closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Open dialog
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });

    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Check dialog content
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog Description')).toBeInTheDocument();

    // Close dialog
    await act(async () => {
      await user.keyboard('{Escape}');
    });

    // Wait for dialog to disappear
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('handles custom close action', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const handleClose = () => {
      onOpenChange(false);
    };

    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <Button onClick={handleClose} data-testid="custom-close">
            Custom Close
          </Button>
        </DialogContent>
      </Dialog>,
    );

    // Dialog should be open initially
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close dialog using custom button
    await act(async () => {
      await user.click(screen.getByTestId('custom-close'));
    });

    // Wait for onOpenChange to be called
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('traps focus within dialog', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </DialogContent>
      </Dialog>,
    );

    // Open dialog
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Check focus trap
    await act(async () => {
      await user.tab();
      await user.tab();
      await user.tab();
      await user.tab(); // Should cycle back to first focusable element
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    });
  });
}); 