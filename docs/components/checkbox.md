# Checkbox コンポーネント

アクセシビリティに配慮した、カスタマイズ可能なチェックボックスコンポーネントです。Radix UIをベースに実装されています。

## 使用例

```tsx
import { Checkbox } from '@cursor-rules-todoapp/ui';

// 基本的な使用方法
<Checkbox label="Accept terms" />

// 制御された状態
<Checkbox checked={isChecked} onCheckedChange={setIsChecked} />

// 不定状態
<Checkbox checked="indeterminate" />

// 無効化状態
<Checkbox disabled />

// カスタムスタイル
<Checkbox className="custom-class" />
```

## Props

`Checkbox`コンポーネントは、Radix UIの`Checkbox.Root`のすべてのプロパティに加えて、以下のプロパティをサポートしています：

| プロパティ | 型 | デフォルト値 | 説明 |
|------------|------|--------------|--------|
| `checked` | `boolean \| 'indeterminate'` | - | チェックボックスの状態 |
| `defaultChecked` | `boolean` | `false` | 初期状態のチェック状態 |
| `onCheckedChange` | `(checked: boolean) => void` | - | 状態変更時のコールバック |
| `disabled` | `boolean` | `false` | 無効化状態 |
| `required` | `boolean` | `false` | 必須入力 |
| `label` | `string` | - | ラベルテキスト |
| `className` | `string` | - | カスタムCSSクラス |

## スタイリング

デフォルトで以下のスタイルが適用されます：

- サイズ（h-4 w-4）
- 丸みを帯びた角（rounded-sm）
- 境界線（border border-primary）
- フォーカス時のリング（focus-visible:ring-1）
- チェック時の背景色（data-[state=checked]:bg-primary）
- 無効時のスタイル（disabled:opacity-50）

## アクセシビリティ

- キーボードナビゲーション（Tab、Space）
- スクリーンリーダー対応
- WAI-ARIA属性のサポート
- ラベルとの適切な関連付け

## テストケース

以下の項目についてテストが実装されています：

1. 基本的なレンダリング
2. チェック状態の切り替え
3. 制御された状態の管理
4. 不定状態の表示
5. 無効化状態の処理
6. キーボード操作
7. イベントハンドリング 