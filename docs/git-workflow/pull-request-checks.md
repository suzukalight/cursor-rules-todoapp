# プルリクエスト生成前のチェック

## チェックリスト

1. コード品質チェック
   ```bash
   pnpm fix  # 自動修正を含む包括的なチェック
   ```
   - `biome:check:write`: コードの自動フォーマットと修正
   - `typecheck`: 型チェック

2. テストの実行
   ```bash
   pnpm test        # ユニットテスト
   pnpm test:e2e    # E2Eテスト
   ```

3. CIチェックの実行（オプション）
   ```bash
   pnpm check:ci  # CI環境と同じチェックを実行
   ```

## エラー対応手順

1. エラーの種類を特定
   ```bash
   # CIの実行結果の確認
   gh run list --limit 1                     # 最新のCI実行結果を確認
   gh run view {id}                         # 特定のCI実行の詳細を確認
   gh run view --log-failed --job={job_id}  # 失敗したジョブのログを確認
   ```

2. エラーの修正
   - 型エラー、リントエラー、テストエラーなど、エラーの種類に応じて対応
   - 修正後は必ず `pnpm fix` を実行して、新たな問題が発生していないことを確認

3. プッシュ前の最終確認
   ```bash
   pnpm fix  # 必ず実行
   git add .
   git commit -m "fix: エラーの修正内容"
   git push
   ```

## レビュープロセス

1. レビューコメントの確認
   ```bash
   gh pr list                                # PRの一覧を確認
   gh pr view {pr_number}                    # PRの詳細を確認
   gh pr checks {pr_number}                  # CIの結果を確認
   gh pr comments {pr_number}                # レビューコメントを確認
   ```

2. レビューコメントへの対応
   - 指摘された箇所を修正
   - 修正後は必ず `pnpm fix` を実行
   - 修正内容をコミット前に確認
   ```bash
   git diff  # 変更内容の確認
   pnpm fix  # 必ず実行
   ```

3. レビュー完了条件
   - すべてのレビューコメントに対応完了
   - `pnpm fix` が正常終了
   - CIが成功
   - レビュアーからLGTMを取得

## 注意事項

1. 自動修正の確認
   - `pnpm fix` による自動修正後は、変更内容を必ず確認
   - 意図しない修正が含まれていないことを確認

2. コミット前のチェック
   - 必ず `pnpm fix` を実行してからコミット
   - 新たな問題が発生していないことを確認

3. プッシュ前の確認
   - 最後に必ず `pnpm fix` を実行
   - すべてのチェックが通過することを確認

4. CI環境との整合性
   - ローカルで `pnpm check:ci` を実行して、CI環境と同じ条件でチェック可能
   - CI失敗時は、同じコマンドでローカルで再現して確認

## 関連ドキュメント

- [Git ワークフロー](./git-workflow.md)
- [コーディング規約](./coding-standards.md)
- [Biome設定](./biome-configuration.md) 