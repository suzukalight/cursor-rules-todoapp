# UIコンポーネント

## Button

汎用的なボタンコンポーネント。

### 使用例

```tsx
import { Button } from '@cursor-rules-todoapp/ui';

// デフォルトのボタン
<Button>Click me</Button>

// バリアント
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// サイズ
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// リンクとして使用
<Button asChild>
  <a href="/somewhere">Link Button</a>
</Button>
```

### Props

| プロパティ | 型 | デフォルト | 説明 |
|------------|-----|------------|------|
| variant | 'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link' | 'default' | ボタンのスタイルバリアント |
| size | 'default' \| 'sm' \| 'lg' \| 'icon' | 'default' | ボタンのサイズ |
| asChild | boolean | false | 子要素をボタンとして使用するかどうか |

その他のプロパティは`HTMLButtonElement`の属性をすべてサポートしています。

### アクセシビリティ

- ネイティブの`button`要素を使用
- キーボード操作に対応
- WAI-ARIAの属性をサポート
- フォーカス時の視覚的なインジケータ

### テスト

以下のテストケースをカバー：

- 基本的なレンダリング
- バリアントの適用
- サイズの適用
- クリックイベントの処理
- ref転送
- 子要素としての使用
- アクセシビリティ
- 無効状態 