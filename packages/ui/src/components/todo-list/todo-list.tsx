import type { ReactNode } from 'react';

export interface TodoListProps {
  children: ReactNode;
  title?: string;
}

export const TodoList = ({ children, title = '今日' }: TodoListProps) => {
  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">マイプロジェクト</h2>
        <div className="flex flex-col gap-3">{children}</div>
      </div>
    </div>
  );
};
