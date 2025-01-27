# 2025-01-27: ダークモードとフィルターUIの改善

## 課題

現在のUIに関する以下の問題点が指摘されました：

1. タスク検索バーがdarkmodeから反転していて操作できない
2. フィルタが全く視認できない
3. タスクの編集モードへ入る方法が不明瞭
4. DONEにしても特に視覚的な変化がない
5. 新規作成はタスク一覧のところでも行えるべき
6. 締め切りがわからない

## 対応内容

### 1. ダークモード対応の改善

1. `ThemeProvider`と`ThemeToggle`コンポーネントの作成
   - ダークモードの状態管理
   - テーマ切り替えボタンの実装
   - LocalStorageを使用した設定の永続化

2. 検索バーとフィルターのダークモード対応
   - 背景色と文字色の調整
   - コントラスト比の改善
   - フォーカス時の視認性向上

### 2. フィルターUIの改善

1. ドロップダウンメニューの視認性向上
   - パディングとマージンの調整
   - 選択状態の明確化
   - ホバー時の視覚的フィードバック

2. チェックマークと文字の位置調整
   - チェックマークの絶対位置指定
   - テキストとの間隔の最適化
   - 選択状態の視覚的表現の改善

## 実装の詳細

### ThemeProviderの実装
```typescript
export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // ... 省略 ...
}
```

### フィルターUIの改善
```typescript
<SelectContent 
  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-w-[180px]"
  align="start"
  sideOffset={4}
>
  <div className="py-1">
    <SelectItem className="relative rounded-md text-gray-900 dark:text-gray-100 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-600 py-2.5" value="all">
      <span className="absolute left-1.5">
        <span className="sr-only">選択済み</span>
      </span>
      <span className="pl-5">すべて</span>
    </SelectItem>
    // ... 他のアイテム ...
  </div>
</SelectContent>
```

## 結果

1. ダークモード対応が完了し、検索バーとフィルターの視認性が向上
2. フィルターUIのレイアウトが改善され、使いやすくなった
3. チェックマークと文字の位置関係が適切になった

## 次のステップ

以下のタスクに着手予定：
- タスクの完了状態の視覚的表現
- 新規タスク作成のUX改善
- 締切日の表示改善 