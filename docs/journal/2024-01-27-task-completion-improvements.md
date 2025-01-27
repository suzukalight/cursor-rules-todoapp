# タスク完了状態の視覚的改善

## 概要

タスクの完了状態が視覚的に不明確な問題を解決するため、以下の改善を実施しました：

1. 視覚的な改善
   - 完了タスクの背景色を変更（薄いグレー）
   - 完了タスクのテキストに取り消し線を追加
   - 完了ボタンのスタイル改善（緑色のアクセント）
   - ダークモード対応

2. アニメーションの追加
   - チェックマークの回転アニメーション
   - ボタンのホバー・タップエフェクト
   - タスク完了時のカードバウンス効果
   - スムーズなトランジション

3. アクセシビリティの改善
   - キーボード操作のサポート強化
   - 適切なaria-labelの追加
   - フォーカス時の視覚的フィードバック

## 変更内容

### 視覚的な改善

```tsx
<Card
  className={cn(
    'rounded-lg transition-colors duration-200',
    isCompleted && 'bg-gray-50 dark:bg-gray-800/50'
  )}
>
  {/* タイトルと説明文に取り消し線を追加 */}
  <h3 className={cn(
    'text-lg font-semibold',
    isCompleted && 'line-through text-gray-500 dark:text-gray-400'
  )}>
```

### アニメーション

```tsx
// チェックマークの回転アニメーション
<motion.div
  key="check"
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  exit={{ scale: 0, rotate: 180 }}
  transition={{
    duration: 0.3,
    ease: "easeOut",
    scale: { duration: 0.2 },
    rotate: { duration: 0.3 }
  }}
>
  <Check className="h-4 w-4" />
</motion.div>

// カード全体のバウンス効果
<motion.div
  animate={{
    scale: isCompleted ? [1, 1.02, 1] : 1,
  }}
  transition={{
    duration: 0.4,
    scale: {
      times: [0, 0.2, 1],
      ease: "easeOut"
    }
  }}
>
```

### アクセシビリティ

```tsx
// キーボード操作のサポート
const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    action();
  }
};

// aria-labelの追加
<Button
  aria-label={isCompleted ? 'タスク完了済み' : 'タスクを完了にする'}
  onKeyDown={(e) => handleKeyDown(e, () => onUpdateStatus(todo.id, 'completed'))}
>
```

## 受け入れ基準の達成状況

1. ✅ 完了タスクと未完了タスクが一目で区別できる
   - 背景色の変更
   - テキストの取り消し線
   - 完了ボタンの視覚的強調

2. ✅ 状態変更時のアニメーションがスムーズに動作する
   - チェックマークの回転アニメーション
   - カード全体のバウンス効果
   - スムーズなトランジション

3. ✅ キーボードのみで操作可能
   - Tabキーでのフォーカスナビゲーション
   - EnterキーとSpaceキーでの操作
   - フォーカス時の視覚的フィードバック

4. ✅ スクリーンリーダーで適切に情報が伝わる
   - 適切なaria-labelの追加
   - セマンティックなHTML構造
   - 状態変更の通知

## 変更されたファイル

- `apps/web/src/components/todo/todo-card.tsx`

## 次のステップ

1. ユーザーテストの実施
   - キーボード操作の使いやすさ
   - アニメーションの適切さ
   - ダークモードでの視認性

2. パフォーマンスの検証
   - アニメーションの負荷
   - レンダリングの最適化

3. 追加の改善案
   - タスク完了時の音声フィードバック
   - 完了タスクのフィルタリング機能
   - 一括完了機能 