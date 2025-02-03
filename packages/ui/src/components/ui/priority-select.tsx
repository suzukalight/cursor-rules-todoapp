import type { TodoPriority } from '@cursor-rules-todoapp/common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface PrioritySelectProps {
  value: TodoPriority;
  onValueChange: (value: TodoPriority) => void;
}

const priorityLabels: Record<TodoPriority, string> = {
  low: '低',
  medium: '中',
  high: '高',
};

const priorityColors: Record<TodoPriority, string> = {
  low: 'text-blue-600 bg-blue-100',
  medium: 'text-yellow-600 bg-yellow-100',
  high: 'text-red-600 bg-red-100',
};

export const PrioritySelect = ({ value, onValueChange }: PrioritySelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-24">
        <SelectValue>
          <span className={`rounded px-2 py-1 text-xs ${priorityColors[value]}`}>
            {priorityLabels[value]}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(priorityLabels).map(([priority, label]) => (
          <SelectItem key={priority} value={priority}>
            <span
              className={`rounded px-2 py-1 text-xs ${priorityColors[priority as TodoPriority]}`}
            >
              {label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
