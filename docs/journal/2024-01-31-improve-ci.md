# CI改善作業 2024-01-31

## 作業内容

1. E2Eテストの安定化
   - Playwrightのヘッドレスモード設定を追加
   - CI環境でのみヘッドレスモードを有効化

2. Webサーバー起動の改善
   - バックグラウンドでのサーバー起動
   - `wait-on` による起動完了の待機

3. キャッシュ設定の最適化
   - pnpm
   - Next.js
   - Turbo
   - Playwrightブラウザ

## プルリクエスト

- PR #23: CIワークフローの改善
  - コミット: 
    - `fix: enable headless mode in CI environment`
    - `fix: start web server before e2e tests`
    - `fix: remove debug flag from e2e test command`

## 変更されたファイル

1. `.github/workflows/ci.yml`
   - E2Eテスト実行前のWebサーバー起動ステップを追加
   - デバッグフラグを削除

2. `apps/e2e/playwright.config.ts`
   - ヘッドレスモードの設定を追加

3. `docs/ci/setup.md`
   - CI構築に関するドキュメントを作成

## 次のステップ

1. 既知の警告への対応検討
   - Radix UIの `use client` ディレクティブ警告
   - Storybookのチャンクサイズ警告

2. パフォーマンス改善
   - ビルド時間の短縮
   - キャッシュヒット率の向上

3. テスト改善
   - テストカバレッジの向上
   - テスト実行時間の短縮 