import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Label } from './label';

describe('Label', () => {
  it('正しくレンダリングされる', () => {
    render(<Label>テストラベル</Label>);
    expect(screen.getByText('テストラベル')).toBeInTheDocument();
  });

  it('必須の場合にマークを表示する', () => {
    render(<Label required>必須項目</Label>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('カスタムクラス名を適用できる', () => {
    render(<Label className="custom-class">カスタムラベル</Label>);
    expect(screen.getByText('カスタムラベル')).toHaveClass('custom-class');
  });

  it('htmlForを使用してフォーム要素と関連付けられる', () => {
    render(
      <>
        <Label htmlFor="test-input">ラベルテキスト</Label>
        <input id="test-input" />
      </>
    );
    const label = screen.getByText('ラベルテキスト');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('peerスタイリングを通じて無効状態を処理する', () => {
    render(
      <div>
        <Label>無効化されたラベル</Label>
        <input disabled />
      </div>
    );
    const label = screen.getByText('無効化されたラベル');
    expect(label).toHaveClass('peer-disabled:opacity-70');
  });
});
