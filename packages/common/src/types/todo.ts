export type TodoStatus = 'pending' | 'in-progress' | 'completed';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type CreateTodoInput = Pick<Todo, 'title' | 'description'>;
export type UpdateTodoInput = Partial<Pick<Todo, 'title' | 'description' | 'status'>>; 