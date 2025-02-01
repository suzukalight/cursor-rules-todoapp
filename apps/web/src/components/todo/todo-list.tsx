import type { Todo, TodoPriority, TodoStatus } from '@cursor-rules-todoapp/common';
import { AnimatePresence, motion } from 'framer-motion';
import { TodoCard } from './todo-card';

interface TodoData {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface TodoListProps {
  todos: Todo[];
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateStatus: (id: string, status: TodoStatus) => void;
  onUpdatePriority: (id: string, priority: TodoPriority) => void;
  onUpdateDueDate: (id: string, dueDate: Date | undefined) => void;
}

export function TodoList({
  todos,
  onUpdateTitle,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateDueDate,
}: TodoListProps) {
  return (
    <div className="mt-4" data-testid="todo-list">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
        {todos.map((todo) => {
          const rawData = ('props' in todo ? todo.props : todo) as TodoData;
          const data: Todo = {
            id: rawData.id,
            title: rawData.title,
            description: rawData.description,
            status: rawData.status,
            priority: rawData.priority,
            dueDate: rawData.dueDate ? new Date(rawData.dueDate) : undefined,
            createdAt: rawData.createdAt ? new Date(rawData.createdAt) : new Date(),
            updatedAt: rawData.updatedAt ? new Date(rawData.updatedAt) : new Date(),
            completedAt: rawData.completedAt ? new Date(rawData.completedAt) : undefined,
          };
          return (
            <li key={data.id}>
              <AnimatePresence mode="sync">
                <motion.div
                  key={data.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TodoCard
                    todo={data}
                    onUpdateTitle={onUpdateTitle}
                    onUpdateStatus={onUpdateStatus}
                    onUpdatePriority={onUpdatePriority}
                    onUpdateDueDate={onUpdateDueDate}
                    data-testid="todo-item"
                  />
                </motion.div>
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
      {todos.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400">TODOがありません</div>
      )}
    </div>
  );
}
