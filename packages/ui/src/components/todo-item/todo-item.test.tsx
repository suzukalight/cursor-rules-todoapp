import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
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

  test('時間が表示される', () => {
    render(<TodoItem title="Test Todo" time="12:00" priority="medium" />);
    expect(screen.getByText('12:00')).toBeInTheDocument();
  });

  test('アラームアイコンが表示される', () => {
    render(<TodoItem title="Test Todo" hasAlarm priority="medium" />);
    expect(screen.getByText('⏰')).toBeInTheDocument();
  });

  test('タグが表示される', () => {
    render(<TodoItem title="Test Todo" tag="important" priority="medium" />);
    expect(screen.getByText('important')).toBeInTheDocument();
  });

  test('チェックボックスをクリックするとonToggleが呼ばれる', () => {
    const onToggle = vi.fn();
    render(<TodoItem title="Test Todo" onToggle={onToggle} priority="medium" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalled();
  });

  test('優先度が表示される', () => {
    render(<TodoItem title="Test Todo" priority="high" />);
    expect(screen.getByText('高')).toBeInTheDocument();
  });

  test('優先度を変更するとonPriorityChangeが呼ばれる', () => {
    const onPriorityChange = vi.fn();
    render(<TodoItem title="Test Todo" priority="medium" onPriorityChange={onPriorityChange} />);

    // 優先度選択のトリガーをクリック
    fireEvent.click(screen.getByText('中'));

    // 優先度「高」を選択
    fireEvent.click(screen.getByText('高'));

    expect(onPriorityChange).toHaveBeenCalledWith('high');
  });
});
