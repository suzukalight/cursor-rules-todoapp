export class TodoNotFoundError extends Error {
  constructor(id: string) {
    super(`Todo not found: ${id}`);
    this.name = 'TodoNotFoundError';
  }
} 