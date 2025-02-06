# フィルタ機能の改善

## 概要

フィルタを「すべて」に戻す操作がURLには反映されるが画面上には反映されない問題を修正しました。

## 変更内容

### 状態管理の改善

1. URLパラメータと状態の同期処理を改善
   - 状態の初期値を直接指定
   - URLパラメータからの読み込みを`useEffect`で一元管理
   - `router.replace`を使用してブラウザの履歴スタックを最適化

2. フィルタの状態更新ロジックの改善
   - URLパラメータと状態の同期を確実に実行
   - 無限ループの可能性を排除

### コードの変更点

```typescript
// URLパラメータを更新する関数
const updateSearchParams = useCallback(
  (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.replace(`${pathname}?${params.toString()}`);
  },
  [pathname, router, searchParams]
);

// URLパラメータの変更を監視して状態を更新
useEffect(() => {
  const statusParam = searchParams.get('status') as TodoStatus | 'all';
  const priorityParam = searchParams.get('priority') as TodoPriority | 'all';
  const queryParam = searchParams.get('q');
  const viewParam = searchParams.get('view') as ViewMode;

  setStatus(statusParam || 'all');
  setPriority(priorityParam || 'all');
  setSearchQuery(queryParam || '');
  setViewMode(viewParam || 'grouped');
}, [searchParams]);
```

## 動作確認項目

- [x] フィルタを「高」から「すべて」に変更
- [x] フィルタを「未着手」から「すべて」に変更
- [x] URLパラメータの正しい更新
- [x] 画面表示の正しい更新
- [x] ブラウザの戻る/進む操作での正しい動作

## 技術的な詳細

1. 状態の初期化
   - 状態の初期値を直接指定することで、初期レンダリング時の不整合を防止
   - URLパラメータからの読み込みは`useEffect`で一元管理

2. URLパラメータの管理
   - `router.replace`を使用して履歴スタックを最適化
   - パラメータの追加/削除を適切に管理

3. 状態の同期
   - URLパラメータの変更を監視して状態を更新
   - 状態の変更時にURLパラメータを更新

## 今後の課題

- パフォーマンスの最適化
- エッジケースのテスト強化
- ユーザビリティの向上 