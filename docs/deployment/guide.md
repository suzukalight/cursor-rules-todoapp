# デプロイメントガイド

## 概要

このガイドでは、アプリケーションのデプロイメントプロセス、環境設定、CI/CD設定について説明します。

## デプロイメントフロー

### 1. 環境構成

```plaintext
開発環境（Development）
└── テスト環境（Staging）
    └── 本番環境（Production）
```

### 2. ブランチ戦略

```plaintext
main
├── develop
│   └── feature/*
└── hotfix/*
```

## 環境設定

### 1. 環境変数

```bash
# .env.example
# アプリケーション設定
NODE_ENV=development
PORT=3000

# データベース設定
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# API設定
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001

# 認証設定
JWT_SECRET=your-jwt-secret

# モニタリング設定
MONITORING_ENDPOINT=http://monitoring-server
```

### 2. 環境別の設定

```typescript
// config/environment.ts
type Environment = 'development' | 'staging' | 'production';

interface EnvironmentConfig {
  apiUrl: string;
  database: {
    url: string;
    poolSize: number;
  };
  cache: {
    ttl: number;
    maxSize: number;
  };
}

const config: Record<Environment, EnvironmentConfig> = {
  development: {
    apiUrl: 'http://localhost:3001',
    database: {
      url: process.env.DATABASE_URL,
      poolSize: 5,
    },
    cache: {
      ttl: 60,
      maxSize: 100,
    },
  },
  staging: {
    apiUrl: 'https://api.staging.example.com',
    database: {
      url: process.env.DATABASE_URL,
      poolSize: 10,
    },
    cache: {
      ttl: 300,
      maxSize: 500,
    },
  },
  production: {
    apiUrl: 'https://api.example.com',
    database: {
      url: process.env.DATABASE_URL,
      poolSize: 20,
    },
    cache: {
      ttl: 600,
      maxSize: 1000,
    },
  },
};
```

## CI/CD設定

### 1. GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v2
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Staging
        run: |
          echo "Deploying to staging..."
          # デプロイスクリプト

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Production
        run: |
          echo "Deploying to production..."
          # デプロイスクリプト
```

### 2. デプロイスクリプト

```bash
#!/bin/bash
# scripts/deploy.sh

# 環境変数の設定
export NODE_ENV=$1
export DATABASE_URL=$2

# 依存関係のインストール
pnpm install

# データベースマイグレーション
pnpm prisma migrate deploy

# アプリケーションのビルド
pnpm build

# プロセスマネージャーの再起動
pm2 reload ecosystem.config.js --env $NODE_ENV
```

## デプロイ手順

### 1. 事前準備

```bash
# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env
vim .env  # 環境に応じて編集

# データベースマイグレーション
pnpm prisma migrate deploy
```

### 2. ビルドとデプロイ

```bash
# アプリケーションのビルド
pnpm build

# プロセスマネージャーの設定
pnpm pm2 ecosystem

# アプリケーションの起動
pnpm start:prod
```

## ロールバック手順

### 1. バージョン管理

```bash
# 現在のバージョンの保存
cp -r dist dist_backup

# データベースのバックアップ
pg_dump -U user dbname > backup.sql
```

### 2. ロールバック実行

```bash
# アプリケーションの停止
pnpm pm2 stop all

# 前バージョンの復元
rm -rf dist
mv dist_backup dist

# データベースのロールバック
psql -U user dbname < backup.sql

# アプリケーションの再起動
pnpm pm2 start all
```

## モニタリング設定

### 1. ヘルスチェック

```typescript
// apps/api/src/health.ts
import { Router } from 'express';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    // データベース接続確認
    await prisma.$queryRaw`SELECT 1`;
    
    // キャッシュ接続確認
    await cache.ping();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});
```

### 2. メトリクス収集

```typescript
// apps/api/src/metrics.ts
import { collectDefaultMetrics, Registry } from 'prom-client';

const register = new Registry();
collectDefaultMetrics({ register });

// カスタムメトリクス
const httpRequestDuration = new register.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
});

export { register, httpRequestDuration };
```

## セキュリティ設定

### 1. SSL/TLS設定

```typescript
// apps/api/src/server.ts
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('path/to/key.pem'),
  cert: fs.readFileSync('path/to/cert.pem'),
};

https.createServer(options, app).listen(443);
```

### 2. セキュリティヘッダー

```typescript
// apps/api/src/middleware/security.ts
import helmet from 'helmet';
import cors from 'cors';

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## トラブルシューティング

### 1. デプロイ失敗時

1. ログの確認
   ```bash
   pnpm pm2 logs
   ```

2. プロセスの状態確認
   ```bash
   pnpm pm2 status
   ```

3. システムリソースの確認
   ```bash
   df -h  # ディスク使用量
   free -m  # メモリ使用量
   top  # CPU使用率
   ```

### 2. パフォーマンス問題

1. モニタリングダッシュボードの確認
2. エラーログの分析
3. データベースクエリの最適化
4. キャッシュの確認 