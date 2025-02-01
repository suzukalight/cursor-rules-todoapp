export type TodoPriority = 'high' | 'medium' | 'low';

export type TodoStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type CreateTodoInput = Pick<Todo, 'title' | 'description'> &
  Partial<Pick<Todo, 'priority' | 'dueDate'>>;
export type UpdateTodoInput = Partial<
  Pick<Todo, 'title' | 'description' | 'status' | 'priority' | 'dueDate'>
>;
