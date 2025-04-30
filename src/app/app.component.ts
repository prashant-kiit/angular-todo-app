import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoInputComponent } from '../components/todo-input/todo-input.component';
import { TodoFiltersComponent } from '../components/todo-filters/todo-filters.component';
import { TodoListComponent } from '../components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TodoInputComponent, TodoFiltersComponent, TodoListComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="container">
          <h1 class="app-title">TodoFlow</h1>
          <p class="app-subtitle">Organize your tasks effectively</p>
        </div>
      </header>
      
      <main class="app-content">
        <div class="container">
          <app-todo-input></app-todo-input>
          <app-todo-filters></app-todo-filters>
          <app-todo-list></app-todo-list>
        </div>
      </main>
      
      <footer class="app-footer">
        <div class="container">
          <p class="footer-text">
            TodoFlow App &copy; {{ currentYear }}
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .app-header {
      background-color: var(--primary-500);
      color: white;
      padding: var(--spacing-5) 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .app-title {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: var(--spacing-1);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .app-subtitle {
      font-size: 16px;
      font-weight: 400;
      opacity: 0.9;
    }
    
    .app-content {
      flex: 1;
      padding: var(--spacing-5) 0;
      background-color: var(--gray-100);
    }
    
    .app-footer {
      background-color: var(--gray-800);
      color: var(--gray-300);
      padding: var(--spacing-4) 0;
      text-align: center;
      font-size: 14px;
    }
    
    @media (max-width: 768px) {
      .app-header {
        padding: var(--spacing-4) 0;
      }
      
      .app-title {
        font-size: 28px;
      }
      
      .app-content {
        padding: var(--spacing-4) 0;
      }
    }
  `]
})
export class AppComponent {
  currentYear = new Date().getFullYear();
}