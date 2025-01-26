# 開発スクリプトとツールの設定

## コマンド体系

各パッケージで統一された以下のコマンド体系を採用しています：

### 開発用コマンド

- `dev`: 開発サーバーの起動
  - APIサーバー: `tsx` による直接実行
  - Webアプリ: `next dev` による開発サーバー
  - UIパッケージ: `storybook dev` による開発環境

### ビルド用コマンド

- `build`: 本番用ビルド
  - 通常パッケージ: `tsup` によるビルド
  - UIパッケージ: `tsup` + `storybook build`
  - Webアプリ: `next build`

- `build:watch`: 開発用の差分ビルド監視
  - 全パッケージ: `tsup --watch` による監視ビルド

### テスト用コマンド

- `test`: テストの実行
- `test:watch`: テストの監視実行
- `test:coverage`: カバレッジレポートの生成

### リント・フォーマット

- `lint`: Biomeによるリント
- `format`: Biomeによるフォーマット

### その他

- `clean`: ビルド成果物とキャッシュの削除

## Turborepo設定

### タスク設定

```json
{
  "build": {
    "dependsOn": ["^build"],
    "outputs": ["dist/**", ".next/**"]
  },
  "build:watch": {
    "dependsOn": ["^build"],
    "persistent": true,
    "cache": false
  },
  "dev": {
    "persistent": true,
    "cache": false
  }
}
```

### 特徴

1. **依存関係の管理**
   - `build`: 依存パッケージのビルドを待機
   - `build:watch`: 依存パッケージのビルドを待機して監視
   - `dev`: 独立して起動（依存関係なし）

2. **キャッシュ戦略**
   - `build`: 成果物をキャッシュ
   - `build:watch`, `dev`: キャッシュなし（常に最新）

3. **永続性**
   - `build:watch`, `dev`: 永続的に実行
   - `build`: 一度きりの実行

## パッケージごとの特徴

### @cursor-rules-todoapp/api

```json
{
  "dev": "tsx src/index.ts",
  "build": "tsup",
  "build:watch": "tsup --watch"
}
```

- `tsx` による直接実行で高速な開発
- ビルドはCommonJS形式のみ

### @cursor-rules-todoapp/ui

```json
{
  "dev": "storybook dev -p 6006",
  "build": "tsup && storybook build",
  "build:watch": "tsup --watch"
}
```

- Storybookを開発環境として使用
- ビルド時にコンポーネントとStorybookの両方をビルド

### その他のパッケージ

```json
{
  "build": "tsup",
  "build:watch": "tsup --watch"
}
```

- ESMとCJSの両方をビルド
- 型定義ファイルも生成

## 開発フロー

1. **新規開発時**
   ```bash
   # UIコンポーネント開発
   cd packages/ui && pnpm dev  # Storybookが起動

   # APIサーバー開発
   cd apps/api && pnpm dev     # 開発サーバーが起動

   # Webアプリ開発
   cd apps/web && pnpm dev     # Next.js開発サーバーが起動
   ```

2. **ライブラリ開発時**
   ```bash
   # 該当パッケージで監視ビルドを実行
   cd packages/domain && pnpm build:watch
   ```

3. **テスト実行**
   ```bash
   # 単発実行
   pnpm test

   # 監視モード
   pnpm test:watch
   ```

## 注意事項

1. **開発サーバーの使い分け**
   - UIコンポーネント開発: Storybookを使用
   - その他: 各環境に適したdev-serverを使用

2. **ビルドの依存関係**
   - パッケージ間の依存がある場合は `build:watch` を使用
   - 独立した開発の場合は `dev` を使用

3. **環境変数**
   - `.env.local` ファイルは自動的にTurborepoの依存関係に含まれる
   - 環境変数の変更時は再起動が必要 