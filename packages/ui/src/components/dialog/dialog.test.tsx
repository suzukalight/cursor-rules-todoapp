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
      </Dialog>
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
      </Dialog>
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
      </Dialog>
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
          <div className="flex flex-col gap-4">
            <Button data-testid="first-button">最初</Button>
            <Button data-testid="second-button">次</Button>
            <Button data-testid="last-button">最後</Button>
          </div>
        </DialogContent>
      </Dialog>
    );

    // ダイアログを開く
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'ダイアログを開く' }));
    });

    // ダイアログが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // 最初のボタンにフォーカスが当たっていることを確認
    await waitFor(() => {
      expect(screen.getByTestId('first-button')).toHaveFocus();
    });

    // 次のボタンにタブ移動
    await user.tab();
    await waitFor(() => {
      expect(screen.getByTestId('second-button')).toHaveFocus();
    });

    // 最後のボタンにタブ移動
    await user.tab();
    await waitFor(() => {
      expect(screen.getByTestId('last-button')).toHaveFocus();
    });

    // 閉じるボタンにタブ移動
    await user.tab();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    });

    // 最初のボタンに戻る
    await user.tab();
    await waitFor(() => {
      expect(screen.getByTestId('first-button')).toHaveFocus();
    });
  });
});
