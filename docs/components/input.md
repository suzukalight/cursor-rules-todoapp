# Input コンポーネント

基本的なテキスト入力フィールドを提供するコンポーネントです。アクセシビリティに配慮し、カスタマイズ可能な設計となっています。

## 使用例

```tsx
import { Input } from '@cursor-rules-todoapp/ui';

// 基本的な使用方法
<Input placeholder="Enter text" />

// パスワード入力
<Input type="password" />

// カスタムスタイル
<Input className="custom-class" />

// 無効化
<Input disabled />

// ref の使用
const inputRef = useRef<HTMLInputElement>(null);
<Input ref={inputRef} />
```

## Props

`Input`コンポーネントは、標準の`HTMLInputElement`のすべての属性をサポートしています：

| プロパティ | 型 | デフォルト値 | 説明 |
|------------|------|--------------|--------|
| `type` | `string` | `"text"` | 入力フィールドのタイプ（text, password, email など） |
| `className` | `string` | - | カスタムCSSクラス |
| `disabled` | `boolean` | `false` | 入力フィールドの無効化状態 |
| `placeholder` | `string` | - | プレースホルダーテキスト |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | - | その他の標準HTML input属性 |

## スタイリング

デフォルトで以下のスタイルが適用されます：

- 丸みを帯びた角（rounded-md）
- 境界線（border）
- 背景色（bg-background）
- パディング（px-3 py-1）
- テキストサイズ（text-sm）
- フォーカス時のリング（focus-visible:ring-1）
- 無効時のスタイル（disabled:opacity-50）

## アクセシビリティ

- キーボードナビゲーション対応
- スクリーンリーダー対応
- WAI-ARIA属性のサポート

## テストケース

以下の項目についてテストが実装されています：

1. 基本的なレンダリング
2. テキスト入力の処理
3. カスタムクラスの適用
4. refの転送
5. 異なる入力タイプの処理
6. 無効化状態の処理
7. onChange イベントの処理 