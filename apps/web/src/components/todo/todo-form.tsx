'use client';

import { Button } from '@cursor-rules-todoapp/ui';
import { useState } from 'react';
import { trpc } from '../../utils/api';

export function TodoForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createTodoMutation = trpc.todo.create.useMutation({
    onSuccess: () => {
      setTitle('');
      setDescription('');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTodoMutation.mutateAsync({
        title,
        description,
      });
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          説明
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <Button type="submit">作成</Button>
    </form>
  );
}
