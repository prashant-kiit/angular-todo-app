import { Injectable, signal } from '@angular/core';
import { Todo, TodoFilter, TodoPriority } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly STORAGE_KEY = 'todos';
  private todos = signal<Todo[]>([]);
  private filter = signal<TodoFilter>('all');

  constructor() {
    this.loadFromLocalStorage();
  }

  // Public signals that components can subscribe to
  public todos$ = this.todos.asReadonly();
  public filter$ = this.filter.asReadonly();

  // Filter todos based on the current filter
  public get filteredTodos() {
    const currentFilter = this.filter();
    const allTodos = this.todos();
    
    switch (currentFilter) {
      case 'active':
        return allTodos.filter(todo => !todo.completed);
      case 'completed':
        return allTodos.filter(todo => todo.completed);
      default:
        return allTodos;
    }
  }

  // Add a new todo
  addTodo(title: string, priority: TodoPriority = TodoPriority.MEDIUM, dueDate?: Date, description?: string, category?: string): void {
    if (!title.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      description,
      dueDate,
      priority,
      category,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.todos.update(todos => [...todos, newTodo]);
    this.saveToLocalStorage();
  }

  // Update an existing todo
  updateTodo(todo: Todo): void {
    this.todos.update(todos => 
      todos.map(t => t.id === todo.id ? { ...todo, updatedAt: new Date() } : t)
    );
    this.saveToLocalStorage();
  }

  // Delete a todo
  deleteTodo(id: string): void {
    this.todos.update(todos => todos.filter(todo => todo.id !== id));
    this.saveToLocalStorage();
  }

  // Toggle todo completion status
  toggleComplete(id: string): void {
    this.todos.update(todos => 
      todos.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() } 
          : todo
      )
    );
    this.saveToLocalStorage();
  }

  // Set the current filter
  setFilter(filter: TodoFilter): void {
    this.filter.set(filter);
  }

  // Clear all completed todos
  clearCompleted(): void {
    this.todos.update(todos => todos.filter(todo => !todo.completed));
    this.saveToLocalStorage();
  }

  // Save the current todos to local storage
  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos()));
  }

  // Load todos from local storage
  private loadFromLocalStorage(): void {
    try {
      const storedTodos = localStorage.getItem(this.STORAGE_KEY);
      if (storedTodos) {
        // Parse dates correctly
        const parsedTodos = JSON.parse(storedTodos, (key, value) => {
          if (key === 'createdAt' || key === 'updatedAt' || key === 'dueDate') {
            return value ? new Date(value) : undefined;
          }
          return value;
        });
        this.todos.set(parsedTodos);
      }
    } catch (error) {
      console.error('Error loading todos from localStorage', error);
    }
  }
}