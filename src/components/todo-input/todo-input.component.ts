import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { TodoPriority } from '../../models/todo.model';

@Component({
  selector: 'app-todo-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="todo-input-container">
      <form (ngSubmit)="addTodo()" class="todo-form">
        <div class="input-group">
          <input 
            type="text" 
            [(ngModel)]="todoTitle" 
            name="todoTitle" 
            placeholder="What needs to be done?"
            class="todo-input"
            autofocus
            (focus)="showDetails = true"
          />
          <button type="submit" class="add-btn btn btn-primary">Add</button>
        </div>
        
        <div class="todo-details" [class.show-details]="showDetails">
          <div class="input-row">
            <div class="input-group">
              <label for="priority">Priority</label>
              <select [(ngModel)]="todoPriority" name="priority" id="priority" class="todo-select">
                <option [value]="TodoPriority.LOW">Low</option>
                <option [value]="TodoPriority.MEDIUM">Medium</option>
                <option [value]="TodoPriority.HIGH">High</option>
              </select>
            </div>
            
            <div class="input-group">
              <label for="dueDate">Due Date</label>
              <input 
                type="date" 
                [(ngModel)]="todoDueDate" 
                name="dueDate" 
                id="dueDate"
                class="todo-date"
              />
            </div>
          </div>
          
          <div class="input-group full-width">
            <label for="category">Category</label>
            <input 
              type="text" 
              [(ngModel)]="todoCategory" 
              name="category" 
              id="category"
              placeholder="Work, Personal, etc."
              class="todo-category"
            />
          </div>
          
          <div class="input-group full-width">
            <label for="description">Description</label>
            <textarea 
              [(ngModel)]="todoDescription" 
              name="description" 
              id="description"
              rows="2"
              placeholder="Add details..."
              class="todo-description"
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .todo-input-container {
      margin-bottom: var(--spacing-5);
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .todo-form {
      padding: var(--spacing-4);
    }
    
    .input-group {
      margin-bottom: var(--spacing-3);
    }
    
    .full-width {
      width: 100%;
    }
    
    .input-row {
      display: flex;
      gap: var(--spacing-3);
    }
    
    .input-row .input-group {
      flex: 1;
    }
    
    .todo-input {
      width: 100%;
      padding: var(--spacing-3);
      border: 1px solid var(--gray-300);
      border-radius: 4px;
      font-size: 16px;
      transition: border-color 0.2s;
    }
    
    .todo-input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
    }
    
    .input-group {
      display: flex;
      flex-direction: column;
    }
    
    label {
      margin-bottom: var(--spacing-1);
      font-size: 14px;
      color: var(--gray-700);
    }
    
    .todo-select, .todo-date, .todo-category {
      padding: var(--spacing-2);
      border: 1px solid var(--gray-300);
      border-radius: 4px;
      background-color: white;
    }
    
    .todo-select:focus, .todo-date:focus, .todo-category:focus {
      outline: none;
      border-color: var(--primary-500);
    }
    
    .todo-description {
      width: 100%;
      padding: var(--spacing-2);
      border: 1px solid var(--gray-300);
      border-radius: 4px;
      resize: vertical;
    }
    
    .todo-description:focus {
      outline: none;
      border-color: var(--primary-500);
    }
    
    .todo-details {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }
    
    .show-details {
      max-height: 500px;
    }
    
    .add-btn {
      margin-left: var(--spacing-2);
      white-space: nowrap;
    }
    
    .input-group:first-child {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    
    @media (max-width: 600px) {
      .input-row {
        flex-direction: column;
      }
    }
  `]
})
export class TodoInputComponent {
  todoTitle = '';
  todoDescription = '';
  todoPriority = TodoPriority.MEDIUM;
  todoDueDate = '';
  todoCategory = '';
  showDetails = false;
  TodoPriority = TodoPriority;
  
  private todoService = inject(TodoService);
  
  addTodo(): void {
    if (!this.todoTitle.trim()) return;
    
    // Convert date string to Date object if provided
    let dueDate: Date | undefined;
    if (this.todoDueDate) {
      dueDate = new Date(this.todoDueDate);
    }
    
    this.todoService.addTodo(
      this.todoTitle,
      this.todoPriority,
      dueDate,
      this.todoDescription,
      this.todoCategory
    );
    
    // Reset form
    this.todoTitle = '';
    this.todoDescription = '';
    this.todoPriority = TodoPriority.MEDIUM;
    this.todoDueDate = '';
    this.todoCategory = '';
    this.showDetails = false;
  }
}