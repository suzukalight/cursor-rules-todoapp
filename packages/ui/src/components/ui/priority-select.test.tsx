import type { TodoPriority } from '@cursor-rules-todoapp/common';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { PrioritySelect } from './priority-select';

describe('PrioritySelect', () => {
  test('現在の優先度が表示される', () => {
    render(<PrioritySelect value="medium" onValueChange={() => {}} />);
    expect(screen.getByText('中')).toBeInTheDocument();
  });

  test('優先度を変更できる', () => {
    const onValueChange = vi.fn();
    render(<PrioritySelect value="medium" onValueChange={onValueChange} />);

    // 優先度選択のトリガーをクリック
    fireEvent.click(screen.getByText('中'));

    // 優先度「高」を選択
    fireEvent.click(screen.getByText('高'));

    expect(onValueChange).toHaveBeenCalledWith('high');
  });

  test('すべての優先度オプションが表示される', () => {
    render(<PrioritySelect value="medium" onValueChange={() => {}} />);

    // 優先度選択のトリガーをクリック
    fireEvent.click(screen.getByText('中'));

    // すべての優先度オプションが表示されることを確認
    expect(screen.getAllByText('低')[0]).toBeInTheDocument();
    expect(screen.getAllByText('中')[0]).toBeInTheDocument();
    expect(screen.getAllByText('高')[0]).toBeInTheDocument();
  });

  test('各優先度に適切なスタイルが適用される', () => {
    const priorities: TodoPriority[] = ['low', 'medium', 'high'];
    const colors = {
      low: 'text-blue-600 bg-blue-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-red-600 bg-red-100',
    } as const;

    for (const priority of priorities) {
      render(<PrioritySelect value={priority} onValueChange={() => {}} />);
      const trigger = screen.getByText(
        priority === 'low' ? '低' : priority === 'medium' ? '中' : '高'
      );
      expect(trigger).toHaveClass(colors[priority]);
    }
  });
});
