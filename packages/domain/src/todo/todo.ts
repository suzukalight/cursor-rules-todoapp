import { z } from 'zod';

export type TodoId = string;
export type TodoStatus = 'pending' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high';

const todoInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.date().optional(),
});

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['pending', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
  completedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TodoDto = z.infer<typeof todoSchema>;
type TodoInput = z.infer<typeof todoInputSchema>;

export class Todo {
  readonly #id: TodoId;
  #title: string;
  #description?: string;
  #status: TodoStatus;
  #priority: TodoPriority;
  #dueDate?: Date;
  #completedAt?: Date;
  readonly #createdAt: Date;
  #updatedAt: Date;

  private constructor(dto: TodoDto) {
    this.#id = dto.id;
    this.#title = dto.title;
    this.#description = dto.description;
    this.#status = dto.status;
    this.#priority = dto.priority;
    this.#dueDate = dto.dueDate;
    this.#completedAt = dto.completedAt;
    this.#createdAt = dto.createdAt;
    this.#updatedAt = dto.updatedAt;
  }

  static create(params: Partial<TodoInput> & Pick<TodoInput, 'title'>) {
    const input = todoInputSchema.parse(params);
    const now = new Date();
    const nextNow = new Date(now.getTime() + 1);

    const dto = todoSchema.parse({
      ...input,
      id: crypto.randomUUID(),
      status: 'pending' as const,
      completedAt: undefined,
      createdAt: now,
      updatedAt: nextNow,
    });
    return new Todo(dto);
  }

  static reconstruct(dto: TodoDto) {
    return new Todo(todoSchema.parse(dto));
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get description() {
    return this.#description;
  }

  get status() {
    return this.#status;
  }

  get priority() {
    return this.#priority;
  }

  get dueDate() {
    return this.#dueDate;
  }

  get completedAt() {
    return this.#completedAt;
  }

  get createdAt() {
    return this.#createdAt;
  }

  get updatedAt() {
    return this.#updatedAt;
  }

  updateTitle(title: string) {
    const dto = todoSchema.pick({ title: true }).parse({ title });
    this.#title = dto.title;
    this.#updatedAt = new Date(this.#updatedAt.getTime() + 1);
  }

  updateDescription(description?: string) {
    const dto = todoSchema.pick({ description: true }).parse({ description });
    this.#description = dto.description;
    this.#updatedAt = new Date(this.#updatedAt.getTime() + 1);
  }

  updatePriority(priority: TodoPriority) {
    const dto = todoSchema.pick({ priority: true }).parse({ priority });
    this.#priority = dto.priority;
    this.#updatedAt = new Date(this.#updatedAt.getTime() + 1);
  }

  updateDueDate(dueDate?: Date) {
    const dto = todoSchema.pick({ dueDate: true }).parse({ dueDate });
    this.#dueDate = dto.dueDate;
    this.#updatedAt = new Date(this.#updatedAt.getTime() + 1);
  }

  complete() {
    if (this.#status === 'completed') {
      throw new Error('Todo is already completed');
    }
    this.#status = 'completed';
    this.#completedAt = new Date();
    this.#updatedAt = new Date(this.#updatedAt.getTime() + 1);
  }

  cancel() {
    if (this.#status === 'pending') {
      throw new Error('Todo is already pending');
    }
    this.#status = 'pending';
    this.#completedAt = undefined;
    this.#updatedAt = new Date(this.#updatedAt.getTime() + 1);
  }

  toJSON(): TodoDto {
    return this.toDto();
  }

  toDto(): TodoDto {
    return todoSchema.parse({
      id: this.#id,
      title: this.#title,
      description: this.#description,
      status: this.#status,
      priority: this.#priority,
      dueDate: this.#dueDate,
      completedAt: this.#completedAt,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
    });
  }
} 