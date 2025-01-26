'use client';

import type { Todo, TodoStatus } from '@cursor-rules-todoapp/common';
import { Button } from '@cursor-rules-todoapp/ui';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TodoFilter } from '../components/todo/todo-filter';
import { TodoList } from '../components/todo/todo-list';
import { api } from '../utils/api';

type TodoResponse = {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

const convertDates = (todo: TodoResponse): Todo => ({
  id: todo.id,
  title: todo.title,
  description: todo.description,
  status: todo.status,
  createdAt: new Date(todo.createdAt),
  updatedAt: new Date(todo.updatedAt),
  completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
});

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt'>('createdAt');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await api.todo.findAll.query();
        setTodos(data.map(convertDates));
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      }
    };
    fetchTodos();
  }, []);

  const handleCreateTodo = async () => {
    try {
      const newTodo = await api.todo.create.mutate({
        title: '新しいタスク',
        description: '',
      });
      setTodos((prev) => [...prev, convertDates(newTodo)]);
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleUpdateTitle = async (id: string, title: string) => {
    try {
      const updatedTodo = await api.todo.update.mutate({
        id,
        title,
      });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? convertDates(updatedTodo) : todo))
      );
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleUpdateStatus = async (id: string, status: TodoStatus) => {
    try {
      const updatedTodo = await api.todo.changeStatus.mutate({
        id,
        action: status === 'completed' ? 'complete' : 'cancel',
      });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? convertDates(updatedTodo) : todo))
      );
    } catch (error) {
      console.error('Failed to update todo status:', error);
    }
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
    <main className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <Button onClick={handleCreateTodo}>
          <Plus className="mr-2 h-4 w-4" />
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

      <TodoList
        todos={filteredTodos}
        onUpdateTitle={handleUpdateTitle}
        onUpdateStatus={handleUpdateStatus}
      />
    </main>
  );
}
