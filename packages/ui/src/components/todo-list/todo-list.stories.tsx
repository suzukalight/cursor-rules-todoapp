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
        <TodoItem
          title="ミーティング"
          date={new Date('2023-10-25')}
          hasAlarm
          tag={{ name: '仕事', color: '#ff0000' }}
          priority="high"
        />
        <TodoItem
          title="ジムに行く"
          date={new Date('2023-10-25')}
          tag={{ name: 'フィットネス', color: '#00ff00' }}
          priority="medium"
        />
      </>
    ),
  },
};

export const WithManyItems: Story = {
  args: {
    children: (
      <>
        <TodoItem
          title="ミーティング"
          date={new Date('2023-10-25')}
          hasAlarm
          tag={{ name: '仕事', color: '#ff0000' }}
          priority="high"
        />
        <TodoItem
          title="ジムに行く"
          date={new Date('2023-10-25')}
          tag={{ name: 'フィットネス', color: '#00ff00' }}
          priority="medium"
        />
        <TodoItem
          title="買い物"
          date={new Date('2023-10-25')}
          tag={{ name: '生活', color: '#0000ff' }}
          priority="low"
        />
        <TodoItem
          title="読書"
          date={new Date('2023-10-25')}
          tag={{ name: '趣味', color: '#ff00ff' }}
          priority="low"
        />
      </>
    ),
  },
};

export const WithCustomTitle: Story = {
  args: {
    title: '明日',
    children: (
      <>
        <TodoItem
          title="ミーティング"
          date={new Date('2023-10-25')}
          hasAlarm
          tag={{ name: '仕事', color: '#ff0000' }}
          priority="high"
        />
        <TodoItem
          title="ジムに行く"
          date={new Date('2023-10-25')}
          tag={{ name: 'フィットネス', color: '#00ff00' }}
          priority="medium"
        />
      </>
    ),
  },
};

export const Empty: Story = {
  args: {
    children: null,
  },
};
