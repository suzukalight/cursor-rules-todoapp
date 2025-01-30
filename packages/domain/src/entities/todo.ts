export type TodoId = string;

export type TodoStatus = 'pending' | 'completed' | 'cancelled';

export interface TodoProps {
  id: TodoId;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export class Todo {
  private readonly props: TodoProps;

  private constructor(props: TodoProps) {
    this.props = props;
  }

  public static create(props: Omit<TodoProps, 'id' | 'createdAt' | 'updatedAt'>): Todo {
    const now = new Date();
    return new Todo({
      ...props,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }

  public static reconstruct(props: TodoProps): Todo {
    return new Todo(props);
  }

  get id(): TodoId {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get status(): TodoStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  public complete(): void {
    if (this.status === 'completed') {
      throw new Error('Todo is already completed');
    }

    this.props.status = 'completed';
    this.props.completedAt = new Date();
    this.props.updatedAt = new Date();
  }

  public cancel(): void {
    if (this.status === 'cancelled') {
      throw new Error('Todo is already cancelled');
    }

    this.props.status = 'cancelled';
    this.props.updatedAt = new Date();
  }

  public updateTitle(title: string): void {
    this.props.title = title;
    this.props.updatedAt = new Date();
  }

  public updateDescription(description: string): void {
    this.props.description = description;
    this.props.updatedAt = new Date();
  }
}
