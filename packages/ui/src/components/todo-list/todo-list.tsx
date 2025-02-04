import type { ReactNode } from 'react';

export interface TodoListProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export const TodoList = ({ children, title = '今日', className = '' }: TodoListProps) => {
  return (
    <div className={`flex flex-col gap-6 p-4 ${className}`}>
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};
