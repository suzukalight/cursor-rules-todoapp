# TodoItem 期限設定機能追加

## 変更内容
- TodoItemProps に onDueDateChange プロパティを追加 (型: (date: Date | null) => void)
- 既存の date プロパティを due date として活用し、期限表示部を常に表示するように変更
  - 期限が設定されている場合は 'yyyy/MM/dd' 形式で表示
  - 期限が未設定の場合は「期限なし」を薄く表示 (opacity-50)
- 期限表示箇所をクリックすると、カレンダー (input type="date") が表示され、日付を選択可能に実装
- 日付選択時に onDueDateChange を呼び出し、上位コンポーネントへ更新通知
- 編集状態管理のために React の useState を使用し、さらに useRef と useEffect を活用してフォーカス制御を実装

## テスト情報
- 適用前にローカルでテストおよび lint チェックを実施済み

## その他
- 本実装は既存の TodoItem コンポーネントの拡張として実装し、既存機能への影響はありません。 