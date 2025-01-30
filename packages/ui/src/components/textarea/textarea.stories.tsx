import type { Meta, StoryObj } from '@storybook/react';

import { Textarea } from './textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'This is a multiline\ntext content.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled textarea',
  },
};

export const WithRows: Story = {
  args: {
    rows: 6,
    placeholder: 'Textarea with 6 rows',
  },
};
