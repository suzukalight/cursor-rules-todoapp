# インフラストラクチャ設定ガイド

## 概要

このガイドでは、アプリケーションのインフラストラクチャ設定、リソース要件、スケーリング戦略について説明します。

## システム要件

### 1. ハードウェア要件

**開発環境**:
- CPU: 2コア以上
- メモリ: 4GB以上
- ストレージ: 20GB以上

**本番環境**:
- CPU: 4コア以上
- メモリ: 8GB以上
- ストレージ: 50GB以上（SSD推奨）

### 2. ソフトウェア要件

```plaintext
- Node.js: 20.x
- PostgreSQL: 15.x
- Redis: 7.x
- Nginx: 1.24.x
- PM2: 5.x
```

## アーキテクチャ構成

### 1. コンポーネント構成

```plaintext
[クライアント]
     ↓
[ロードバランサー (Nginx)]
     ↓
[アプリケーションサーバー (Next.js)]
     ↓
[APIサーバー (tRPC)]
     ↓
[データベース (PostgreSQL)]
     ↓
[キャッシュ (Redis)]
```

### 2. ネットワーク構成

```plaintext
Internet
   ↓
[DMZ]
 ├── ロードバランサー (80/443)
 └── Bastion Host (22)
   ↓
[アプリケーション層]
 ├── Webサーバー (3000)
 └── APIサーバー (3001)
   ↓
[データ層]
 ├── PostgreSQL (5432)
 └── Redis (6379)
```

## サーバー設定

### 1. Nginx設定

```nginx
# /etc/nginx/conf.d/app.conf
upstream nextjs_upstream {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name example.com;

    # SSL設定
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # セキュリティヘッダー
    add_header Strict-Transport-Security "max-age=31536000";
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";

    # プロキシ設定
    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 静的ファイル
    location /_next/static {
        alias /path/to/app/.next/static;
        expires 365d;
        access_log off;
    }
}
```

### 2. PostgreSQL設定

```ini
# postgresql.conf
max_connections = 100
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 512MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 20MB
min_wal_size = 1GB
max_wal_size = 4GB
```

### 3. Redis設定

```ini
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
appendonly yes
appendfsync everysec
```

## スケーリング設定

### 1. 水平スケーリング

```yaml
# docker-compose.scale.yml
version: '3'

services:
  app:
    image: app:latest
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    ports:
      - "3000-3002:3000"

  api:
    image: api:latest
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    ports:
      - "3001-3002:3001"
```

### 2. 垂直スケーリング

```bash
# PM2スケーリング
pm2 scale app +1  # インスタンス数を増やす
pm2 scale app -1  # インスタンス数を減らす
```

## バックアップ設定

### 1. データベースバックアップ

```bash
#!/bin/bash
# scripts/backup.sh

# バックアップ先ディレクトリ
BACKUP_DIR="/backup/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)

# バックアップ実行
pg_dump -U postgres -d dbname -F c > $BACKUP_DIR/backup_$DATE.dump

# 30日以上前のバックアップを削除
find $BACKUP_DIR -name "backup_*.dump" -mtime +30 -delete
```

### 2. ログローテーション

```conf
# /etc/logrotate.d/app
/var/log/app/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        /usr/bin/pm2 reload all
    endscript
}
```

## モニタリング設定

### 1. Prometheusの設定

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'app'
    static_configs:
      - targets: ['localhost:3000']

  - job_name: 'api'
    static_configs:
      - targets: ['localhost:3001']
```

### 2. Grafanaダッシュボード

```json
{
  "dashboard": {
    "panels": [
      {
        "title": "CPU使用率",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "rate(node_cpu_seconds_total{mode='user'}[1m])"
          }
        ]
      },
      {
        "title": "メモリ使用率",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "node_memory_MemUsed_bytes / node_memory_MemTotal_bytes * 100"
          }
        ]
      }
    ]
  }
}
```

## 障害対策

### 1. フェイルオーバー設定

```yaml
# haproxy.cfg
frontend http-in
    bind *:80
    default_backend app-backend

backend app-backend
    balance roundrobin
    option httpchk GET /health
    server app1 app1:3000 check
    server app2 app2:3000 check backup
```

### 2. 自動復旧設定

```json
// ecosystem.config.js
{
  "apps": [{
    "name": "app",
    "script": "dist/main.js",
    "instances": "max",
    "exec_mode": "cluster",
    "autorestart": true,
    "max_restarts": 10,
    "restart_delay": 4000,
    "exp_backoff_restart_delay": 100
  }]
}
```

## セキュリティ設定

### 1. ファイアウォール設定

```bash
# UFW設定
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 2. SELinux設定

```bash
# SELinux設定
semanage port -a -t http_port_t -p tcp 3000
semanage port -a -t http_port_t -p tcp 3001
```

## パフォーマンスチューニング

### 1. システムチューニング

```bash
# /etc/sysctl.conf
# ネットワークチューニング
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.core.netdev_max_backlog = 65535

# メモリチューニング
vm.swappiness = 10
vm.dirty_ratio = 60
vm.dirty_background_ratio = 2
```

### 2. Node.jsチューニング

```bash
# 環境変数設定
export NODE_OPTIONS="--max-old-space-size=4096"
export UV_THREADPOOL_SIZE=8
``` 