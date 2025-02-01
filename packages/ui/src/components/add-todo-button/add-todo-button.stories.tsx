import type { Meta, StoryObj } from '@storybook/react';
import { AddTodoButton } from './add-todo-button';

const meta = {
  title: 'Features/AddTodoButton',
  component: AddTodoButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AddTodoButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithOnClick: Story = {
  args: {
    onClick: () => alert('タスクを追加ボタンがクリックされました'),
  },
}; 