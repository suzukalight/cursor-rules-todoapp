import type { Todo } from '@cursor-rules-todoapp/common';
import { describe, expect, it } from 'vitest';
import { groupTodosByDueDate } from './todo-list.utils';

describe('groupTodosByDueDate', () => {
  const baseDate = new Date('2024-03-01T00:00:00.000Z');
  const createTodo = (id: string, dueDate?: Date): Todo => ({
    id,
    title: `Todo ${id}`,
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  });

  it('期限なしのタスクを正しくグルーピングすること', () => {
    const todos = [createTodo('1')];
    const result = groupTodosByDueDate(todos);
    expect(result.noDueDate).toHaveLength(1);
    expect(result.noDueDate[0].id).toBe('1');
  });

  it('今日までのタスクを正しくグルーピングすること', () => {
    const today = new Date(baseDate);
    const todos = [createTodo('1', today)];
    const result = groupTodosByDueDate(todos);
    expect(result.today).toHaveLength(1);
    expect(result.today[0].id).toBe('1');
  });

  it('1週間以内のタスクを正しくグルーピングすること', () => {
    const nextWeek = new Date(baseDate);
    nextWeek.setDate(nextWeek.getDate() + 5);
    const todos = [createTodo('1', nextWeek)];
    const result = groupTodosByDueDate(todos);
    expect(result.thisWeek).toHaveLength(1);
    expect(result.thisWeek[0].id).toBe('1');
  });

  it('1ヶ月以内のタスクを正しくグルーピングすること', () => {
    const nextMonth = new Date(baseDate);
    nextMonth.setDate(nextMonth.getDate() + 20);
    const todos = [createTodo('1', nextMonth)];
    const result = groupTodosByDueDate(todos);
    expect(result.thisMonth).toHaveLength(1);
    expect(result.thisMonth[0].id).toBe('1');
  });

  it('それ以降のタスクを正しくグルーピングすること', () => {
    const future = new Date(baseDate);
    future.setMonth(future.getMonth() + 2);
    const todos = [createTodo('1', future)];
    const result = groupTodosByDueDate(todos);
    expect(result.later).toHaveLength(1);
    expect(result.later[0].id).toBe('1');
  });

  it('複数のタスクを正しくグルーピングすること', () => {
    const today = new Date(baseDate);
    const nextWeek = new Date(baseDate);
    nextWeek.setDate(nextWeek.getDate() + 5);
    const nextMonth = new Date(baseDate);
    nextMonth.setDate(nextMonth.getDate() + 20);
    const future = new Date(baseDate);
    future.setMonth(future.getMonth() + 2);

    const todos = [
      createTodo('1', today),
      createTodo('2', nextWeek),
      createTodo('3', nextMonth),
      createTodo('4', future),
      createTodo('5'),
    ];

    const result = groupTodosByDueDate(todos);
    expect(result.today).toHaveLength(1);
    expect(result.thisWeek).toHaveLength(1);
    expect(result.thisMonth).toHaveLength(1);
    expect(result.later).toHaveLength(1);
    expect(result.noDueDate).toHaveLength(1);
  });
});
