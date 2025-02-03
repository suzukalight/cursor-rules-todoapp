# Todo優先度と期限日機能の実装

## 概要

Todoアイテムに優先度と期限日の機能を追加しました。

## 機能詳細

### 優先度（Priority）

- 3段階の優先度を設定可能
  - 高（high）: 赤色で表示
  - 中（medium）: 黄色で表示
  - 低（low）: 青色で表示
- デフォルト値は「中」
- アイコンクリックで変更可能

### 期限日（Due Date）

- カレンダーから日付を選択可能
- 期限切れの場合は警告表示
- 期限日の削除も可能
- 完了済みのタスクは期限切れ警告を表示しない

## 技術的な変更点

### ドメイン層

1. `Todo`エンティティの拡張
   - `priority`フィールドの追加（`TodoPriority`型）
   - `dueDate`フィールドの追加（`Date | undefined`型）
   - 更新用メソッドの追加（`updatePriority`, `updateDueDate`）

2. リポジトリインターフェースの拡張
   - `updatePriority`メソッドの追加
   - `updateDueDate`メソッドの追加

### インフラ層

1. Prismaスキーマの更新
   ```prisma
   model Todo {
     // 既存のフィールド
     priority    String    @default("medium")
     dueDate     DateTime?
     // 他のフィールド
   }
   ```

2. `TodoMapper`の更新
   - Prismaモデルと`Todo`エンティティ間のマッピング処理を追加

### UI層

1. `TodoCard`コンポーネントの拡張
   - 優先度選択UI（`Select`コンポーネント）
   - 期限日選択UI（`DatePicker`コンポーネント）
   - 期限切れ警告表示

2. `TodoList`コンポーネントの更新
   - 新しいコールバックの追加（`onUpdatePriority`, `onUpdateDueDate`）

## テスト

1. `TodoCard`コンポーネントのテスト
   - 優先度の表示と変更
   - 期限日の表示と変更
   - 期限切れ警告の表示

2. `TodoList`コンポーネントのテスト
   - 新しいコールバックの検証
   - 各Todoカードへの適切なプロパティ受け渡し

## アクセシビリティ

- 優先度選択: アイコンに適切なaria-labelを設定
- 期限日選択: カレンダーコンポーネントにキーボード操作を実装
- 警告表示: アイコンと説明文を適切に関連付け 