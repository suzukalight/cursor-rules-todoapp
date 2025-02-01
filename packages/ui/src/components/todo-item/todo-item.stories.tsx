import type { Meta, StoryObj } from '@storybook/react';
import { TodoItem } from './todo-item';

const meta = {
  title: 'Features/TodoItem',
  component: TodoItem,
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'タスクのタイトル',
  },
} satisfies Meta<typeof TodoItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'ヨガ 30分 🧘',
    time: '7:30',
    tag: 'フィットネス',
  },
};

export const Completed: Story = {
  args: {
    ...Default.args,
    completed: true,
  },
};

export const WithAlarm: Story = {
  args: {
    title: '歯科の予約',
    time: '10:00',
    hasAlarm: true,
    tag: '予約',
  },
};

export const WithoutTimeAndTag: Story = {
  args: {
    title: 'パンを買う 🥖',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'とても長いタスクのタイトルです。これは複数行になる可能性があります。',
    time: '15:00',
    tag: 'テスト',
  },
};
