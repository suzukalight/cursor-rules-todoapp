import type { Todo, TodoStatus } from '@cursor-rules-todoapp/common';
import { Button, Card, CardContent, CardFooter, CardHeader } from '@cursor-rules-todoapp/ui';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

interface TodoCardProps {
  todo: Todo;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateStatus: (id: string, status: TodoStatus) => void;
}

export const TodoCard = ({ todo, onUpdateTitle, onUpdateStatus }: TodoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTitle(todo.id, title);
    setIsEditing(false);
  };

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <h3 className="text-lg font-semibold">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-lg"
                onFocus={(e) => e.target.select()}
              />
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full text-left hover:text-blue-600"
            >
              {todo.title}
            </button>
          )}
        </h3>
      </CardHeader>

      {todo.description && (
        <CardContent>
          <p className="text-gray-600">{todo.description}</p>
        </CardContent>
      )}

      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateStatus(todo.id, 'completed')}
            disabled={todo.status === 'completed'}
            className="rounded-lg"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateStatus(todo.id, 'in-progress')}
            disabled={todo.status === 'in-progress'}
            className="rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          {new Date(todo.createdAt).toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
}; 