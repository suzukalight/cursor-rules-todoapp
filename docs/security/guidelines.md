# セキュリティガイドライン

## 概要

このガイドラインでは、アプリケーションのセキュリティ要件、実装方針、運用ポリシーについて説明します。

## セキュリティ要件

### 1. 認証・認可

**認証要件**:
- パスワードの最小長: 12文字
- パスワードの複雑性: 大文字、小文字、数字、特殊文字を含む
- アカウントロック: 5回の失敗で30分ロック
- セッション有効期限: 24時間
- 多要素認証: 必須（本番環境）

**認可要件**:
- 最小権限の原則に基づくRBACの実装
- リソースへのアクセス制御
- 監査ログの記録

### 2. データ保護

**保管データ**:
- 個人情報の暗号化（AES-256）
- パスワードのハッシュ化（Argon2）
- 機密情報の暗号化（RSA-2048）

**通信データ**:
- TLS 1.3の使用
- 証明書の自動更新
- HTTP/2の有効化

## 実装ガイドライン

### 1. 認証実装

```typescript
// apps/api/src/auth/password.ts
import * as argon2 from 'argon2';

export class PasswordService {
  // パスワードのハッシュ化
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }

  // パスワードの検証
  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  // パスワードの強度チェック
  validatePasswordStrength(password: string): boolean {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  }
}
```

### 2. JWTの実装

```typescript
// apps/api/src/auth/jwt.ts
import { sign, verify } from 'jsonwebtoken';

export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET!;
    this.expiresIn = '24h';
  }

  // トークンの生成
  generateToken(payload: any): string {
    return sign(payload, this.secret, {
      expiresIn: this.expiresIn,
      algorithm: 'HS256',
    });
  }

  // トークンの検証
  verifyToken(token: string): any {
    try {
      return verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
```

### 3. RBAC実装

```typescript
// apps/api/src/auth/rbac.ts
type Permission = 'read' | 'write' | 'delete' | 'admin';
type Resource = 'todo' | 'user' | 'system';

interface Role {
  name: string;
  permissions: Map<Resource, Permission[]>;
}

export class RbacService {
  private roles: Map<string, Role> = new Map();

  // 権限チェック
  async checkPermission(
    userId: string,
    resource: Resource,
    permission: Permission
  ): Promise<boolean> {
    const userRole = await this.getUserRole(userId);
    const rolePermissions = this.roles.get(userRole)?.permissions;
    
    return rolePermissions?.get(resource)?.includes(permission) ?? false;
  }

  // アクセス制御ミドルウェア
  requirePermission(resource: Resource, permission: Permission) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user.id;
      const hasPermission = await this.checkPermission(
        userId,
        resource,
        permission
      );

      if (!hasPermission) {
        throw new Error('Unauthorized');
      }

      next();
    };
  }
}
```

## セキュリティ監視

### 1. ログ監視

```typescript
// apps/api/src/monitoring/security-logger.ts
interface SecurityEvent {
  type: 'auth' | 'access' | 'error';
  severity: 'low' | 'medium' | 'high';
  message: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

export class SecurityLogger {
  // セキュリティイベントの記録
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    // ログの保存
    await this.saveLog(event);

    // 重要度に応じたアラート
    if (event.severity === 'high') {
      await this.sendAlert(event);
    }
  }

  // 不正アクセスの検知
  async detectSuspiciousActivity(
    userId: string,
    activity: string
  ): Promise<void> {
    const recentActivities = await this.getRecentActivities(userId);
    
    if (this.isSuspicious(recentActivities)) {
      await this.logSecurityEvent({
        type: 'access',
        severity: 'high',
        message: 'Suspicious activity detected',
        metadata: { userId, activity },
        timestamp: new Date(),
      });
    }
  }
}
```

### 2. 監査ログ

```typescript
// apps/api/src/monitoring/audit-logger.ts
interface AuditLog {
  userId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  timestamp: Date;
  ip: string;
  userAgent: string;
}

export class AuditLogger {
  // 監査ログの記録
  async logAudit(log: AuditLog): Promise<void> {
    await prisma.auditLog.create({
      data: {
        userId: log.userId,
        action: log.action,
        resource: log.resource,
        details: log.details,
        timestamp: log.timestamp,
        ip: log.ip,
        userAgent: log.userAgent,
      },
    });
  }

  // 監査ログの検索
  async searchAuditLogs(
    filters: Partial<AuditLog>,
    dateRange: { start: Date; end: Date }
  ): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      where: {
        ...filters,
        timestamp: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }
}
```

## セキュリティテスト

### 1. 脆弱性スキャン

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * *'

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Run OWASP ZAP Scan
        uses: zaproxy/action-full-scan@v0.4.0
        with:
          target: 'https://example.com'
          
      - name: Run npm audit
        run: npm audit
        
      - name: Run Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### 2. ペネトレーションテスト

```typescript
// tests/security/penetration.test.ts
import { test, expect } from 'vitest';
import axios from 'axios';

test('SQLインジェクション対策のテスト', async () => {
  const maliciousInput = "' OR '1'='1";
  
  const response = await axios.post('/api/auth/login', {
    username: maliciousInput,
    password: maliciousInput,
  });
  
  expect(response.status).toBe(401);
});

test('XSS対策のテスト', async () => {
  const maliciousInput = '<script>alert("xss")</script>';
  
  const response = await axios.post('/api/todos', {
    title: maliciousInput,
  });
  
  expect(response.data.title).not.toContain('<script>');
});
```

## インシデント対応

### 1. インシデント検知

```typescript
// apps/api/src/security/incident-detector.ts
interface SecurityIncident {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: Date;
  affectedUsers: string[];
  affectedResources: string[];
}

export class IncidentDetector {
  // インシデントの検知
  async detectIncident(logs: SecurityEvent[]): Promise<SecurityIncident[]> {
    const incidents: SecurityIncident[] = [];

    // ブルートフォース攻撃の検知
    const bruteForceAttempts = this.detectBruteForce(logs);
    if (bruteForceAttempts) {
      incidents.push({
        type: 'brute_force',
        severity: 'high',
        description: 'Multiple failed login attempts detected',
        timestamp: new Date(),
        affectedUsers: bruteForceAttempts.users,
        affectedResources: ['auth'],
      });
    }

    return incidents;
  }

  // インシデント通知
  async notifyIncident(incident: SecurityIncident): Promise<void> {
    // Slack通知
    await this.sendSlackAlert(incident);
    
    // メール通知
    await this.sendEmailAlert(incident);
    
    // インシデントログの保存
    await this.logIncident(incident);
  }
}
```

### 2. インシデント対応手順

1. **初期対応**
   - インシデントの特定と分類
   - 影響範囲の特定
   - 一時的な対策の実施

2. **調査**
   - ログの収集と分析
   - 原因の特定
   - 被害状況の確認

3. **対策**
   - 恒久的な対策の実施
   - セキュリティパッチの適用
   - 設定の見直し

4. **報告**
   - 経営層への報告
   - 関係者への通知
   - 再発防止策の提案

## セキュリティ運用

### 1. 定期的なレビュー

- 四半期ごとのセキュリティレビュー
- 脆弱性スキャンの実施
- 設定の見直し
- アクセス権の棚卸し

### 2. 教育・訓練

- セキュリティ意識向上トレーニング
- インシデント対応訓練
- 新技術・脅威の情報共有
- ベストプラクティスの更新 