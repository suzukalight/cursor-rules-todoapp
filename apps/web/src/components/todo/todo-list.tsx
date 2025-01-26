import type { Todo, TodoStatus } from '@cursor-rules-todoapp/common';
import { TodoCard } from './todo-card';

interface TodoListProps {
  todos: Todo[];
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateStatus: (id: string, status: TodoStatus) => void;
}

export const TodoList = ({ todos, onUpdateTitle, onUpdateStatus }: TodoListProps) => {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
      {todos.map((todo) => (
        <li key={todo.id} className="grid-item">
          <TodoCard
            todo={todo}
            onUpdateTitle={onUpdateTitle}
            onUpdateStatus={onUpdateStatus}
          />
        </li>
      ))}
    </ul>
  );
}; 