import type { TodoPriority } from '@cursor-rules-todoapp/common';
import type { ReactNode } from 'react';
import { format, isPast } from 'date-fns';
import { Repeat, Bell } from 'lucide-react';
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
}: TodoItemProps) => {
  const formattedDate = date ? format(date, 'M/d') : null;
  const formattedTime = date ? format(date, 'HH:mm') : null;
  const isOverdue = date ? isPast(date) && !completed : false;

  return (
    <div className="flex flex-col gap-1 py-2 animate-slide-in">
      {/* 上段：チェックボックスとタイトル */}
      <div className="flex items-center gap-2">
        <Checkbox checked={completed} onCheckedChange={onToggle} />
        <span
          className={`transition-all duration-200 ${
            completed ? 'text-gray-400 line-through' : ''
          }`}
        >
          {title}
        </span>
      </div>

      {/* 下段：メタ情報 */}
      <div className="flex items-center justify-between pl-8">
        <div className="flex items-center gap-4">
          {/* スケジュール情報 */}
          {(isRecurring || date) && (
            <div className="flex items-center gap-1 text-sm">
              {isRecurring && (
                <Repeat className="h-4 w-4 text-gray-400" data-testid="repeat-icon" />
              )}
              {date && (
                <span
                  className={`${
                    isOverdue ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  {formattedDate} {formattedTime}
                </span>
              )}
            </div>
          )}

          {/* アラーム */}
          {hasAlarm && (
            <Bell className="h-4 w-4 text-gray-400" data-testid="bell-icon" />
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* タグ */}
          {tag && (
            <div className="flex items-center text-xs whitespace-nowrap">
              <span
                className="px-1 py-0.5"
                style={{ color: tag.color }}
              >
                #
              </span>
              <span className="text-gray-600 truncate max-w-[8em]">
                {tag.name}
              </span>
            </div>
          )}

          {/* 優先度 */}
          <Select value={priority} onValueChange={onPriorityChange}>
            <SelectTrigger className="h-auto border-0 bg-transparent p-0 hover:bg-gray-100 hover:text-gray-900 [&>svg]:hidden">
              <span className={`text-xs ${priorityColors[priority]}`}>
                {priorityLabels[priority]}
              </span>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(priorityLabels).map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className={`text-xs ${priorityColors[value as TodoPriority]}`}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
