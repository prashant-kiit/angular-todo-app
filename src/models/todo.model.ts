export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
  dueDate?: Date;
  priority: TodoPriority;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export type TodoFilter = 'all' | 'active' | 'completed';