import { TestDatabase } from '@cursor-rules-todoapp/repo-sqlite';

async function globalSetup() {
  const db = new TestDatabase();
  await db.setup();

  // テスト用の環境変数を設定
  process.env.DATABASE_URL = db.getDatabaseUrl();
}

export default globalSetup;