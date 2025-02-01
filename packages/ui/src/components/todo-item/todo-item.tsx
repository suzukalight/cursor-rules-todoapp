import type { TodoPriority } from '@cursor-rules-todoapp/common';
import type { ReactNode } from 'react';
import { Checkbox } from '../ui/checkbox';
import { PrioritySelect } from '../ui/priority-select';

export interface TodoItemProps {
  title: string;
  completed?: boolean;
  time?: string;
  hasAlarm?: boolean;
  tag?: string;
  priority: TodoPriority;
  onToggle?: () => void;
  onPriorityChange?: (priority: TodoPriority) => void;
}

export const TodoItem = ({
  title,
  completed = false,
  time,
  hasAlarm,
  tag,
  priority,
  onToggle,
  onPriorityChange,
}: TodoItemProps) => {
  return (
    <div className="flex items-center gap-3 py-2 animate-slide-in">
      <Checkbox checked={completed} onCheckedChange={onToggle} />

      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`transition-all duration-200 ${
              completed ? 'text-gray-400 line-through' : ''
            }`}
          >
            {title}
          </span>
          {time && (
            <span className="text-sm text-green-600 transition-opacity duration-200">{time}</span>
          )}
          {hasAlarm && <span className="text-gray-400 transition-opacity duration-200">⏰</span>}
        </div>

        <div className="flex items-center gap-2">
          {tag && (
            <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-600 transition-all duration-200">
              {tag}
            </span>
          )}
          <PrioritySelect value={priority} onValueChange={(value) => onPriorityChange?.(value)} />
        </div>
      </div>
    </div>
  );
};
