import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

describe('Dialog', () => {
  // TODO: RadixUIのPresenceコンポーネントの問題により、ほとんどのテストは一時的に無効化されています
  // 詳細は docs/testing/dialog.md を参照してください

  it('トリガーボタンが正しくレンダリングされる', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>ダイアログを開く</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ダイアログのタイトル</DialogTitle>
            <DialogDescription>ダイアログの説明</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole('button')).toHaveTextContent('ダイアログを開く');
  });

  it('クリックでダイアログを開閉できる', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>ダイアログを開く</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ダイアログのタイトル</DialogTitle>
            <DialogDescription>ダイアログの説明</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    // 初期状態ではダイアログは閉じている
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // ダイアログを開く
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });

    // ダイアログが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // ダイアログの内容を確認
    expect(screen.getByText('ダイアログのタイトル')).toBeInTheDocument();
    expect(screen.getByText('ダイアログの説明')).toBeInTheDocument();

    // ダイアログを閉じる
    await act(async () => {
      await user.keyboard('{Escape}');
    });

    // ダイアログが消えるのを待つ
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('カスタムのクローズアクションを処理できる', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const handleClose = () => {
      onOpenChange(false);
    };

    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button>ダイアログを開く</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ダイアログのタイトル</DialogTitle>
            <DialogDescription>ダイアログの説明</DialogDescription>
          </DialogHeader>
          <Button onClick={handleClose} data-testid="custom-close">
            カスタム閉じるボタン
          </Button>
        </DialogContent>
      </Dialog>,
    );

    // 初期状態ではダイアログは開いている
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // カスタムボタンでダイアログを閉じる
    await act(async () => {
      await user.click(screen.getByTestId('custom-close'));
    });

    // onOpenChangeが呼ばれるのを待つ
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('ダイアログ内でフォーカスがトラップされる', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>ダイアログを開く</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ダイアログのタイトル</DialogTitle>
            <DialogDescription>ダイアログの説明</DialogDescription>
          </DialogHeader>
          <Button>最初</Button>
          <Button>次</Button>
          <Button>最後</Button>
        </DialogContent>
      </Dialog>,
    );

    // ダイアログを開く
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'ダイアログを開く' }));
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // フォーカストラップをチェック
    await act(async () => {
      await user.tab();
      await user.tab();
      await user.tab();
      await user.tab(); // 最初のフォーカス可能な要素に戻るはず
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '最初' })).toHaveFocus();
    });
  });
}); 