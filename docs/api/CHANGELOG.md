# API変更履歴

## [Unreleased]

### 追加
- Todo更新エンドポイント（`todo.update`）
  - タイトルと説明の更新が可能
  - 両方のフィールドはオプショナル
- Todoステータス変更エンドポイント（`todo.changeStatus`）
  - 完了（complete）とキャンセル（cancel）の状態変更が可能
  - 既に同じステータスの場合はエラーを返す

## [0.1.0] - 2024-03-21

### 追加
- Todo作成エンドポイント（`todo.create`）
- Todo取得エンドポイント（`todo.findById`）
- Todo一覧取得エンドポイント（`todo.findAll`）
- Todo削除エンドポイント（`todo.delete`）

### 変更
なし

### 削除
なし 