import type { Meta, StoryObj } from '@storybook/react';
import { addHours, subHours } from 'date-fns';
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

const now = new Date();
const pastDate = subHours(now, 2);
const futureDate = addHours(now, 2);

export const Default: Story = {
  args: {
    title: 'タスクのタイトル',
    date: futureDate,
    tag: {
      name: 'タグ',
      color: '#3b82f6',
    },
    priority: 'medium',
  },
};

export const WithAlarm: Story = {
  args: {
    title: 'アラーム付きタスク',
    date: futureDate,
    hasAlarm: true,
    tag: {
      name: 'アラーム',
      color: '#ef4444',
    },
    priority: 'high',
  },
};

export const WithRecurring: Story = {
  args: {
    title: '繰り返しタスク',
    date: futureDate,
    isRecurring: true,
    tag: {
      name: '定期',
      color: '#10b981',
    },
    priority: 'medium',
  },
};

export const Overdue: Story = {
  args: {
    title: '期限切れタスク',
    date: pastDate,
    tag: {
      name: '期限切れ',
      color: '#f59e0b',
    },
    priority: 'high',
  },
};

export const Simple: Story = {
  args: {
    title: 'シンプルなタスク',
    priority: 'low',
  },
};

export const Completed: Story = {
  args: {
    title: '完了したタスク',
    completed: true,
    date: pastDate,
    tag: {
      name: '完了',
      color: '#6b7280',
    },
    priority: 'medium',
  },
};
