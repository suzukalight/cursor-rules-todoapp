'use client';

import { Todo, type TodoStatus } from '@cursor-rules-todoapp/domain';
import { Button } from '@cursor-rules-todoapp/ui';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { TodoFilter } from '../components/todo/todo-filter';
import { TodoList } from '../components/todo/todo-list';

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt'>('createdAt');

  const handleCreateTodo = () => {
    const newTodo = Todo.create({
      title: '新しいタスク',
      description: '',
      status: 'pending',
    });
    setTodos((prev) => [...prev, newTodo]);
  };

  const handleUpdateTitle = (id: string, title: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          todo.updateTitle(title);
          return todo;
        }
        return todo;
      })
    );
  };

  const handleUpdateStatus = (id: string, status: TodoStatus) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          if (status === 'completed') {
            todo.complete();
          } else if (status === 'cancelled') {
            todo.cancel();
          }
          return todo;
        }
        return todo;
      })
    );
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (status === 'all') return true;
      return todo.status === status;
    })
    .filter((todo) => {
      if (!searchQuery) return true;
      return (
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      );
    })
    .sort((a, b) => {
      const dateA = sortBy === 'createdAt' ? a.createdAt : a.updatedAt;
      const dateB = sortBy === 'createdAt' ? b.createdAt : b.updatedAt;
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Todoリスト</h1>
        <Button onClick={handleCreateTodo}>
          <Plus className="h-4 w-4 mr-2" />
          新規作成
        </Button>
      </div>

      <TodoFilter
        status={status}
        onStatusChange={setStatus}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      <div className="mt-8">
        <TodoList
          todos={filteredTodos}
          onUpdateTitle={handleUpdateTitle}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </main>
  );
}
