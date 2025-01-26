# tRPC API Curl コマンド集

このドキュメントでは、tRPC APIをcurlコマンドで呼び出す方法を説明します。

## 共通事項

- ベースURL: `http://localhost:3001/trpc`
- 必須ヘッダー:
  - `Content-Type: application/json`
  - `trpc-accept: application/json`

## Todo API

### Todo作成

```bash
curl -X POST 'http://localhost:3001/trpc/create' \
  -H 'Content-Type: application/json' \
  -H 'trpc-accept: application/json' \
  -d '{"title":"買い物をする","description":"牛乳を買う"}'
```

- `title`: 必須
- `description`: 任意

### Todo一覧取得

```bash
curl -X GET 'http://localhost:3001/trpc/findAll' \
  -H 'trpc-accept: application/json'
```

### Todo詳細取得

```bash
curl -X GET 'http://localhost:3001/trpc/findById' \
  -H 'Content-Type: application/json' \
  -H 'trpc-accept: application/json' \
  -d '"todo-id-here"'
```

- `todo-id-here` を実際のTodoのIDに置き換えてください
- IDはダブルクォートで囲む必要があります

### Todo更新

```bash
curl -X POST 'http://localhost:3001/trpc/update' \
  -H 'Content-Type: application/json' \
  -H 'trpc-accept: application/json' \
  -d '{"id":"todo-id-here","title":"新しいタイトル","description":"新しい説明文"}'
```

- `id`: 必須
- `title`: 任意
- `description`: 任意
- タイトルのみ更新する場合は `description` を省略可能

### Todoステータス変更

```bash
curl -X POST 'http://localhost:3001/trpc/changeStatus' \
  -H 'Content-Type: application/json' \
  -H 'trpc-accept: application/json' \
  -d '{"id":"todo-id-here","action":"complete"}'
```

- `id`: 必須
- `action`: 必須
  - `"complete"`: 完了に変更
  - `"cancel"`: キャンセルに変更

### Todo削除

```bash
curl -X POST 'http://localhost:3001/trpc/delete' \
  -H 'Content-Type: application/json' \
  -H 'trpc-accept: application/json' \
  -d '"todo-id-here"'
```

- `todo-id-here` を実際のTodoのIDに置き換えてください
- IDはダブルクォートで囲む必要があります

## エラーハンドリング

エラーレスポンスは以下の形式で返されます：

```json
{
  "error": {
    "message": "エラーメッセージ",
    "code": -32600,
    "data": {
      "code": "BAD_REQUEST",
      "httpStatus": 400
    }
  }
}
```

## 注意事項

1. サーバーが起動していることを確認してください
2. 文字列パラメータ（ID）を送信する場合は、必ずJSONでクォートされた文字列として送信してください
3. オブジェクトパラメータの場合は、JSONオブジェクトとして送信してください
4. レスポンスは常にJSONで返されます 