import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TodoItem } from './todo-item';

describe('TodoItem', () => {
  it('タイトルが表示される', () => {
    render(<TodoItem title="テストタスク" />);
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
  });

  it('完了状態でタイトルに取り消し線が表示される', () => {
    render(<TodoItem title="テストタスク" completed />);
    expect(screen.getByText('テストタスク')).toHaveClass('line-through');
  });

  it('時間が指定されている場合に表示される', () => {
    render(<TodoItem title="テストタスク" time="7:30" />);
    expect(screen.getByText('7:30')).toBeInTheDocument();
  });

  it('アラームが設定されている場合にアイコンが表示される', () => {
    render(<TodoItem title="テストタスク" hasAlarm />);
    expect(screen.getByText('⏰')).toBeInTheDocument();
  });

  it('タグが指定されている場合に表示される', () => {
    render(<TodoItem title="テストタスク" tag="フィットネス" />);
    expect(screen.getByText('フィットネス')).toBeInTheDocument();
  });

  it('チェックボックスをクリックするとonToggleが呼ばれる', async () => {
    const onToggle = vi.fn();
    render(<TodoItem title="テストタスク" onToggle={onToggle} />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
