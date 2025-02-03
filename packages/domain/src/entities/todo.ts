import { z } from 'zod';

export type TodoId = string;

export type TodoStatus = 'pending' | 'completed';

export type TodoPriority = 'high' | 'medium' | 'low';

export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['pending', 'completed']),
  priority: z.enum(['high', 'medium', 'low']),
  dueDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().optional(),
});

export type TodoDto = z.infer<typeof todoSchema>;

export class Todo {
  readonly #id: TodoId;
  #title: string;
  #description?: string;
  #status: TodoStatus;
  #priority: TodoPriority;
  #dueDate?: Date;
  readonly #createdAt: Date;
  #updatedAt: Date;
  #completedAt?: Date;

  private constructor(dto: TodoDto) {
    this.#id = dto.id;
    this.#title = dto.title;
    this.#description = dto.description;
    this.#status = dto.status;
    this.#priority = dto.priority;
    this.#dueDate = dto.dueDate;
    this.#createdAt = dto.createdAt;
    this.#updatedAt = dto.updatedAt;
    this.#completedAt = dto.completedAt;
  }

  static create(input: Omit<TodoDto, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'completedAt'>) {
    const now = new Date();
    const dto = todoSchema.parse({
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      completedAt: undefined,
      ...input,
    });
    return new Todo(dto);
  }

  static reconstruct(dto: TodoDto) {
    const validatedDto = todoSchema.parse(dto);
    return new Todo(validatedDto);
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

  get createdAt() {
    return this.#createdAt;
  }

  get updatedAt() {
    return this.#updatedAt;
  }

  get completedAt() {
    return this.#completedAt;
  }

  updateTitle(title: string) {
    const dto = todoSchema.pick({ title: true }).parse({ title });
    this.#title = dto.title;
    this.#updatedAt = new Date();
  }

  updateDescription(description: string) {
    const dto = todoSchema.pick({ description: true }).parse({ description });
    this.#description = dto.description;
    this.#updatedAt = new Date();
  }

  updatePriority(priority: TodoPriority) {
    const dto = todoSchema.pick({ priority: true }).parse({ priority });
    this.#priority = dto.priority;
    this.#updatedAt = new Date();
  }

  updateDueDate(dueDate?: Date) {
    const dto = todoSchema.pick({ dueDate: true }).parse({ dueDate });
    this.#dueDate = dto.dueDate;
    this.#updatedAt = new Date();
  }

  complete() {
    if (this.#status === 'completed') return;
    this.#status = 'completed';
    this.#completedAt = new Date();
    this.#updatedAt = new Date();
  }

  cancel() {
    if (this.#status === 'pending') return;
    this.#status = 'pending';
    this.#completedAt = undefined;
    this.#updatedAt = new Date();
  }

  toJSON(): TodoDto {
    return {
      id: this.#id,
      title: this.#title,
      description: this.#description,
      status: this.#status,
      priority: this.#priority,
      dueDate: this.#dueDate,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
      completedAt: this.#completedAt,
    };
  }
}
