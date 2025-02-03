# 未使用のインポート削除

## 概要

`apps/web/src/app/page.tsx` から未使用の `Result` 型のインポートを削除しました。
また、Biomeの設定を更新し、プロジェクト全体の未使用インポートを検出・修正しました。

## 変更内容

### 個別の修正
- `apps/web/src/app/page.tsx` から未使用の `Result` 型のインポートを削除
  - `import type { Result } from '@cursor-rules-todoapp/common';` を削除

### Biomeの設定更新
- `biome.json` に `noUnusedImports` ルールを追加
  ```json
  "correctness": {
    "noUnusedVariables": "error",
    "noUnusedImports": "error"
  }
  ```

### プロジェクト全体の修正
- Biomeの自動修正機能を使用して、13個のファイルの未使用インポートを修正
- 主な修正対象：
  - テストファイルの未使用の `Result` 型インポート
  - コンポーネントファイルの未使用の React インポート
  - その他、未使用の型や関数のインポート

## 影響範囲

- ビルドエラーの解消
- コードの可読性向上
- バンドルサイズの最適化（わずかですが）
- Biomeの静的解析の強化

## 確認事項

- [x] ビルドが正常に完了することを確認
- [x] 型エラーが発生していないことを確認
- [x] 既存の機能に影響がないことを確認
- [x] Biomeの設定が正しく機能していることを確認

## 関連する変更

- `biome.json` の更新
- プロジェクト全体の未使用インポートの削除

## 技術的な注意点

1. Next.jsのESLint設定とBiomeの設定の関係
   - Next.jsは独自のESLint設定を持っており、型の未使用検出に影響を与える可能性があります
   - Biomeの設定を適切に行うことで、より厳密な静的解析が可能になります

2. 型のインポートの扱い
   - `import type` の場合、一部のツールでは未使用として検出されにくい場合があります
   - Biomeの `noUnusedImports` ルールを使用することで、型の未使用も適切に検出できます 