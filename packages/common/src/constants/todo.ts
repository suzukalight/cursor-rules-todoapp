import type { TodoStatus } from '../types/todo';

export const TODO_STATUS: Record<TodoStatus, TodoStatus> = {
  pending: 'pending',
  'in-progress': 'in-progress',
  completed: 'completed',
  cancelled: 'cancelled',
} as const;

export const TODO_STATUS_LABEL: Record<TodoStatus, string> = {
  pending: '未着手',
  'in-progress': '進行中',
  completed: '完了',
  cancelled: 'キャンセル',
} as const;
