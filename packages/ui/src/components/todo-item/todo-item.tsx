import type { TodoPriority } from '@cursor-rules-todoapp/common';
import {
  formatDateForDisplay,
  formatDateForInput,
  isDateOverdue,
  parseDateString,
} from '@cursor-rules-todoapp/common/src/date/date-utils';
import { Bell, Repeat } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';

const priorityLabels: Record<TodoPriority, string> = {
  low: '低',
  medium: '中',
  high: '高',
};

const priorityColors: Record<TodoPriority, string> = {
  low: 'text-blue-600',
  medium: 'text-yellow-600',
  high: 'text-red-600',
};

export interface TodoItemProps {
  title: string;
  completed?: boolean;
  isRecurring?: boolean;
  date?: Date;
  hasAlarm?: boolean;
  tag?: {
    name: string;
    color: string;
  };
  priority: TodoPriority;
  onToggle?: () => void;
  onPriorityChange?: (priority: TodoPriority) => void;
  onDueDateChange?: (date: Date | null) => void;
}

export const TodoItem = ({
  title,
  completed = false,
  isRecurring = false,
  date,
  hasAlarm = false,
  tag,
  priority,
  onToggle,
  onPriorityChange,
  onDueDateChange,
}: TodoItemProps) => {
  const [editingDueDate, setEditingDueDate] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingDueDate && dateInputRef.current) {
      dateInputRef.current.focus();
      setInputValue(formatDateForInput(date || null));
    }
  }, [editingDueDate, date]);

  const formattedDate = formatDateForDisplay(date || null);
  const isOverdue = isDateOverdue(date || null, completed);

  const handleDueDateChange = (newValue: string) => {
    setInputValue(newValue);
    if (newValue === '') {
      if (onDueDateChange) {
        onDueDateChange(null);
      }
      return;
    }

    try {
      const parsedDate = parseDateString(newValue);
      if (parsedDate === null) {
        console.error('Invalid date format:', newValue);
        return;
      }
      if (onDueDateChange) {
        onDueDateChange(parsedDate);
      }
    } catch {
      console.error('Invalid date format:', newValue);
    }
  };

  const handleBlur = () => {
    handleDueDateChange(inputValue);
    setEditingDueDate(false);
  };

  return (
    <div className="flex flex-col gap-1 py-2 animate-slide-in" data-testid="todo-item">
      {/* 上段：チェックボックスとタイトル */}
      <div className="flex items-center gap-2">
        <Checkbox checked={completed} onCheckedChange={onToggle} />
        <span
          className={`transition-all duration-200 ${
            completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {title}
        </span>
      </div>

      {/* 下段：期限とタグ */}
      <div className="flex items-center justify-between pl-8">
        <div className="flex items-center gap-4">
          {/* 期限 */}
          <div className="flex items-center gap-1 text-sm">
            {editingDueDate ? (
              <input
                ref={dateInputRef}
                type="date"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleBlur}
                className="w-32 px-1 py-0.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                aria-label="期限"
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingDueDate(true)}
                className={`text-gray-500 ${isOverdue ? 'text-red-500' : ''}`}
              >
                {formattedDate}
              </button>
            )}
            {hasAlarm && <Bell data-testid="bell-icon" className="h-4 w-4 text-gray-400" />}
            {isRecurring && <Repeat data-testid="repeat-icon" className="h-4 w-4 text-gray-400" />}
          </div>

          {/* タグ */}
          {tag && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-opacity-10">
              <span className={tag.color}>{tag.name}</span>
            </span>
          )}
        </div>

        {/* 優先度 */}
        <div className="flex items-center gap-4">
          <Select value={priority} onValueChange={onPriorityChange}>
            <SelectTrigger className="h-auto border-0 bg-transparent p-0 hover:bg-gray-100 hover:text-gray-900 [&>svg]:hidden">
              <span className={`text-xs ${priorityColors[priority]}`}>
                {priorityLabels[priority]}
              </span>
            </SelectTrigger>
            <SelectContent align="start" sideOffset={4}>
              <SelectItem value="high" className="text-red-600">
                高
              </SelectItem>
              <SelectItem value="medium" className="text-yellow-600">
                中
              </SelectItem>
              <SelectItem value="low" className="text-blue-600">
                低
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
