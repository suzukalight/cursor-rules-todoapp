import type { Todo, TodoStatus } from '@cursor-rules-todoapp/domain';
import { TodoCard } from './todo-card';

interface TodoListProps {
  todos: Todo[];
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateStatus: (id: string, status: TodoStatus) => void;
}

export const TodoList = ({ todos, onUpdateTitle, onUpdateStatus }: TodoListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onUpdateTitle={onUpdateTitle}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
}; 