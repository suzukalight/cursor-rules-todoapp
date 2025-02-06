import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import TodoPage from './page';

// Next.jsのナビゲーション関数をモック
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/todos',
  useSearchParams: () => new URLSearchParams(''),
}));

// tRPCのクライアントをモック
vi.mock('../utils/api', () => ({
  trpc: {
    useContext: () => ({}),
    todo: {
      findAll: {
        useQuery: () => ({ data: [] }),
      },
      create: {
        useMutation: () => ({
          mutateAsync: vi.fn(),
        }),
      },
      update: {
        useMutation: () => ({
          mutateAsync: vi.fn(),
        }),
      },
      changeStatus: {
        useMutation: () => ({
          mutateAsync: vi.fn(),
        }),
      },
    },
  },
}));

describe('TodoPage', () => {
  it('フィルター条件がURLに反映される', () => {
    render(<TodoPage />);

    // ステータスフィルターの変更
    const statusSelect = screen.getByTestId('status-filter');
    fireEvent.click(statusSelect);
    const pendingOption = screen.getByRole('option', { name: '未着手' });
    fireEvent.click(pendingOption);

    expect(mockPush).toHaveBeenCalledWith('/todos?status=pending');

    // 優先度フィルターの変更
    const prioritySelect = screen.getByTestId('priority-filter');
    fireEvent.click(prioritySelect);
    const highOption = screen.getByRole('option', { name: '高' });
    fireEvent.click(highOption);

    expect(mockPush).toHaveBeenCalledWith('/todos?status=pending&priority=high');

    // 検索クエリの入力
    const searchInput = screen.getByPlaceholderText('タスクを検索...');
    fireEvent.change(searchInput, { target: { value: 'テスト' } });

    expect(mockPush).toHaveBeenCalledWith('/todos?status=pending&priority=high&q=テスト');

    // 表示モードの変更
    const viewModeSelect = screen.getByRole('combobox', { name: /表示/i });
    fireEvent.click(viewModeSelect);
    const listOption = screen.getByRole('option', { name: 'リスト' });
    fireEvent.click(listOption);

    expect(mockPush).toHaveBeenCalledWith(
      '/todos?status=pending&priority=high&q=テスト&view=list'
    );
  });

  it('URLパラメータから初期値を読み込む', () => {
    // URLパラメータを持つ状態でレンダリング
    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
      usePathname: () => '/todos',
      useSearchParams: () =>
        new URLSearchParams('status=pending&priority=high&q=テスト&view=list'),
    }));

    render(<TodoPage />);

    // ステータスフィルターの初期値
    expect(screen.getByTestId('status-filter')).toHaveTextContent('未着手');

    // 優先度フィルターの初期値
    expect(screen.getByTestId('priority-filter')).toHaveTextContent('高');

    // 検索クエリの初期値
    expect(screen.getByPlaceholderText('タスクを検索...')).toHaveValue('テスト');

    // 表示モードの初期値
    const viewModeSelect = screen.getByRole('combobox', { name: /表示/i });
    expect(viewModeSelect).toHaveTextContent('リスト');
  });
}); 