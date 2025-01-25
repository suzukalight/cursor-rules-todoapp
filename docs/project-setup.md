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
- Vitest

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
  "tasks": {
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
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

### 2. 共通パッケージ（@cursor-rules-todoapp/common）

#### 型定義
- Todo関連の型定義（`Todo`, `TodoStatus`, `CreateTodoInput`, `UpdateTodoInput`）
- 定数（`TODO_STATUS`, `TODO_STATUS_LABEL`）

#### テスト
- Vitestを使用した単体テスト
- 定数のテストケース

### 3. データベースパッケージ（@cursor-rules-todoapp/db）

#### Prismaの設定
```prisma
model Todo {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      String    @default("pending")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  completedAt DateTime?

  @@map("todos")
}
```

#### リポジトリパターン
- TodoRepositoryの実装
- CRUDメソッドの提供
- 単体テストの実装

#### テスト環境
- テスト用データベースの設定
- テストケースの実装
- カバレッジレポートの生成

### 4. 設定パッケージ（@cursor-rules-todoapp/configs）

#### TypeScript設定
- base.json: 基本設定
- nextjs.json: Next.js用設定
- react-library.json: Reactライブラリ用設定

#### Tailwind設定
- 基本設定
- Shadcn/UI用の設定
- アニメーション設定

## 次のステップ

1. UIパッケージの設定
   - Shadcn/UIコンポーネント
   - カスタムコンポーネント

2. TRPCの設定
   - APIルーターの設定
   - クライアント設定

3. フロントエンドの実装
   - ページの作成
   - コンポーネントの実装
   - APIとの連携 