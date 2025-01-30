import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button/button';
import { Toast, ToastDescription, ToastProvider, ToastTitle } from './toast';
import { useToast } from './use-toast';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoToast() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast({
          title: 'Scheduled: Catch up',
          description: 'Friday, February 10, 2024 at 5:57 PM',
        })
      }
    >
      Show Toast
    </Button>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <DemoToast />
    </ToastProvider>
  ),
};

export const Success: Story = {
  render: () => (
    <ToastProvider>
      <Toast variant="success">
        <ToastTitle>Successfully saved!</ToastTitle>
        <ToastDescription>Your changes have been saved successfully.</ToastDescription>
      </Toast>
    </ToastProvider>
  ),
};

export const ErrorToast: Story = {
  render: () => (
    <ToastProvider>
      <Toast variant="error">
        <ToastTitle>Error occurred</ToastTitle>
        <ToastDescription>There was a problem with your request.</ToastDescription>
      </Toast>
    </ToastProvider>
  ),
};

export const Warning: Story = {
  render: () => (
    <ToastProvider>
      <Toast variant="warning">
        <ToastTitle>Warning</ToastTitle>
        <ToastDescription>Your session is about to expire.</ToastDescription>
      </Toast>
    </ToastProvider>
  ),
};

export const Info: Story = {
  render: () => (
    <ToastProvider>
      <Toast variant="info">
        <ToastTitle>Information</ToastTitle>
        <ToastDescription>A new version is available.</ToastDescription>
      </Toast>
    </ToastProvider>
  ),
};
