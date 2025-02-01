import type { Todo, TodoPriority, TodoStatus } from '@cursor-rules-todoapp/common';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cursor-rules-todoapp/ui';
import { cn } from '@cursor-rules-todoapp/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Calendar, Check, Flag, X } from 'lucide-react';
import { useState } from 'react';
import { DatePicker } from '../date/date-picker';

const MotionButton = motion.create(Button);

const priorityColors: Record<TodoPriority, string> = {
  high: 'text-red-500 dark:text-red-400',
  medium: 'text-yellow-500 dark:text-yellow-400',
  low: 'text-blue-500 dark:text-blue-400',
};

const priorityLabels: Record<TodoPriority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

interface TodoCardProps {
  todo: Todo;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateStatus: (id: string, status: TodoStatus) => void;
  onUpdatePriority: (id: string, priority: TodoPriority) => void;
  onUpdateDueDate: (id: string, dueDate: Date | undefined) => void;
  'data-testid'?: string;
}

export const TodoCard = ({
  todo,
  onUpdateTitle,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateDueDate,
  'data-testid': testId,
}: TodoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [isEditingDueDate, setIsEditingDueDate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTitle(todo.id, title);
    setIsEditing(false);
  };

  const isCompleted = todo.status === 'completed';
  const isPastDue = todo.dueDate && new Date() > todo.dueDate && !isCompleted;

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const handlePriorityChange = (priority: TodoPriority) => {
    onUpdatePriority(todo.id, priority);
  };

  const handleDueDateChange = (date: Date | undefined) => {
    onUpdateDueDate(todo.id, date);
    setIsEditingDueDate(false);
  };

  return (
    <div data-testid={testId}>
      <Card
        className={cn(
          'rounded-lg transition-colors duration-200',
          isCompleted && 'bg-gray-50 dark:bg-gray-800/50',
          isPastDue && 'border-red-300 dark:border-red-700'
        )}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Select value={todo.priority} onValueChange={handlePriorityChange}>
                <SelectTrigger className="w-auto border-none p-0">
                  <Flag
                    className={cn('h-4 w-4', priorityColors[todo.priority])}
                    aria-label={`優先度: ${priorityLabels[todo.priority]}`}
                  />
                </SelectTrigger>
                <SelectContent align="start" className="w-24">
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value} className="flex items-center gap-2">
                      <Flag className={cn('h-4 w-4', priorityColors[value as TodoPriority])} />
                      <span>{label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <h3 className="text-lg font-semibold">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800"
                      onFocus={(e) => e.target.select()}
                      aria-label="タスクのタイトルを編集"
                    />
                  </form>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    onKeyDown={(e) => handleKeyDown(e, () => setIsEditing(true))}
                    className={cn(
                      'w-full text-left hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm p-1',
                      isCompleted && 'line-through text-gray-500 dark:text-gray-400'
                    )}
                    aria-label={`タスク「${todo.title}」を編集`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {todo.title}
                  </motion.button>
                )}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Popover open={isEditingDueDate} onOpenChange={setIsEditingDueDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn('h-auto p-0', isPastDue && 'text-red-500 dark:text-red-400')}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '期限日を設定'}
                    </span>
                    {isPastDue && (
                      <span className="ml-2 inline-flex items-center">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="ml-1">期限切れ</span>
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePicker
                    selected={todo.dueDate ? new Date(todo.dueDate) : undefined}
                    onSelect={handleDueDateChange}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>

        {todo.description && (
          <CardContent>
            <p className={cn('text-gray-600 dark:text-gray-400', isCompleted && 'line-through')}>
              {todo.description}
            </p>
          </CardContent>
        )}

        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <MotionButton
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus(todo.id, isCompleted ? 'pending' : 'completed')}
              whileTap={{ scale: 0.95 }}
              aria-label={isCompleted ? 'タスクを未完了に戻す' : 'タスクを完了にする'}
            >
              {isCompleted ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </MotionButton>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
