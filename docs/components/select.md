# Select コンポーネント

ドロップダウンリストから項目を選択するためのコンポーネントです。

## 機能

- 単一項目の選択
- キーボード操作のサポート
- アクセシビリティ対応
- グループ化機能
- 無効状態のサポート

## 使用例

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@cursor-rules-todoapp/ui';

// 基本的な使用例
export function BasicSelect() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Option 1</SelectItem>
        <SelectItem value="2">Option 2</SelectItem>
        <SelectItem value="3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  );
}

// グループ化の例
export function GroupedSelect() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a food" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="potato">Potato</SelectItem>
          <SelectItem value="tomato">Tomato</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
```

## Props

### Select

| プロパティ | 型 | デフォルト値 | 説明 |
|------------|------|--------------|------|
| value | `string` | - | 選択された値 |
| defaultValue | `string` | - | 初期値 |
| onValueChange | `(value: string) => void` | - | 値が変更されたときのコールバック |
| disabled | `boolean` | `false` | 無効状態 |
| required | `boolean` | `false` | 必須項目 |
| name | `string` | - | フォーム要素の名前 |

### SelectItem

| プロパティ | 型 | デフォルト値 | 説明 |
|------------|------|--------------|------|
| value | `string` | - | 項目の値 |
| disabled | `boolean` | `false` | 項目の無効状態 |
| children | `React.ReactNode` | - | 項目の表示内容 |

## アクセシビリティ

- WAI-ARIA 1.2 Combobox パターンに準拠
- キーボード操作のサポート
  - `Space` / `Enter`: オプションの選択
  - `↑` / `↓`: オプション間の移動
  - `Esc`: ドロップダウンを閉じる
- スクリーンリーダー対応

## テストケース

1. 基本的なレンダリング
   - コンポーネントが正しくレンダリングされること
   - プレースホルダーが表示されること

2. ドロップダウンの操作
   - クリックでドロップダウンが開くこと
   - オプションが表示されること

3. 値の選択
   - オプションを選択できること
   - 選択した値が表示されること

4. 無効状態
   - コンポーネント全体を無効化できること
   - 個別の項目を無効化できること

5. アクセシビリティ
   - キーボード操作が機能すること
   - ARIA属性が適切に設定されていること 