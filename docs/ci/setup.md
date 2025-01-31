# CI構築ドキュメント

## 概要

このプロジェクトでは、GitHub Actionsを使用してCIを構築しています。以下の機能を実装しています：

- ビルド検証
- リンター検証
- ユニットテスト実行
- E2Eテスト実行
- キャッシュ最適化

## ワークフロー設定

### トリガー

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

- `main` ブランチへのプッシュ
- `main` ブランチへのプルリクエスト

### 環境変数

```yaml
env:
  DATABASE_URL: "file:./test.db"
  NODE_ENV: "test"
  DEBUG: "pw:api"
```

- `DATABASE_URL`: テスト用のSQLiteデータベースパス
- `NODE_ENV`: テスト環境を示す値
- `DEBUG`: Playwrightのデバッグログ設定

## キャッシュ設定

### pnpmキャッシュ

```yaml
- name: Get pnpm store directory
  shell: bash
  run: |
    echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

- name: Setup pnpm cache
  uses: actions/cache@v3
  with:
    path: ${{ env.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
```

### Next.jsキャッシュ

```yaml
- name: Setup Next.js cache
  uses: actions/cache@v3
  with:
    path: |
      apps/web/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ hashFiles('apps/web/**/*.ts', 'apps/web/**/*.tsx') }}
```

### Turboキャッシュ

```yaml
- name: Setup Turbo cache
  uses: actions/cache@v3
  with:
    path: .turbo
    key: ${{ runner.os }}-turbo-${{ github.sha }}
```

### Playwrightブラウザキャッシュ

```yaml
- name: Setup Playwright browsers cache
  uses: actions/cache@v3
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ hashFiles('**/pnpm-lock.yaml') }}
```

## テスト実行

### E2Eテスト

```yaml
- name: Start Web Server
  run: pnpm dev &
  env:
    CI: true
    PORT: 3000
    WAIT_ON_TIMEOUT: 60000

- name: Wait for Web Server
  run: |
    npx wait-on http://localhost:3000 -t 60000

- name: E2E Tests
  run: pnpm test:e2e
  env:
    CI: true
    DEBUG: pw:api,pw:protocol*
```

1. Webサーバーをバックグラウンドで起動
2. サーバーの起動完了を待機
3. E2Eテストを実行

### テスト結果の保存

```yaml
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: apps/e2e/playwright-report/
    retention-days: 30
```

## 注意事項

### Playwrightの設定

- CIでは自動的にヘッドレスモードで実行
- `headless: !!process.env.CI` の設定により、CI環境でのみヘッドレスモードを有効化

### 既知の警告

1. Radix UIの `use client` ディレクティブ警告
   - バンドル時に無視される警告
   - アプリケーションの動作には影響なし

2. Storybookのチャンクサイズ警告
   - 一部のチャンクが500KB以上
   - 必要に応じて以下の対応を検討：
     - 動的インポートによるコード分割
     - `build.rollupOptions.output.manualChunks` の設定
     - `build.chunkSizeWarningLimit` の調整

## パフォーマンス

- ビルド時間: 約9秒
- テスト実行時間: 約8秒
- キャッシュヒット率: 約83%（5/6タスク）

## トラブルシューティング

### E2Eテストが失敗する場合

1. Webサーバーの起動確認
   - `pnpm dev` のログを確認
   - `wait-on` のタイムアウト設定を確認

2. Playwrightの設定確認
   - ヘッドレスモードの設定
   - ブラウザのインストール状態

3. テスト環境の確認
   - 環境変数の設定
   - データベースの初期化状態 