import type { Todo, TodoPriority, TodoStatus } from '@cursor-rules-todoapp/common';
import { TodoItem, TodoList as UITodoList } from '@cursor-rules-todoapp/ui';
import { AnimatePresence, motion } from 'framer-motion';

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
  onUpdateStatus: (id: string, status: TodoStatus) => void;
}

export function TodoList({ todos, onUpdateStatus }: TodoListProps) {
  return (
    <UITodoList>
      <div className="mt-4 w-full" data-testid="todo-list">
        <ul className="flex flex-col gap-4 list-none p-0">
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
                    <TodoItem
                      title={data.title}
                      completed={data.status === 'completed'}
                      time={data.dueDate?.toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      hasAlarm={!!data.dueDate}
                      tag={data.priority}
                      onToggle={() =>
                        onUpdateStatus(
                          data.id,
                          data.status === 'completed' ? 'pending' : 'completed'
                        )
                      }
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
    </UITodoList>
  );
}
