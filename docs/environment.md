# 環境変数の設定

## 環境変数ファイル

本プロジェクトでは、以下の環境変数ファイルを使用します：

- `.env.development` - 開発環境の共有設定（Git管理対象）
- `.env.development.local` - 開発環境の個人設定（Git管理対象外）
- `.env.test` - テスト環境用（Git管理対象）
- `.env.production` - 本番環境用（Git管理対象外）
- `.env` - 個人の設定用（Git管理対象外）
- `.env.example` - 設定例（Git管理対象）

## データベースの設定

各環境で異なるデータベースファイルを使用します：

```plaintext
# 開発環境
DATABASE_URL="file:./dev.db"

# 開発環境（個人設定）
DATABASE_URL="file:./dev.db"

# テスト環境
DATABASE_URL="file:./test.db"

# 本番環境
DATABASE_URL="file:./prod.db"
```

## Git管理

`.gitignore`で以下のように設定：

```plaintext
# データベースファイル
*.db
*.db-journal

# 環境変数ファイル
.env
.env.*
.env.*.local
!.env.example
!.env.test
!.env.development
```

- データベースファイルは全て管理対象外
- 個人設定（`.env.*.local`）は管理対象外
- 開発環境とテスト環境の設定は共有するため管理対象
- 本番環境の設定は機密情報を含むため管理対象外 