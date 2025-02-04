import type { Todo, TodoPriority, TodoStatus } from '@cursor-rules-todoapp/common';
import { AddTodoButton, TodoItem, TodoList as UITodoList } from '@cursor-rules-todoapp/ui';
import { AnimatePresence, motion } from 'framer-motion';
import type { ViewMode } from './todo-filter';
import { type DueDateGroup, GROUP_LABELS, groupTodosByDueDate } from './todo-list.utils';

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
  viewMode: ViewMode;
  onUpdateStatus: (id: string, status: TodoStatus) => void;
  onUpdatePriority: (id: string, priority: TodoPriority) => void;
  onUpdateDueDate: (id: string, dueDate: Date | null) => void;
  onCreateTodo: () => void;
}

export function TodoList({
  todos,
  viewMode,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateDueDate,
  onCreateTodo,
}: TodoListProps) {
  const groupedTodos = groupTodosByDueDate(todos);

  const renderTodoItem = (todo: Todo) => {
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
              date={data.dueDate}
              hasAlarm={!!data.dueDate}
              priority={data.priority}
              onToggle={() =>
                onUpdateStatus(data.id, data.status === 'completed' ? 'pending' : 'completed')
              }
              onPriorityChange={(priority: TodoPriority) => onUpdatePriority(data.id, priority)}
              onDueDateChange={(date: Date | null) => onUpdateDueDate(data.id, date)}
            />
          </motion.div>
        </AnimatePresence>
      </li>
    );
  };

  return (
    <UITodoList>
      <div className="mt-4 w-full" data-testid="todo-list">
        {todos.length === 0 ? (
          <div
            data-testid="empty-todo-message"
            className="text-center text-gray-500 dark:text-gray-400"
          >
            TODOがありません
          </div>
        ) : viewMode === 'grouped' ? (
          Object.entries(groupedTodos).map(([group, groupTodos]) => {
            if (groupTodos.length === 0) return null;
            return (
              <div key={group} className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  {GROUP_LABELS[group as DueDateGroup]}
                </h2>
                <ul className="flex flex-col gap-4 list-none p-0">
                  {groupTodos.map(renderTodoItem)}
                </ul>
              </div>
            );
          })
        ) : (
          <ul className="flex flex-col gap-4 list-none p-0">{todos.map(renderTodoItem)}</ul>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-4"
        >
          <AddTodoButton onClick={onCreateTodo} data-testid="add-todo-button" />
        </motion.div>
      </div>
    </UITodoList>
  );
}
