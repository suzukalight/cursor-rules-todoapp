'use client';

import type { Todo, TodoPriority, TodoStatus } from '@cursor-rules-todoapp/common';
import type { TodoDto } from '@cursor-rules-todoapp/domain/src/todo/todo';
import { AddTodoButton } from '@cursor-rules-todoapp/ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { ThemeToggle } from '../components/theme/theme-toggle';
import { TodoFilter, type ViewMode } from '../components/todo/todo-filter';
import { TodoList } from '../components/todo/todo-list';
import { trpc } from '../utils/api';

const convertTodoDto = (todoDto: TodoDto): Todo => ({
  id: todoDto.id,
  title: todoDto.title,
  description: todoDto.description,
  status: todoDto.status,
  priority: todoDto.priority,
  dueDate: todoDto.dueDate ? new Date(todoDto.dueDate) : undefined,
  completedAt: todoDto.completedAt ? new Date(todoDto.completedAt) : undefined,
  createdAt: new Date(todoDto.createdAt),
  updatedAt: new Date(todoDto.updatedAt),
});

const TodoPageClient = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URLパラメータから初期値を取得
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus | 'all'>('all');
  const [priority, setPriority] = useState<TodoPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grouped');

  const utils = trpc.useContext();
  const { data: todoResult } = trpc.todo.findAll.useQuery();

  useEffect(() => {
    if (todoResult) {
      const convertedTodos = todoResult.map(convertTodoDto);
      setTodos(convertedTodos);
    }
  }, [todoResult]);

  // URLパラメータを更新する関数
  const updateSearchParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentValue = params.get(name);

      // 値が同じ場合は更新しない
      if (currentValue === value) return;

      if (value && value !== 'all') {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // URLパラメータの変更を監視して状態を更新
  useEffect(() => {
    const statusParam = searchParams.get('status') as TodoStatus | 'all';
    const priorityParam = searchParams.get('priority') as TodoPriority | 'all';
    const queryParam = searchParams.get('q');
    const viewParam = searchParams.get('view') as ViewMode;

    setStatus(statusParam || 'all');
    setPriority(priorityParam || 'all');
    setSearchQuery(queryParam || '');
    setViewMode(viewParam || 'grouped');
  }, [searchParams]);

  // 各フィルターの変更ハンドラー
  const handleStatusChange = useCallback(
    (newStatus: TodoStatus | 'all') => {
      setStatus(newStatus);
      updateSearchParams('status', newStatus);
    },
    [updateSearchParams]
  );

  const handlePriorityChange = useCallback(
    (newPriority: TodoPriority | 'all') => {
      setPriority(newPriority);
      updateSearchParams('priority', newPriority);
    },
    [updateSearchParams]
  );

  const handleSearchQueryChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      updateSearchParams('q', query);
    },
    [updateSearchParams]
  );

  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      setViewMode(mode);
      updateSearchParams('view', mode);
    },
    [updateSearchParams]
  );

  const createTodoMutation = trpc.todo.create.useMutation({
    onSuccess: async (result) => {
      const newTodo = convertTodoDto(result);
      setTodos((prev) => [...prev, newTodo]);
      await utils.todo.findAll.invalidate();
    },
  });

  const updateTodoMutation = trpc.todo.update.useMutation({
    onSuccess: async (result) => {
      const updatedTodo = convertTodoDto(result);
      setTodos((prev) => prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
      await utils.todo.findAll.invalidate();
    },
  });

  const changeTodoStatusMutation = trpc.todo.changeStatus.useMutation({
    onSuccess: async (result) => {
      const updatedTodo = convertTodoDto(result);
      setTodos((prev) => prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
      await utils.todo.findAll.invalidate();
    },
  });

  const handleCreateTodo = async () => {
    try {
      await createTodoMutation.mutateAsync({
        title: '新しいタスク',
        description: '',
        priority: 'medium',
      });
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleUpdateStatus = async (id: string, status: TodoStatus) => {
    try {
      await changeTodoStatusMutation.mutateAsync({
        id,
        status,
      });
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  const handleUpdatePriority = async (id: string, priority: TodoPriority) => {
    try {
      await updateTodoMutation.mutateAsync({
        id,
        priority,
      });
    } catch (error) {
      console.error('Error updating todo priority:', error);
    }
  };

  const handleUpdateDueDate = async (id: string, dueDate: Date | null) => {
    // Optimistic UI update: update the local state immediately
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, dueDate: dueDate || undefined } : todo))
    );
    try {
      // APIに送信する前に日付を正しい形式に変換
      let dueDateForApi: Date | undefined = undefined;
      if (dueDate) {
        // 日付が有効かチェック
        if (Number.isNaN(dueDate.getTime())) {
          throw new Error('Invalid date');
        }
        // 日付のみを抽出して新しいDateオブジェクトを作成
        const [year, month, day] = dueDate.toISOString().split('T')[0].split('-').map(Number);
        dueDateForApi = new Date(year, month - 1, day, 0, 0, 0, 0);
      }

      await updateTodoMutation.mutateAsync({
        id,
        dueDate: dueDateForApi,
      });
    } catch (error) {
      console.error('Error updating due date:', error);
      // エラー時は元の状態に戻す
      const originalTodo = todos.find((todo) => todo.id === id);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, dueDate: originalTodo?.dueDate } : todo))
      );
    }
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (status === 'all') return true;
      return todo.status === status;
    })
    .filter((todo) => {
      if (priority === 'all') return true;
      return todo.priority === priority;
    })
    .filter((todo) => {
      if (!searchQuery) return true;
      return (
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      );
    })
    .sort((a, b) => {
      // 優先度でソート（高→中→低）
      const priorityOrder = { high: 2, medium: 1, low: 0 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-gray-100">Todo List</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AddTodoButton onClick={handleCreateTodo} data-testid="create-todo-button" />
        </div>
      </div>

      <TodoFilter
        status={status}
        onStatusChange={handleStatusChange}
        priority={priority}
        onPriorityChange={handlePriorityChange}
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      <TodoList
        todos={filteredTodos}
        viewMode={viewMode}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePriority={handleUpdatePriority}
        onUpdateDueDate={handleUpdateDueDate}
        onCreateTodo={handleCreateTodo}
      />
    </main>
  );
};

export default function TodoPage() {
  return (
    <Suspense>
      <TodoPageClient />
    </Suspense>
  );
}
