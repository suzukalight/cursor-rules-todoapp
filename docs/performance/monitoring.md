# パフォーマンスモニタリング

## 概要

アプリケーションのパフォーマンスを継続的に監視し、問題を早期に発見・解決するためのガイドラインです。

## モニタリング指標

### 1. フロントエンド指標

**Core Web Vitals**:
- LCP (Largest Contentful Paint): 2.5秒以内
- FID (First Input Delay): 100ms以内
- CLS (Cumulative Layout Shift): 0.1以下

**その他の指標**:
- TTFB (Time to First Byte): 600ms以内
- FCP (First Contentful Paint): 1.8秒以内
- TTI (Time to Interactive): 3.8秒以内

### 2. バックエンド指標

**API性能**:
- レスポンスタイム: 500ms以内
- エラーレート: 0.1%以下
- スループット: 1000req/分以上

**データベース性能**:
- クエリ実行時間: 100ms以内
- コネクション数: 最大100
- デッドロック発生率: 0.01%以下

### 3. インフラ指標

**サーバーリソース**:
- CPU使用率: 70%以下
- メモリ使用率: 80%以下
- ディスクI/O: 70%以下

## モニタリングツール

### 1. フロントエンド監視

```typescript
// Next.js Analytics
// next.config.js
module.exports = {
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
  },
};

// Web Vitalsの計測
export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric);
  
  // メトリクスの送信
  if (metric.label === 'web-vital') {
    sendToAnalytics('web-vital', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
    });
  }
}
```

### 2. バックエンド監視

```typescript
// カスタムミドルウェア
const performanceMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const path = req.path;
    
    // メトリクスの記録
    recordMetrics({
      type: 'api',
      duration,
      status,
      method,
      path,
    });
  });
  
  next();
};

// Prismaミドルウェア
prisma.$use(async (params, next) => {
  const start = performance.now();
  const result = await next(params);
  const duration = performance.now() - start;
  
  // クエリメトリクスの記録
  recordMetrics({
    type: 'database',
    model: params.model,
    action: params.action,
    duration,
  });
  
  return result;
});
```

### 3. エラー監視

```typescript
// グローバルエラーハンドラー
const errorHandler = (error: Error) => {
  // エラー情報の収集
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  };
  
  // エラーの重要度判定
  const severity = getSeverity(error);
  
  // アラートの送信
  if (severity === 'high') {
    sendAlert({
      type: 'error',
      severity,
      ...errorInfo,
    });
  }
  
  // エラーの記録
  logError(errorInfo);
};
```

## メトリクス収集

### 1. カスタムメトリクス

```typescript
// メトリクスクライアント
class MetricsClient {
  private metrics: Map<string, number[]> = new Map();
  
  record(name: string, value: number) {
    const values = this.metrics.get(name) || [];
    values.push(value);
    this.metrics.set(name, values);
  }
  
  getStats(name: string) {
    const values = this.metrics.get(name) || [];
    return {
      avg: this.average(values),
      p95: this.percentile(values, 95),
      p99: this.percentile(values, 99),
      count: values.length,
    };
  }
  
  private average(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
  
  private percentile(values: number[], p: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * p / 100;
    const base = Math.floor(pos);
    const rest = pos - base;
    
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
      return sorted[base];
    }
  }
}
```

### 2. メトリクスの集約

```typescript
// メトリクスの集約処理
const aggregateMetrics = async () => {
  const metrics = await getAllMetrics();
  
  // 時間帯ごとの集計
  const hourlyStats = groupByHour(metrics).map(group => ({
    hour: group.hour,
    stats: calculateStats(group.metrics),
  }));
  
  // 保存
  await saveAggregatedMetrics(hourlyStats);
};

// 定期実行
setInterval(aggregateMetrics, 1000 * 60 * 60); // 1時間ごと
```

## アラート設定

### 1. アラートルール

```typescript
// アラートルールの定義
const alertRules = [
  {
    name: 'high-error-rate',
    condition: (metrics: Metrics) => 
      metrics.errorRate > 0.01, // 1%以上
    severity: 'high',
    message: 'エラーレートが高すぎます',
  },
  {
    name: 'high-latency',
    condition: (metrics: Metrics) =>
      metrics.p95Latency > 500, // 500ms以上
    severity: 'medium',
    message: 'レイテンシーが高くなっています',
  },
];

// アラートチェック
const checkAlerts = async () => {
  const metrics = await getLatestMetrics();
  
  for (const rule of alertRules) {
    if (rule.condition(metrics)) {
      await sendAlert({
        rule: rule.name,
        severity: rule.severity,
        message: rule.message,
        metrics,
      });
    }
  }
};
```

### 2. 通知設定

```typescript
// 通知チャンネルの設定
const notificationChannels = {
  slack: {
    webhook: process.env.SLACK_WEBHOOK_URL,
    send: async (alert: Alert) => {
      // Slackへの通知
    },
  },
  email: {
    recipients: ['team@example.com'],
    send: async (alert: Alert) => {
      // メール通知
    },
  },
};

// 重要度に応じた通知
const sendAlert = async (alert: Alert) => {
  if (alert.severity === 'high') {
    await Promise.all([
      notificationChannels.slack.send(alert),
      notificationChannels.email.send(alert),
    ]);
  } else {
    await notificationChannels.slack.send(alert);
  }
};
```

## ダッシュボード

### 1. リアルタイムモニタリング

```typescript
// WebSocketを使用したリアルタイム更新
const setupRealtimeMonitoring = () => {
  const ws = new WebSocket('ws://monitoring-server');
  
  ws.onmessage = (event) => {
    const metrics = JSON.parse(event.data);
    updateDashboard(metrics);
  };
};

// ダッシュボードの更新
const updateDashboard = (metrics: Metrics) => {
  // チャートの更新
  updateCharts(metrics);
  
  // アラートの表示
  if (metrics.hasAlert) {
    showAlert(metrics.alert);
  }
};
```

### 2. 履歴データの表示

```typescript
// 履歴データの取得
const fetchHistoricalData = async (
  startDate: Date,
  endDate: Date
): Promise<Metrics[]> => {
  const response = await fetch('/api/metrics/history', {
    method: 'POST',
    body: JSON.stringify({ startDate, endDate }),
  });
  
  return response.json();
};

// トレンド分析
const analyzeTrends = (metrics: Metrics[]) => {
  return {
    trend: calculateTrend(metrics),
    anomalies: detectAnomalies(metrics),
    predictions: predictFuture(metrics),
  };
};
``` 