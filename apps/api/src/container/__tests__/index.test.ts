import { TodoRepository } from '@cursor-rules-todoapp/repo-sqlite';
import { describe, expect, it } from 'vitest';
import { createContainer } from '../index';

describe('Container', () => {
  it('should create a container with all dependencies', () => {
    const container = createContainer();

    expect(container.todoRepository).toBeInstanceOf(TodoRepository);
  });
}); 