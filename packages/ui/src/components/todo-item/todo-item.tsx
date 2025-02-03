import type { TodoPriority } from '@cursor-rules-todoapp/common';
import { format, isPast } from 'date-fns';
import { Bell, Repeat } from 'lucide-react';
import type { ReactNode } from 'react';
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
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingDueDate && dateInputRef.current) {
      dateInputRef.current.focus();
    }
  }, [editingDueDate]);

  const formattedDate = date ? format(date, 'yyyy/MM/dd') : null;
  const isOverdue = date ? isPast(date) && !completed : false;

  return (
    <div className="flex flex-col gap-1 py-2 animate-slide-in">
      {/* 上段：チェックボックスとタイトル */}
      <div className="flex items-center gap-2">
        <Checkbox checked={completed} onCheckedChange={onToggle} />
        <span
          className={`transition-all duration-200 ${completed ? 'text-gray-400 line-through' : ''}`}
        >
          {title}
        </span>
      </div>

      {/* 下段：メタ情報 */}
      <div className="flex items-center justify-between pl-8">
        <div className="flex items-center gap-4">
          {/* スケジュール情報 */}
          <div className="flex items-center gap-1 text-sm">
            {isRecurring && <Repeat className="h-4 w-4 text-gray-400" data-testid="repeat-icon" />}
            <button
              type="button"
              onClick={() => setEditingDueDate(true)}
              className={`${date && isOverdue ? 'text-red-500' : 'text-gray-500'}`}
            >
              {date ? formattedDate : <span className="opacity-50">期限なし</span>}
            </button>
            {editingDueDate && (
              <input
                type="date"
                value={date ? format(date, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!newValue) {
                    onDueDateChange?.(null);
                    return;
                  }
                  try {
                    // 日付文字列を年月日に分解して新しいDateオブジェクトを作成
                    const [year, month, day] = newValue.split('-').map(Number);
                    const newDate = new Date(year, month - 1, day, 0, 0, 0, 0);
                    // 日付が有効かチェック
                    if (Number.isNaN(newDate.getTime())) {
                      console.error('Invalid date:', newValue);
                      return;
                    }
                    onDueDateChange?.(newDate);
                  } catch (error) {
                    console.error('Error parsing date:', error);
                  }
                }}
                onBlur={() => setEditingDueDate(false)}
                ref={dateInputRef}
                className="border border-gray-300 rounded text-sm ml-2"
              />
            )}
          </div>

          {/* アラーム */}
          {hasAlarm && <Bell className="h-4 w-4 text-gray-400" data-testid="bell-icon" />}
        </div>

        <div className="flex items-center gap-4">
          {/* タグ */}
          {tag && (
            <div className="flex items-center text-xs whitespace-nowrap">
              <span className="px-1 py-0.5" style={{ color: tag.color }}>
                #
              </span>
              <span className="text-gray-600 truncate max-w-[8em]">{tag.name}</span>
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
