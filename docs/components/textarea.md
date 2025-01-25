# Textarea コンポーネント

複数行のテキスト入力を提供するコンポーネントです。リサイズ可能で、アクセシビリティに配慮した設計となっています。

## 使用例

```tsx
import { Textarea } from '@cursor-rules-todoapp/ui';

// 基本的な使用方法
<Textarea placeholder="Enter text" />

// 初期値の設定
<Textarea defaultValue="Default text" />

// 制御されたコンポーネント
<Textarea value={text} onChange={(e) => setText(e.target.value)} />

// カスタムスタイル
<Textarea className="custom-class" />

// 無効化状態
<Textarea disabled />

// サイズ指定
<Textarea rows={4} />
```

## Props

`Textarea`コンポーネントは、標準の`textarea`要素のすべての属性をサポートしています：

| プロパティ | 型 | デフォルト値 | 説明 |
|------------|------|--------------|--------|
| `value` | `string` | - | テキストエリアの値 |
| `defaultValue` | `string` | - | 初期値 |
| `placeholder` | `string` | - | プレースホルダーテキスト |
| `rows` | `number` | - | 表示する行数 |
| `disabled` | `boolean` | `false` | 無効化状態 |
| `className` | `string` | - | カスタムCSSクラス |
| `onChange` | `(e: ChangeEvent<HTMLTextAreaElement>) => void` | - | 値変更時のコールバック |

## スタイリング

デフォルトで以下のスタイルが適用されます：

- 最小の高さ（min-h-[80px]）
- 幅（w-full）
- 丸みを帯びた角（rounded-md）
- 境界線（border border-input）
- パディング（px-3 py-2）
- テキストサイズ（text-sm）
- フォーカス時のリング（focus-visible:ring-2）
- 無効時のスタイル（disabled:opacity-50）

## アクセシビリティ

- キーボードナビゲーション対応
- スクリーンリーダー対応
- WAI-ARIA属性のサポート
- リサイズ可能なインターフェース

## テストケース

以下の項目についてテストが実装されています：

1. 基本的なレンダリング
2. テキスト入力の処理
3. 複数行テキストの処理
4. カスタムクラスの適用
5. 無効化状態の処理
6. イベントハンドリング
7. refの転送 