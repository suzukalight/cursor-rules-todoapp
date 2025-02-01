import type { Meta, StoryObj } from '@storybook/react';
import { TodoItem } from '../todo-item/todo-item';
import { TodoList } from './todo-list';

const meta = {
  title: 'Components/TodoList',
  component: TodoList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <TodoItem title="ミーティング" time="13:00" hasAlarm tag="仕事" priority="high" />
        <TodoItem title="ジムに行く" time="18:00" tag="フィットネス" priority="medium" />
      </>
    ),
  },
};

export const WithManyItems: Story = {
  args: {
    children: (
      <>
        <TodoItem title="ミーティング" time="13:00" hasAlarm tag="仕事" priority="high" />
        <TodoItem title="ジムに行く" time="18:00" tag="フィットネス" priority="medium" />
        <TodoItem title="買い物" time="10:00" tag="生活" priority="low" />
        <TodoItem title="読書" time="20:00" tag="趣味" priority="low" />
      </>
    ),
  },
};

export const WithCustomTitle: Story = {
  args: {
    title: '明日',
    children: (
      <>
        <TodoItem title="ミーティング" time="13:00" hasAlarm tag="仕事" priority="high" />
        <TodoItem title="ジムに行く" time="18:00" tag="フィットネス" priority="medium" />
      </>
    ),
  },
};

export const Empty: Story = {
  args: {
    children: null,
  },
};
