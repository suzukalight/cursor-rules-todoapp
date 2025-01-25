# プロジェクトセットアップ

## 技術スタック

### 一般事項
- TypeScript
- Node.js
- Monorepo (pnpm workspace + TurboRepo)

### フロントエンド
- React
- Next.js App Router
- Tailwind CSS
- Shadcn/UI

### バックエンド
- TRPC
- Zod
- Prisma
- SQLite

### 開発ツール
- pnpm
- Biome
- TurboRepo

## モノレポ構成

```
root
├── apps                  # アプリケーション
│ ├── web                 # ウェブアプリケーション
│ │ ├── src
│ │ │ ├── app
│ │ │ │ ├── api         # API
│ │ │ │ └── ...         # 各種ページ
│ │ │ ├── components    # コンポーネント
│ │ │ ├── hooks         # フック
│ │ │ └── utils         # ユーティリティ
├── packages             # パッケージ
│ ├── ui                # UI
│ ├── db                # DB
│ ├── configs           # 各種設定ファイル
│ └── common            # ユーティリティ
└── docs                # ドキュメント
```

## 初期設定手順

### 1. モノレポの設定

#### pnpm workspace
`pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

#### TurboRepo
`turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "format": {
      "outputs": ["**/node_modules/.cache/.prettiercache"],
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 2. Next.jsアプリケーション

`apps/web`ディレクトリに以下の設定で作成:
- TypeScript
- Tailwind CSS
- App Router
- Import Alias (@/*)

### 3. Biomeの設定

#### インストール
```bash
pnpm add -D -w @biomejs/biome
```

#### 設定ファイル
`biome.json`:
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  }
}
```

#### スクリプト
```json
{
  "scripts": {
    "biome:check": "biome check .",
    "biome:format": "biome format . --write",
    "biome:lint": "biome lint ."
  }
}
```

## 次のステップ

1. 共通パッケージの設定
   - packages/ui
   - packages/db
   - packages/configs
   - packages/common

2. TRPCの設定
   - APIルーターの設定
   - クライアント設定

3. Prismaの設定
   - スキーマ設計
   - マイグレーション
   - シード 