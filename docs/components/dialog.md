# Dialog コンポーネント

モーダルダイアログを表示するためのコンポーネントです。

## 機能

- モーダルダイアログの表示/非表示
- キーボード操作のサポート（Escキーでの閉じる）
- アクセシビリティ対応
- アニメーション効果
- カスタマイズ可能なヘッダー、フッター、コンテンツ

## 使用例

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@cursor-rules-todoapp/ui';

// 基本的な使用例
export function BasicDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of the dialog content.
          </DialogDescription>
        </DialogHeader>
        <div>Some content here</div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// フォーム付きの例
export function FormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="space-y-4">
            <div>
              <label>Name</label>
              <input type="text" />
            </div>
            <div>
              <label>Email</label>
              <input type="email" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

## コンポーネント

### Dialog

ダイアログのルートコンポーネントです。

| プロパティ | 型 | デフォルト値 | 説明 |
|------------|------|--------------|------|
| open | `boolean` | - | ダイアログの開閉状態 |
| onOpenChange | `(open: boolean) => void` | - | 開閉状態が変更されたときのコールバック |
| modal | `boolean` | `true` | モーダルモードの有効/無効 |

### DialogTrigger

ダイアログを開くためのトリガーコンポーネントです。

| プロパティ | 型 | デフォルト値 | 説明 |
|------------|------|--------------|------|
| asChild | `boolean` | `false` | 子要素をトリガーとして使用 |

### DialogContent

ダイアログの内容を表示するコンポーネントです。

| プロパティ | 型 | デフォルト値 | 説明 |
|------------|------|--------------|------|
| forceMount | `boolean` | - | 常にマウントを強制 |
| onOpenAutoFocus | `(event: Event) => void` | - | 開いたときのフォーカスイベント |
| onCloseAutoFocus | `(event: Event) => void` | - | 閉じたときのフォーカスイベント |

## アクセシビリティ

- WAI-ARIA Dialog パターンに準拠
- キーボード操作のサポート
  - `Esc`: ダイアログを閉じる
  - `Tab`: フォーカス移動
  - `Shift + Tab`: 逆方向のフォーカス移動
- スクリーンリーダー対応
  - 適切なARIA属性の設定
  - フォーカス管理

## テストケース

1. 基本的なレンダリング
   - トリガーボタンが正しくレンダリングされること
   - ダイアログの内容が正しくレンダリングされること

2. 開閉動作
   - トリガーのクリックでダイアログが開くこと
   - 閉じるボタンのクリックでダイアログが閉じること
   - Escキーでダイアログが閉じること

3. アクセシビリティ
   - 適切なARIA属性が設定されていること
   - キーボード操作が正しく機能すること
   - フォーカス管理が適切に行われること

4. カスタマイズ
   - カスタムクラスが適用できること
   - 子要素が正しく表示されること 