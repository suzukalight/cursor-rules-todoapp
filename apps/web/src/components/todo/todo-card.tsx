import type { Todo, TodoStatus } from '@cursor-rules-todoapp/domain';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Input,
} from '@cursor-rules-todoapp/ui';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Check, ChevronDown, ChevronUp, Edit2, X } from 'lucide-react';
import { useState } from 'react';

interface TodoCardProps {
  todo: Todo;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateStatus: (id: string, status: TodoStatus) => void;
}

export const TodoCard = ({ todo, onUpdateTitle, onUpdateStatus }: TodoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSubmitTitle = () => {
    onUpdateTitle(todo.id, editTitle);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmitTitle();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(todo.title);
    }
  };

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  } as const;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1 mr-2">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSubmitTitle}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{todo.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColor[todo.status]
          }`}
        >
          {todo.status}
        </span>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-gray-500">
          作成日: {format(todo.createdAt, 'yyyy年MM月dd日 HH:mm', { locale: ja })}
        </div>
        {todo.description && (
          <div className="mt-2">
            <Button
              variant="ghost"
              className="p-0 h-6"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1" />
              )}
              説明を{isExpanded ? '閉じる' : '表示'}
            </Button>
            {isExpanded && <p className="mt-2 text-sm">{todo.description}</p>}
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-end gap-2">
        {todo.status === 'pending' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus(todo.id, 'cancelled')}
            >
              <X className="h-4 w-4 mr-1" />
              キャンセル
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onUpdateStatus(todo.id, 'completed')}
            >
              <Check className="h-4 w-4 mr-1" />
              完了
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}; 