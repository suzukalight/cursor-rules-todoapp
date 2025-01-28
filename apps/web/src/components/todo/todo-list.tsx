import type { Todo, TodoStatus } from '@cursor-rules-todoapp/common';
import { TodoCard } from './todo-card';

interface TodoListProps {
  todos: Todo[];
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateStatus: (id: string, status: TodoStatus) => void;
}

export function TodoList({ todos, onUpdateTitle, onUpdateStatus }: TodoListProps) {
  return (
    <div data-testid="todo-list" className="mt-8">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
        {todos.map((todo) => (
          <li key={todo.id}>
            <TodoCard
              todo={todo}
              onUpdateTitle={onUpdateTitle}
              onUpdateStatus={onUpdateStatus}
              data-testid="todo-item"
            />
          </li>
        ))}
      </ul>
      {todos.length === 0 && (
        <div className="text-center text-gray-500 min-h-[100px] flex items-center justify-center">
          TODOがありません
        </div>
      )}
    </div>
  );
}
