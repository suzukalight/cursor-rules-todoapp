# Card コンポーネント

タスク情報を表示するためのカードコンポーネントです。ヘッダー、コンテンツ、フッターの3つの領域を持ち、情報を整理して表示できます。

## 使用例

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@cursor-rules-todoapp/ui';

// 基本的な使用方法
<Card>
  <CardHeader>
    <h2>タスクのタイトル</h2>
    <p>作成日: 2024-02-20</p>
  </CardHeader>
  <CardContent>
    <p>タスクの詳細な説明がここに入ります。</p>
  </CardContent>
  <CardFooter>
    <Button>完了</Button>
    <Button variant="destructive">削除</Button>
  </CardFooter>
</Card>

// カスタムスタイル
<Card className="custom-card">
  <CardContent>カスタマイズされたカード</CardContent>
</Card>
```

## コンポーネント

### Card

メインのコンテナコンポーネントです。

#### Props
- `className`: カスタムCSSクラス
- `children`: カードの内容

### CardHeader

タイトルやメタ情報を表示するための領域です。

#### Props
- `className`: カスタムCSSクラス
- `children`: ヘッダーの内容

### CardContent

メインコンテンツを表示するための領域です。

#### Props
- `className`: カスタムCSSクラス
- `children`: コンテンツの内容

### CardFooter

アクションボタンなどを配置するための領域です。

#### Props
- `className`: カスタムCSSクラス
- `children`: フッターの内容

## スタイリング

### Card
- 丸みを帯びた角（rounded-lg）
- 境界線（border）
- 背景色（bg-card）
- テキスト色（text-card-foreground）
- 影（shadow-sm）

### CardHeader
- 縦方向のレイアウト（flex flex-col）
- 要素間の間隔（space-y-1.5）
- パディング（p-6）

### CardContent
- パディング（p-6 pt-0）

### CardFooter
- 横方向のレイアウト（flex items-center）
- パディング（p-6 pt-0）

## アクセシビリティ

- セマンティックなHTML構造
- キーボードナビゲーション対応
- スクリーンリーダー対応

## テストケース

以下の項目についてテストが実装されています：

1. 基本的なレンダリング
2. カスタムクラスの適用
3. 各サブコンポーネントのレンダリング
4. refの転送
5. ネストされたコンテンツの表示 