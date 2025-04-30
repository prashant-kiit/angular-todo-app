import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  template: `
    <div class="todo-list-container">
      <div class="todo-list" *ngIf="todos.length > 0; else emptyState">
        <app-todo-item 
          *ngFor="let todo of todos" 
          [todo]="todo"
          @todoAnimation
        ></app-todo-item>
      </div>
      
      <ng-template #emptyState>
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <h3 class="empty-title">No tasks found</h3>
          <p class="empty-message">
            {{ getEmptyStateMessage() }}
          </p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .todo-list-container {
      min-height: 200px;
    }
    
    .todo-list {
      margin-bottom: var(--spacing-4);
    }
    
    .empty-state {
      text-align: center;
      padding: var(--spacing-6);
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .empty-icon {
      font-size: 48px;
      margin-bottom: var(--spacing-3);
    }
    
    .empty-title {
      font-size: 20px;
      margin-bottom: var(--spacing-2);
      color: var(--gray-800);
    }
    
    .empty-message {
      color: var(--gray-600);
      max-width: 300px;
      margin: 0 auto;
    }
  `]
})
export class TodoListComponent {
  private todoService = inject(TodoService);
  
  get todos(): Todo[] {
    return this.todoService.filteredTodos;
  }
  
  get currentFilter() {
    return this.todoService.filter$();
  }
  
  getEmptyStateMessage(): string {
    switch (this.currentFilter) {
      case 'active':
        return 'You have completed all your tasks! Time to add more?';
      case 'completed':
        return 'No completed tasks yet. Start checking off some tasks!';
      default:
        return 'Add a new task to get started!';
    }
  }
}