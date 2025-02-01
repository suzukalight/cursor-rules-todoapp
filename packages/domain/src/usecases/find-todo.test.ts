import { describe, expect, test } from 'vitest';
import { Todo } from '../todo/todo';
import { FindTodoUseCase } from './find-todo';
import { InMemoryTodoRepository } from '../repositories/in-memory-todo-repository';

describe('FindTodoUseCase', () => {
  describe('findById', () => {
    test('指定したIDのTodoを取得できる', async () => {
      const todo = Todo.create({ title: 'テストタスク' });
      const repository = new InMemoryTodoRepository([todo]);
      const useCase = new FindTodoUseCase(repository);

      const result = await useCase.findById(todo.id);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.id).toBe(todo.id);
        expect(result.value.title).toBe(todo.title);
      }
    });

    test('存在しないTodoの場合はエラーを返す', async () => {
      const repository = new InMemoryTodoRepository([]);
      const useCase = new FindTodoUseCase(repository);

      const result = await useCase.findById('123');

      expect(result.isErr()).toBe(true);
    });
  });

  describe('findAll', () => {
    test('全てのTodoを取得できる', async () => {
      const todo1 = Todo.create({ title: 'テストタスク1' });
      const todo2 = Todo.create({ title: 'テストタスク2' });
      const repository = new InMemoryTodoRepository([todo1, todo2]);
      const useCase = new FindTodoUseCase(repository);

      const result = await useCase.findAll();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(2);
        expect(result.value[0].id).toBe(todo1.id);
        expect(result.value[1].id).toBe(todo2.id);
      }
    });

    test('Todoが存在しない場合は空配列を返す', async () => {
      const repository = new InMemoryTodoRepository([]);
      const useCase = new FindTodoUseCase(repository);

      const result = await useCase.findAll();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(0);
      }
    });
  });
});
