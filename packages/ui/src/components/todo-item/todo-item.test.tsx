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

  test('日付が表示される', () => {
    const date = new Date('2024-03-01');
    render(<TodoItem title="Test Todo" date={date} priority="medium" />);
    expect(screen.getByText('2024/03/01')).toBeInTheDocument();
  });

  test('期限切れの日付は赤字で表示される', () => {
    // 2024-03-01を基準日として、その前日を期限切れとする
    const baseDate = new Date('2024-03-01');
    const pastDate = new Date('2024-02-29');

    vi.useFakeTimers();
    vi.setSystemTime(baseDate);

    render(<TodoItem title="Test Todo" date={pastDate} priority="medium" />);
    const dateElement = screen.getByText('2024/02/29');
    expect(dateElement).toHaveClass('text-red-500');

    vi.useRealTimers();
  });

  test('完了済みのタスクは期限切れでも赤字にならない', () => {
    // 2024-03-01を基準日として、その前日を期限切れとする
    const baseDate = new Date('2024-03-01');
    const pastDate = new Date('2024-02-29');

    vi.useFakeTimers();
    vi.setSystemTime(baseDate);

    render(<TodoItem title="Test Todo" date={pastDate} completed priority="medium" />);
    const dateElement = screen.getByText('2024/02/29');
    expect(dateElement).toHaveClass('text-gray-500');

    vi.useRealTimers();
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
      <TodoItem title="Test Todo" tag={{ name: 'important', color: '#ff0000' }} priority="medium" />
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

  test('期限がない場合、「期限なし」が表示される', () => {
    render(<TodoItem title="Test Todo" priority="medium" />);
    expect(screen.getByText('期限なし')).toBeInTheDocument();
  });

  test('期限日を更新できる', () => {
    const onDueDateChange = vi.fn();
    render(
      <TodoItem
        title="Test Todo"
        priority="medium"
        date={new Date('2024-03-01')}
        onDueDateChange={onDueDateChange}
      />
    );

    // 期限日の表示をクリック
    fireEvent.click(screen.getByText('2024/03/01'));

    // 日付入力フィールドが表示されることを確認
    const dateInput = screen.getByDisplayValue('2024-03-01');
    expect(dateInput).toBeInTheDocument();

    // 新しい日付を入力
    fireEvent.change(dateInput, { target: { value: '2024-03-02' } });
    fireEvent.blur(dateInput);

    // ハンドラーが正しく呼び出されたことを確認
    expect(onDueDateChange).toHaveBeenCalledWith(new Date('2024-03-02'));
  });

  test('期限日を削除できる', () => {
    const onDueDateChange = vi.fn();
    render(
      <TodoItem
        title="Test Todo"
        priority="medium"
        date={new Date('2024-03-01')}
        onDueDateChange={onDueDateChange}
      />
    );

    // 期限日の表示をクリック
    fireEvent.click(screen.getByText('2024/03/01'));

    // 日付入力フィールドが表示されることを確認
    const dateInput = screen.getByDisplayValue('2024-03-01');
    expect(dateInput).toBeInTheDocument();

    // 日付を空にする
    fireEvent.change(dateInput, { target: { value: '' } });
    fireEvent.blur(dateInput);

    // ハンドラーが正しく呼び出されたことを確認
    expect(onDueDateChange).toHaveBeenCalledWith(null);
  });

  test('無効な日付が入力された場合、期限なしとして扱われる', () => {
    const onDueDateChange = vi.fn();
    render(<TodoItem title="Test Todo" priority="medium" onDueDateChange={onDueDateChange} />);

    // 期限日の表示をクリック
    fireEvent.click(screen.getByText('期限なし'));

    // 無効な日付を入力
    const dateInput = screen.getByDisplayValue('');
    fireEvent.change(dateInput, { target: { value: 'invalid-date' } });
    fireEvent.blur(dateInput);

    // 表示が「期限なし」のままであることを確認
    expect(screen.getByText('期限なし')).toBeInTheDocument();
    // コールバックがnullで呼び出されることを確認（期限なしを表す）
    expect(onDueDateChange).toHaveBeenCalledWith(null);
  });
});
