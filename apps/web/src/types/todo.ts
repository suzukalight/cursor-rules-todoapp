import type { Todo } from '@cursor-rules-todoapp/common';

export interface TodoResponse {
  props: {
    id: string;
    title: string;
    description?: string;
    status: Todo['status'];
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
  };
}

export type TodoListResponse = TodoResponse[];
