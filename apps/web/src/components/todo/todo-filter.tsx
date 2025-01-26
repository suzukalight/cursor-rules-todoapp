import type { TodoStatus } from '@cursor-rules-todoapp/common';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cursor-rules-todoapp/ui';

interface TodoFilterProps {
  status: TodoStatus | 'all';
  onStatusChange: (status: TodoStatus | 'all') => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  sortBy: 'createdAt' | 'updatedAt';
  onSortByChange: (sortBy: 'createdAt' | 'updatedAt') => void;
}

export const TodoFilter = ({
  status,
  onStatusChange,
  searchQuery,
  onSearchQueryChange,
  sortBy,
  onSortByChange,
}: TodoFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="タスクを検索..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex gap-4">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="pending">未完了</SelectItem>
            <SelectItem value="completed">完了</SelectItem>
            <SelectItem value="cancelled">キャンセル</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">作成日</SelectItem>
            <SelectItem value="updatedAt">更新日</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}; 