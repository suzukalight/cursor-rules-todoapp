import type { TodoPriority } from '@cursor-rules-todoapp/common';
import { format, isPast, parseISO, startOfDay, setHours } from 'date-fns';
import { ja } from 'date-fns/locale';
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

/**
 * 日付を正規化する（その日の0時0分0秒に設定）
 * @param date 正規化する日付
 * @returns 正規化された日付
 */
const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

/**
 * 表示用の日付フォーマット（YYYY/MM/DD）
 */
const formatDateForDisplay = (date: Date | null): string | null => {
  if (!date) return null;
  const normalized = normalizeDate(date);
  return format(normalized, 'yyyy/MM/dd', { locale: ja });
};

/**
 * 入力用の日付フォーマット（YYYY-MM-DD）
 */
const formatDateForInput = (date: Date | null): string => {
  if (!date) return '';
  const normalized = normalizeDate(date);
  return format(normalized, 'yyyy-MM-dd', { locale: ja });
};

/**
 * 入力された日付文字列をパースする
 */
const parseDateFromInput = (value: string): Date | null => {
  if (!value) return null;

  try {
    // YYYY-MM-DD形式の文字列をパース
    const [year, month, day] = value.split('-').map(Number);
    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
      console.error('Invalid date format:', value);
      return null;
    }

    // 日付の妥当性チェック
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      console.error('Invalid date:', value);
      return null;
    }

    return normalizeDate(date);
  } catch (error) {
    console.error('Failed to parse date:', value, error);
    return null;
  }
};

/**
 * 期限切れかどうかを判定する
 */
const isDateOverdue = (date: Date | null, completed: boolean): boolean => {
  if (!date || completed) return false;
  const today = normalizeDate(new Date());
  const normalized = normalizeDate(date);
  return normalized < today;
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
    const parsedDate = parseDateFromInput(newValue);
    if (onDueDateChange) {
      onDueDateChange(parsedDate);
    }
  };

  const handleBlur = () => {
    handleDueDateChange(inputValue);
    setEditingDueDate(false);
  };

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
              className={`${isOverdue ? 'text-red-500' : 'text-gray-500'}`}
            >
              {formattedDate ? formattedDate : <span className="opacity-50">期限なし</span>}
            </button>
            {editingDueDate && (
              <input
                type="date"
                value={inputValue}
                onChange={(e) => handleDueDateChange(e.target.value)}
                onBlur={handleBlur}
                ref={dateInputRef}
                className="border border-gray-300 rounded text-sm ml-2 px-2 py-1"
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
