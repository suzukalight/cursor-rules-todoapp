# Label コンポーネント

フォーム要素のラベルを提供するコンポーネントです。アクセシビリティに配慮し、必須項目の表示やスタイリングのカスタマイズが可能です。

## 使用例

```tsx
import { Label } from '@cursor-rules-todoapp/ui';

// 基本的な使用方法
<Label>Username</Label>

// 必須項目の表示
<Label required>Password</Label>

// フォーム要素との関連付け
<Label htmlFor="email">Email</Label>
<input id="email" type="email" />

// カスタムスタイル
<Label className="custom-class">Custom Label</Label>

// 無効化状態のスタイリング
<div>
  <Label>Disabled Field</Label>
  <input disabled />
</div>
```

## Props

`Label`コンポーネントは、Radix UIの`Label.Root`のすべてのプロパティに加えて、以下のプロパティをサポートしています：

| プロパティ | 型 | デフォルト値 | 説明 |
|------------|------|--------------|--------|
| `required` | `boolean` | `false` | 必須項目を示すマークの表示 |
| `htmlFor` | `string` | - | 関連付けるフォーム要素のID |
| `className` | `string` | - | カスタムCSSクラス |
| `children` | `ReactNode` | - | ラベルのテキストまたは要素 |

## スタイリング

デフォルトで以下のスタイルが適用されます：

- テキストサイズ（text-sm）
- フォントの太さ（font-medium）
- 行の高さ（leading-none）
- 無効時のスタイル（peer-disabled:opacity-70）
- 必須マークの色（text-destructive）

## アクセシビリティ

- フォーム要素との適切な関連付け（htmlFor属性）
- スクリーンリーダー対応
- WAI-ARIA属性のサポート
- キーボードナビゲーション対応

## テストケース

以下の項目についてテストが実装されています：

1. 基本的なレンダリング
2. 必須マークの表示
3. カスタムクラスの適用
4. フォーム要素との関連付け
5. 無効化状態のスタイリング 