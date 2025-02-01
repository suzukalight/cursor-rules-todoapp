import type { Meta, StoryObj } from '@storybook/react';
import { TodoItem } from './todo-item';

const meta = {
  title: 'Components/TodoItem',
  component: TodoItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TodoItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'タスクのタイトル',
    time: '12:00',
    tag: 'タグ',
    priority: 'medium',
  },
};

export const WithAlarm: Story = {
  args: {
    title: 'アラーム付きタスク',
    time: '15:00',
    hasAlarm: true,
    tag: 'アラーム',
    priority: 'high',
  },
};

export const Simple: Story = {
  args: {
    title: 'シンプルなタスク',
    priority: 'low',
  },
};

export const WithTag: Story = {
  args: {
    title: 'タグ付きタスク',
    time: '18:00',
    tag: 'タグ付き',
    priority: 'medium',
  },
};
