import type { Todo } from '@cursor-rules-todoapp/common';

export type DueDateGroup = 'today' | 'thisWeek' | 'thisMonth' | 'later' | 'noDueDate';

export interface GroupedTodos {
  today: Todo[];
  thisWeek: Todo[];
  thisMonth: Todo[];
  later: Todo[];
  noDueDate: Todo[];
}

export const GROUP_LABELS: Record<DueDateGroup, string> = {
  today: '期限切れ',
  thisWeek: '1週間以内',
  thisMonth: '1ヶ月以内',
  later: 'それ以降',
  noDueDate: '期限なし',
};

export function groupTodosByDueDate(todos: Todo[], baseDate?: Date): GroupedTodos {
  const now = baseDate ?? new Date();
  now.setHours(0, 0, 0, 0);

  const oneWeekLater = new Date(now);
  oneWeekLater.setDate(now.getDate() + 7);

  const oneMonthLater = new Date(now);
  oneMonthLater.setMonth(now.getMonth() + 1);

  return todos.reduce<GroupedTodos>(
    (groups, todo) => {
      if (!todo.dueDate) {
        groups.noDueDate.push(todo);
        return groups;
      }

      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate <= now) {
        groups.today.push(todo);
      } else if (dueDate <= oneWeekLater) {
        groups.thisWeek.push(todo);
      } else if (dueDate <= oneMonthLater) {
        groups.thisMonth.push(todo);
      } else {
        groups.later.push(todo);
      }

      return groups;
    },
    {
      today: [],
      thisWeek: [],
      thisMonth: [],
      later: [],
      noDueDate: [],
    }
  );
}
