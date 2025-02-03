# UIテストのガイドライン

## 基本原則

1. **UIの振る舞いに焦点を当てる**
   - ユーザーが見える動作をテスト
   - 実装の詳細には依存しない
   - 内部状態ではなく、表示される結果を検証

2. **環境依存を避ける**
   - 現在時刻などの環境依存を排除
   - `vi.useFakeTimers()`で時間を制御
   - テストデータは固定値を使用

3. **テストの意図を明確に**
   - テスト名は日本語で記述
   - 期待される動作を明確に
   - コメントで意図を補足

## 具体例

### 良い例：環境に依存しないテスト

```typescript
test('期限切れの日付は赤字で表示される', () => {
  // 2024-03-01を基準日として、その前日を期限切れとする
  const baseDate = new Date('2024-03-01');
  const pastDate = new Date('2024-02-29');
  
  vi.useFakeTimers();
  vi.setSystemTime(baseDate);

  render(<TodoItem title="Test Todo" date={pastDate} priority="medium" />);
  const dateElement = screen.getByText('2024/02/29');
  expect(dateElement).toHaveClass('text-red-500');

  vi.useRealTimers();
});
```

### 悪い例：環境に依存するテスト

```typescript
test('期限切れの日付は赤字で表示される', () => {
  const pastDate = subDays(new Date(), 1);  // 実行時の時刻に依存
  render(<TodoItem title="Test Todo" date={pastDate} priority="medium" />);
  const dateElement = screen.getByText(format(pastDate, 'yyyy/MM/dd'));
  expect(dateElement).toHaveClass('text-red-500');
});
```

## テストの構造

1. **準備（Arrange）**
   - テストデータの準備
   - 環境の設定（時刻の固定など）
   - コンポーネントのレンダリング

2. **実行（Act）**
   - ユーザーの操作を実行
   - イベントの発火
   - 状態の変更

3. **検証（Assert）**
   - 表示の確認
   - クラスの検証
   - コールバックの呼び出し確認

4. **後片付け（Cleanup）**
   - 環境設定の復元
   - タイマーのリセット
   - モックのクリア

## モックの使用

1. **必要最小限のモック**
   - 実際の実装を優先
   - 環境依存の部分のみモック
   - 複雑なモックは避ける

2. **UIテストでのモック**
   - 日付や時刻の制御
   - ネットワークリクエスト
   - ブラウザAPIの一部

## アクセシビリティ

1. **役割の検証**
   - `getByRole`の使用
   - 適切なARIAラベル
   - キーボード操作

2. **表示の確認**
   - テキストの可視性
   - 色のコントラスト
   - 状態の表示

## エラーハンドリング

1. **ユーザー体験の検証**
   - エラー状態の表示
   - 回復可能な状態への遷移
   - フィードバックの確認

2. **バリデーション**
   - 無効な入力の処理
   - エラーメッセージの表示
   - 入力制限の確認 