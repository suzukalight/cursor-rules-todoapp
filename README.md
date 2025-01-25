# Cursor Rules Todo App

Next.js + TRPCを使用したモノレポ構成のTodoアプリケーション

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

### インストール

```bash
# 依存関係のインストール
pnpm install

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

## プロジェクト構成

詳細は [プロジェクトセットアップ](./docs/project-setup.md) を参照してください。

## ライセンス

MIT 

## Testing

各コンポーネントのテストについては、以下のドキュメントを参照してください：

- [Toast Component Testing Guide](docs/testing/toast.md) - Toast コンポーネントのテストに関する特別な注意事項 