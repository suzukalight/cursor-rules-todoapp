# TodoMapperの修正

## 作業内容

1. `TodoMapper`の型不整合を修正
   - `Todo`型を`TodoDto`型に変更
   - `toPrisma`メソッドの引数を`TodoDto`型に変更

2. ユースケースの戻り値を`TodoDto`型に統一
   - `create-todo.ts`
   - `update-todo.ts`
   - `find-todo.ts`
   - `change-todo-status.ts`
   - `filter-todo.ts`
   - `sort-todo.ts`

3. テストケースの追加
   - `create-todo.test.ts`
     - 正常系: TodoDtoを返すこと
     - 正常系: 必須項目のみでTodoを作成できること
     - 異常系: タイトルが空の場合はエラーを返すこと
     - 異常系: リポジトリでエラーが発生した場合はエラーを返すこと

   - `update-todo.test.ts`
     - 正常系: タイトルを更新できること
     - 正常系: 説明を更新できること
     - 正常系: 説明を削除できること
     - 正常系: 優先度を更新できること
     - 正常系: 期限を更新できること
     - 異常系: 存在しないTodoの場合はエラーを返すこと
     - 異常系: リポジトリでエラーが発生した場合はエラーを返すこと

   - `find-todo.test.ts`
     - 正常系: すべてのTodoを取得できること
     - 正常系: Todoが存在しない場合は空配列を返すこと
     - 正常系: 指定したIDのTodoを取得できること
     - 異常系: 存在しないIDの場合はエラーを返すこと
     - 異常系: リポジトリでエラーが発生した場合はエラーを返すこと

   - `change-todo-status.test.ts`
     - 正常系: Todoを完了状態に変更できること
     - 正常系: Todoを未完了状態に変更できること
     - 異常系: 存在しないTodoの場合はエラーを返すこと
     - 異常系: すでに完了状態のTodoを完了状態に変更しようとした場合はエラーを返すこと
     - 異常系: すでに未完了状態のTodoを未完了状態に変更しようとした場合はエラーを返すこと
     - 異常系: リポジトリでエラーが発生した場合はエラーを返すこと

   - `filter-todo.test.ts`
     - 正常系: ステータスでフィルタリングできること
     - 正常系: 優先度でフィルタリングできること
     - 正常系: 期限でフィルタリングできること
     - 正常系: 複数の条件でフィルタリングできること
     - 正常系: フィルタリング条件に合致するTodoが存在しない場合は空配列を返すこと
     - 正常系: フィルタリング条件が指定されていない場合は全てのTodoを返すこと
     - 異常系: リポジトリでエラーが発生した場合はエラーを返すこと

   - `sort-todo.test.ts`
     - 正常系: 作成日時の昇順でソートできること
     - 正常系: 作成日時の降順でソートできること
     - 正常系: 優先度の昇順でソートできること
     - 正常系: 優先度の降順でソートできること
     - 正常系: 期限の昇順でソートできること
     - 正常系: 期限の降順でソートできること
     - 異常系: リポジトリでエラーが発生した場合はエラーを返すこと

4. リポジトリの修正
   - `todo-repository.test.ts`をTodoDtoを使用するように修正

## 変更されたファイル

- `packages/repo-sqlite/src/mappers/todo-mapper.ts`
- `packages/domain/src/usecases/create-todo.ts`
- `packages/domain/src/usecases/update-todo.ts`
- `packages/domain/src/usecases/find-todo.ts`
- `packages/domain/src/usecases/change-todo-status.ts`
- `packages/domain/src/usecases/filter-todo.ts`
- `packages/domain/src/usecases/sort-todo.ts`
- `packages/domain/src/usecases/create-todo.test.ts`
- `packages/domain/src/usecases/update-todo.test.ts`
- `packages/domain/src/usecases/find-todo.test.ts`
- `packages/domain/src/usecases/change-todo-status.test.ts`
- `packages/domain/src/usecases/filter-todo.test.ts`
- `packages/domain/src/usecases/sort-todo.test.ts`
- `packages/repo-sqlite/src/repositories/todo-repository.test.ts`

## 次のステップ

1. APIドキュメントの更新
   - 各エンドポイントの戻り値の型を更新
   - エラーケースの説明を追加

2. 型の整合性に関する設計ドキュメントの作成
   - ドメイン層とインフラ層の境界における型の扱い
   - DTOパターンの採用理由と利点
   - 型の変換フローの説明 