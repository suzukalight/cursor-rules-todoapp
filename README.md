# .cursorrules だけでアプリを作成できるか？

[.cursorrules](./.cursorrules) と [Cursor Composer Agent](https://www.cursor.com/features) だけで TODO アプリを作成できるかを検証するためのプロジェクトです。

すべてのコードは Composer Agent とのやりとりのみで生成されています。私が書いたのは `.cursorrules` と `README.md` の序文のみで、それ以外のコードやドキュメントはすべて Composer Agent が生成しています。

## 技術スタック

- TypeScript
- Next.js (App Router)
- TRPC
- Prisma
- Tailwind CSS
- Shadcn/UI

## 開発環境のセットアップ

### 必要要件

- Node.js 18.0.0以上
- pnpm 8.9.0以上
- SQLite（開発環境用）

### データベースのセットアップ

```bash
# repo-sqliteディレクトリに移動
cd packages/repo-sqlite

# 環境変数の設定
cp .env.example .env

# データベースのセットアップ
pnpm db:generate  # Prismaクライアントの生成
pnpm db:migrate   # マイグレーションの実行
pnpm db:reset    # （必要な場合）データベースのリセット

# プロジェクトルートに戻る
cd ../..
```

### インストールと起動

```bash
# 依存関係のインストール
pnpm install

# パッケージのビルド（重要）
pnpm build

# 開発サーバーの起動
pnpm dev
```

### 開発用コマンド

```bash
# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# リント
pnpm biome:lint

# フォーマット
pnpm biome:format

# 型チェック
pnpm type-check
```

### トラブルシューティング

よくある問題と解決方法：

1. `pnpm install`でエラーが発生する場合
   - Node.jsのバージョンを確認
   - pnpmのキャッシュをクリア: `pnpm store prune`

2. データベース関連のエラー
   - `.env`ファイルの`DATABASE_URL`を確認
   - `prisma/dev.db`を削除して再マイグレーション

3. ポートが既に使用されている場合
   - `.env`の`PORT`を変更
   - 既存のプロセスを終了: `lsof -i :3000`

## プロジェクト構成

詳細は [プロジェクトセットアップ](./docs/project-setup.md) を参照してください。

## ライセンス

MIT

## Testing

各コンポーネントのテストについては、以下のドキュメントを参照してください：

- [Toast Component Testing Guide](docs/testing/toast.md) - Toast コンポーネントのテストに関する特別な注意事項
- [Dialog Component Testing Guide](docs/testing/dialog.md) - Dialog コンポーネントのテストに関する特別な注意事項と警告の説明
