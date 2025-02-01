import type { Meta, StoryObj } from '@storybook/react';
import { TodoList } from './todo-list';
import { TodoItem } from '../todo-item';

const meta = {
  title: 'Features/TodoList',
  component: TodoList,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <TodoItem title="ヨガ 30分分 🧘" time="7:30" tag="フィットネス" />
        <TodoItem title="歯科の予約" time="10:00" hasAlarm tag="予約" />
        <TodoItem title="パンを買う 🥖" tag="買い物リスト" />
      </>
    ),
  },
};

export const WithCustomTitle: Story = {
  args: {
    title: '明日',
    children: (
      <>
        <TodoItem title="ミーティング" time="13:00" hasAlarm tag="仕事" />
        <TodoItem title="ジムに行く" time="18:00" tag="フィットネス" />
      </>
    ),
  },
};

export const Empty: Story = {
  args: {
    children: null,
  },
}; 