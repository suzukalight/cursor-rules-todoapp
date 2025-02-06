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
      <div className="flex-1">
        <Input
          type="text"
          placeholder="タスクを検索..."
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchQueryChange(e.target.value)}
          className="w-full bg-white dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-lg"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm font-medium">
            ステータス
          </label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger
              id="status-filter"
              className="w-[180px] bg-white dark:bg-gray-700 dark:text-gray-100 border-gray-200 dark:border-gray-600 rounded-lg"
              aria-labelledby="status-filter-label"
              data-testid="status-filter"
            >
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-w-[180px] rounded-lg"
              align="start"
              sideOffset={4}
            >
              <div className="py-1">
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2.5"
                  value="all"
                >
                  <span className="absolute left-1.5">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-5">すべて</span>
                </SelectItem>
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2.5"
                  value="pending"
                >
                  <span className="absolute left-1.5">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-5">未着手</span>
                </SelectItem>
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2.5"
                  value="in-progress"
                >
                  <span className="absolute left-1.5">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-5">進行中</span>
                </SelectItem>
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2.5"
                  value="completed"
                >
                  <span className="absolute left-1.5">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-5">完了</span>
                </SelectItem>
              </div>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="priority-filter" className="text-sm font-medium">
            優先度
          </label>
          <Select value={priority} onValueChange={onPriorityChange}>
            <SelectTrigger
              id="priority-filter"
              className="w-[180px] bg-white dark:bg-gray-700 dark:text-gray-100 border-gray-200 dark:border-gray-600 rounded-lg"
              aria-labelledby="priority-filter-label"
              data-testid="priority-filter"
            >
              <SelectValue placeholder="優先度" />
            </SelectTrigger>
            <SelectContent
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-w-[180px] rounded-lg"
              align="start"
              sideOffset={4}
            >
              <div className="py-1">
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2.5"
                  value="all"
                >
                  <span className="absolute left-1.5">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-5">すべて</span>
                </SelectItem>
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2.5 text-red-600"
                  value="high"
                >
                  <span className="absolute left-1.5">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-5">高</span>
                </SelectItem>
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2.5 text-yellow-600"
                  value="medium"
                >
                  <span className="absolute left-1.5">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-5">中</span>
                </SelectItem>
                <SelectItem
                  className="relative rounded-lg text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2.5 text-blue-600"
                  value="low"
                >
                  <span className="absolute left-1.5">
                    <span className="sr-only">選択済み</span>
                  </span>
                  <span className="pl-5">低</span>
                </SelectItem>
              </div>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="view-mode" className="text-sm font-medium">
            表示
          </label>
          <Select value={viewMode} onValueChange={onViewModeChange}>
            <SelectTrigger
              id="view-mode"
              className="w-[180px] bg-white dark:bg-gray-700 dark:text-gray-100 border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <SelectValue placeholder="表示モード" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grouped">期限日でグループ化</SelectItem>
              <SelectItem value="list">リスト表示</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
