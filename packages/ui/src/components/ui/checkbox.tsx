export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = ({ checked = false, onCheckedChange }: CheckboxProps) => {
  return (
    <div className="relative h-5 w-5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="peer absolute h-5 w-5 cursor-pointer opacity-0"
      />
      <div
        className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded border transition-colors duration-200 peer-checked:border-green-600 peer-checked:bg-green-600 peer-checked:text-white ${
          checked ? 'border-green-600 bg-green-600' : 'border-gray-300 bg-white'
        }`}
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 animate-scale-in"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <title>チェックマーク</title>
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </div>
  );
}; 