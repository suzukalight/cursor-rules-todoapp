export interface AddTodoButtonProps {
  onClick?: () => void;
  'data-testid'?: string;
}

export const AddTodoButton = ({ onClick, 'data-testid': testId }: AddTodoButtonProps) => {
  return (
    <button
      type="button"
      className="flex items-center gap-2 px-4 py-2 text-gray-500 transition-colors duration-200 hover:text-gray-700"
      onClick={onClick}
      data-testid={testId}
    >
      <span className="text-xl transition-transform duration-200 hover:scale-110">+</span>
      <span>タスクを追加</span>
    </button>
  );
};
