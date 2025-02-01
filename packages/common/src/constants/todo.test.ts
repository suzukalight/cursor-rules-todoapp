import { describe, expect, test } from 'vitest';
import { TODO_STATUS, TODO_STATUS_LABEL } from './todo';

describe('Todo Constants', () => {
  test('should have correct status values', () => {
    expect(TODO_STATUS.pending).toBe('pending');
    expect(TODO_STATUS.completed).toBe('completed');
  });

  test('should have correct status labels', () => {
    expect(TODO_STATUS_LABEL.pending).toBe('未完了');
    expect(TODO_STATUS_LABEL.completed).toBe('完了');
  });
});
