import type { TodoPriority, TodoStatus } from '@cursor-rules-todoapp/common';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cursor-rules-todoapp/ui';
import type { ChangeEvent } from 'react';

export type ViewMode = 'grouped' | 'list';

interface TodoFilterProps {
  status: TodoStatus | 'all';
  onStatusChange: (status: TodoStatus | 'all') => void;
  priority: TodoPriority | 'all';
  onPriorityChange: (priority: TodoPriority | 'all') => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const TodoFilter = ({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  searchQuery,
  onSearchQueryChange,
  viewMode,
  onViewModeChange,
}: TodoFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="w-full md:w-[40%]">
        <Input
          type="text"
          placeholder="タスクを検索..."
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchQueryChange(e.target.value)}
          className="w-full bg-white dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-lg"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm font-medium whitespace-nowrap">
            状態
          </label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger
              id="status-filter"
              className="w-[120px] bg-white dark:bg-gray-700 dark:text-gray-100 border-gray-200 dark:border-gray-600 rounded-lg"
              aria-labelledby="status-filter-label"
              data-testid="status-filter"
            >
              <SelectValue placeholder="状態" />
            </SelectTrigger>
            <SelectContent
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-w-[120px] rounded-lg"
              align="start"
              sideOffset={4}
            >
              <div className="py-1">
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2"
                  value="all"
                >
                  <span className="absolute left-1">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-3">すべて</span>
                </SelectItem>
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2"
                  value="pending"
                >
                  <span className="absolute left-1">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-3">未着手</span>
                </SelectItem>
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2"
                  value="in-progress"
                >
                  <span className="absolute left-1">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-3">進行中</span>
                </SelectItem>
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2"
                  value="completed"
                >
                  <span className="absolute left-1">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-3">完了</span>
                </SelectItem>
              </div>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="priority-filter" className="text-sm font-medium whitespace-nowrap">
            優先度
          </label>
          <Select value={priority} onValueChange={onPriorityChange}>
            <SelectTrigger
              id="priority-filter"
              className="w-[100px] bg-white dark:bg-gray-700 dark:text-gray-100 border-gray-200 dark:border-gray-600 rounded-lg"
              aria-labelledby="priority-filter-label"
              data-testid="priority-filter"
            >
              <SelectValue placeholder="優先度" />
            </SelectTrigger>
            <SelectContent
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-w-[100px] rounded-lg"
              align="start"
              sideOffset={4}
            >
              <div className="py-1">
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2"
                  value="all"
                >
                  <span className="absolute left-1">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-3">すべて</span>
                </SelectItem>
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2 text-red-600"
                  value="high"
                >
                  <span className="absolute left-1">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-3">高</span>
                </SelectItem>
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2 text-yellow-600"
                  value="medium"
                >
                  <span className="absolute left-1">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-3">中</span>
                </SelectItem>
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2 text-blue-600"
                  value="low"
                >
                  <span className="absolute left-1">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-3">低</span>
                </SelectItem>
              </div>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="view-mode" className="text-sm font-medium whitespace-nowrap">
            表示
          </label>
          <Select value={viewMode} onValueChange={onViewModeChange}>
            <SelectTrigger
              id="view-mode"
              className="w-[120px] bg-white dark:bg-gray-700 dark:text-gray-100 border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <SelectValue placeholder="表示" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2"
                value="grouped"
              >
                <span className="absolute left-1">
                  <span className="sr-only">選択済み</span>
                </span>
                <span className="pl-3">期限別</span>
              </SelectItem>
              <SelectItem
                className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2"
                value="list"
              >
                <span className="absolute left-1">
                  <span className="sr-only">選択済み</span>
                </span>
                <span className="pl-3">リスト</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
