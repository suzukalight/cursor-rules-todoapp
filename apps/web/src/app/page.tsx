'use client';

import type { Todo, TodoStatus } from '@cursor-rules-todoapp/common';
import { Button } from '@cursor-rules-todoapp/ui';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '../components/theme/theme-toggle';
import { TodoFilter } from '../components/todo/todo-filter';
import { TodoList } from '../components/todo/todo-list';
import { trpc } from '../utils/api';

interface TodoData {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt'>('createdAt');

  const { data: todoData } = trpc.todo.findAll.useQuery();

  useEffect(() => {
    if (todoData) {
      const convertedTodos = todoData.map(todo => {
        const data = ('props' in todo ? todo.props : todo) as TodoData;
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          status: data.status,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
          completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
        };
      });
      setTodos(convertedTodos);
    }
  }, [todoData]);

  const createTodoMutation = trpc.todo.create.useMutation({
    onSuccess: (data) => {
      const todoData = ('props' in data ? data.props : data) as TodoData;
      const newTodo: Todo = {
        id: todoData.id,
        title: todoData.title,
        description: todoData.description,
        status: todoData.status,
        createdAt: todoData.createdAt ? new Date(todoData.createdAt) : new Date(),
        updatedAt: todoData.updatedAt ? new Date(todoData.updatedAt) : new Date(),
        completedAt: todoData.completedAt ? new Date(todoData.completedAt) : undefined,
      };
      setTodos((prev) => [...prev, newTodo]);
    },
  });

  const updateTodoMutation = trpc.todo.update.useMutation({
    onSuccess: (data) => {
      const todoData = ('props' in data ? data.props : data) as TodoData;
      const updatedTodo: Todo = {
        id: todoData.id,
        title: todoData.title,
        description: todoData.description,
        status: todoData.status,
        createdAt: todoData.createdAt ? new Date(todoData.createdAt) : new Date(),
        updatedAt: todoData.updatedAt ? new Date(todoData.updatedAt) : new Date(),
        completedAt: todoData.completedAt ? new Date(todoData.completedAt) : undefined,
      };
      setTodos((prev) =>
        prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
    },
  });

  const changeTodoStatusMutation = trpc.todo.changeStatus.useMutation({
    onSuccess: (data) => {
      const todoData = ('props' in data ? data.props : data) as TodoData;
      const updatedTodo: Todo = {
        id: todoData.id,
        title: todoData.title,
        description: todoData.description,
        status: todoData.status,
        createdAt: todoData.createdAt ? new Date(todoData.createdAt) : new Date(),
        updatedAt: todoData.updatedAt ? new Date(todoData.updatedAt) : new Date(),
        completedAt: todoData.completedAt ? new Date(todoData.completedAt) : undefined,
      };
      setTodos((prev) =>
        prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
    },
  });

  const handleCreateTodo = async () => {
    try {
      await createTodoMutation.mutateAsync({
        title: '新しいタスク',
        description: '',
      });
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleUpdateTitle = async (id: string, title: string) => {
    try {
      await updateTodoMutation.mutateAsync({
        id,
        title,
      });
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleUpdateStatus = async (id: string, status: TodoStatus) => {
    try {
      await changeTodoStatusMutation.mutateAsync({
        id,
        action: status === 'completed' ? 'complete' : 'cancel',
      });
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
        <h1 className="text-2xl font-bold dark:text-gray-100">Todo List</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button onClick={handleCreateTodo} className="h-8 rounded-lg">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </div>
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
