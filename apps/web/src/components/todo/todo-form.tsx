import { Button, Input, Textarea } from '@cursor-rules-todoapp/ui';
import { useState } from 'react';
import { api } from '../../utils/api';

export interface TodoFormProps {
  onSuccess?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createTodo = api.todo.create.useMutation({
    onSuccess: () => {
      setTitle('');
      setDescription('');
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTodo.mutate({ title, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを入力"
          required
          aria-label="タイトル"
        />
      </div>
      <div>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="説明を入力（任意）"
          aria-label="説明"
        />
      </div>
      <div>
        <Button
          type="submit"
          disabled={createTodo.isLoading}
          aria-busy={createTodo.isLoading}
        >
          {createTodo.isLoading ? '作成中...' : 'Todoを作成'}
        </Button>
      </div>
    </form>
  );
}; 