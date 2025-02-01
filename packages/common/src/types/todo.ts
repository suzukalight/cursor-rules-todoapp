export type TodoId = string;
export type TodoStatus = 'pending' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: TodoId;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTodoInput = Pick<Todo, 'title' | 'description'> &
  Partial<Pick<Todo, 'priority' | 'dueDate'>>;
export type UpdateTodoInput = Partial<
  Pick<Todo, 'title' | 'description' | 'status' | 'priority' | 'dueDate'>
>;
