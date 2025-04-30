import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { TodoFilter } from '../../models/todo.model';

@Component({
  selector: 'app-todo-filters',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filters-container">
      <div class="filter-tabs">
        <button 
          *ngFor="let filterOption of filterOptions" 
          class="filter-tab" 
          [class.active]="currentFilter() === filterOption.value"
          (click)="setFilter(filterOption.value)"
        >
          {{ filterOption.label }}
          <span class="filter-count" *ngIf="filterOption.count !== undefined">
            {{ filterOption.count }}
          </span>
        </button>
      </div>
      
      <div class="filter-actions" *ngIf="hasCompletedTodos()">
        <button class="btn btn-text clear-completed" (click)="clearCompleted()">
          Clear completed
        </button>
      </div>
    </div>
  `,
  styles: [`
    .filters-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-4);
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      padding: var(--spacing-2);
    }
    
    .filter-tabs {
      display: flex;
    }
    
    .filter-tab {
      position: relative;
      padding: var(--spacing-2) var(--spacing-3);
      border: none;
      background: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-600);
      border-radius: 4px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
    }
    
    .filter-tab:hover {
      background-color: var(--gray-100);
      color: var(--gray-700);
    }
    
    .filter-tab.active {
      color: var(--primary-700);
      background-color: var(--primary-50);
    }
    
    .filter-tab.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 2px;
      background-color: var(--primary-500);
      border-radius: 2px;
    }
    
    .filter-count {
      font-size: 12px;
      background-color: var(--gray-200);
      color: var(--gray-700);
      border-radius: 100px;
      padding: 1px 6px;
      min-width: 20px;
      text-align: center;
    }
    
    .filter-tab.active .filter-count {
      background-color: var(--primary-200);
      color: var(--primary-700);
    }
    
    .clear-completed {
      font-size: 14px;
      color: var(--gray-600);
    }
    
    .clear-completed:hover {
      color: var(--error-500);
    }
    
    @media (max-width: 600px) {
      .filters-container {
        flex-direction: column;
        align-items: stretch;
        gap: var(--spacing-2);
      }
      
      .filter-tabs {
        justify-content: center;
      }
      
      .filter-actions {
        display: flex;
        justify-content: center;
      }
    }
  `]
})
export class TodoFiltersComponent {
  private todoService = inject(TodoService);
  
  get filterOptions() {
    const todos = this.todoService.todos$();
    const activeTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);
    
    return [
      { label: 'All', value: 'all' as TodoFilter, count: todos.length },
      { label: 'Active', value: 'active' as TodoFilter, count: activeTodos.length },
      { label: 'Completed', value: 'completed' as TodoFilter, count: completedTodos.length }
    ];
  }
  
  get currentFilter() {
    return this.todoService.filter$;
  }
  
  setFilter(filter: TodoFilter): void {
    this.todoService.setFilter(filter);
  }
  
  clearCompleted(): void {
    this.todoService.clearCompleted();
  }
  
  hasCompletedTodos(): boolean {
    return this.todoService.todos$().some(todo => todo.completed);
  }
}