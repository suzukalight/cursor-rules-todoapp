import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { addHours, subHours } from 'date-fns';
import { format } from 'date-fns';
import { TodoItem } from './todo-item';

describe('TodoItem', () => {
  test('タイトルが表示される', () => {
    render(<TodoItem title="Test Todo" priority="medium" />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  test('完了状態が表示される', () => {
    render(<TodoItem title="Test Todo" completed priority="medium" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('日付と時刻が表示される', () => {
    const date = new Date('2024-03-01T12:00:00');
    render(<TodoItem title="Test Todo" date={date} priority="medium" />);
    expect(screen.getByText('3/1 12:00')).toBeInTheDocument();
  });

  test('期限切れの日付は赤字で表示される', () => {
    const pastDate = subHours(new Date(), 1);
    render(<TodoItem title="Test Todo" date={pastDate} priority="medium" />);
    const dateElement = screen.getByText(
      `${format(pastDate, 'M/d')} ${format(pastDate, 'HH:mm')}`
    );
    expect(dateElement).toHaveClass('text-red-500');
  });

  test('完了済みのタスクは期限切れでも赤字にならない', () => {
    const pastDate = subHours(new Date(), 1);
    render(<TodoItem title="Test Todo" date={pastDate} completed priority="medium" />);
    const dateElement = screen.getByText(
      `${format(pastDate, 'M/d')} ${format(pastDate, 'HH:mm')}`
    );
    expect(dateElement).toHaveClass('text-gray-500');
  });

  test('繰り返しアイコンが表示される', () => {
    render(<TodoItem title="Test Todo" isRecurring priority="medium" />);
    expect(screen.getByTestId('repeat-icon')).toBeInTheDocument();
  });

  test('アラームアイコンが表示される', () => {
    render(<TodoItem title="Test Todo" hasAlarm priority="medium" />);
    expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
  });

  test('タグが表示される', () => {
    render(
      <TodoItem
        title="Test Todo"
        tag={{ name: 'important', color: '#ff0000' }}
        priority="medium"
      />
    );
    const hashTag = screen.getByText('#');
    expect(hashTag).toHaveStyle({ color: '#ff0000' });
    expect(screen.getByText('important')).toBeInTheDocument();
  });

  test('チェックボックスをクリックするとonToggleが呼ばれる', () => {
    const onToggle = vi.fn();
    render(<TodoItem title="Test Todo" onToggle={onToggle} priority="medium" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalled();
  });

  test('優先度ラベルが表示される', () => {
    render(<TodoItem title="Test Todo" priority="high" />);
    expect(screen.getByText('高')).toHaveClass('text-red-600');
  });

  test('優先度を変更するとonPriorityChangeが呼ばれる', () => {
    const onPriorityChange = vi.fn();
    render(<TodoItem title="Test Todo" priority="medium" onPriorityChange={onPriorityChange} />);

    // 優先度ラベルをクリック
    fireEvent.click(screen.getByText('中'));

    // 優先度「高」を選択
    fireEvent.click(screen.getByText('高'));

    expect(onPriorityChange).toHaveBeenCalledWith('high');
  });
});
