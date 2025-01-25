import { describe, it, expect } from 'vitest';
import { TODO_STATUS, TODO_STATUS_LABEL } from './todo';

describe('Todo Constants', () => {
  it('should have correct status values', () => {
    expect(TODO_STATUS.pending).toBe('pending');
    expect(TODO_STATUS['in-progress']).toBe('in-progress');
    expect(TODO_STATUS.completed).toBe('completed');
  });

  it('should have correct status labels', () => {
    expect(TODO_STATUS_LABEL.pending).toBe('未着手');
    expect(TODO_STATUS_LABEL['in-progress']).toBe('進行中');
    expect(TODO_STATUS_LABEL.completed).toBe('完了');
  });
}); 