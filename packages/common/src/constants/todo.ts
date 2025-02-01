import type { TodoStatus } from '../types/todo';

export const TODO_STATUS: Record<TodoStatus, TodoStatus> = {
  pending: 'pending',
  completed: 'completed',
} as const;

export const TODO_STATUS_LABEL: Record<TodoStatus, string> = {
  pending: '未完了',
  completed: '完了',
} as const;
