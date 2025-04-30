import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo, TodoPriority } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="todo-item" [class.completed]="todo.completed" [class.editing]="isEditing">
      <div class="todo-content" *ngIf="!isEditing">
        <div class="todo-main">
          <div class="checkbox-wrapper">
            <input 
              type="checkbox" 
              [checked]="todo.completed" 
              (change)="toggleComplete()"
              [id]="'todo-' + todo.id"
              class="todo-checkbox"
            />
            <label [for]="'todo-' + todo.id" class="checkbox-label"></label>
          </div>
          
          <div class="todo-info" (dblclick)="startEditing()">
            <div class="todo-header">
              <h3 class="todo-title">{{ todo.title }}</h3>
              <div class="todo-priority" [ngClass]="'priority-' + todo.priority">
                {{ todo.priority }}
              </div>
            </div>
            
            <div class="todo-meta" *ngIf="todo.description || todo.dueDate || todo.category">
              <p class="todo-description" *ngIf="todo.description">{{ todo.description }}</p>
              
              <div class="todo-details">
                <span class="todo-category" *ngIf="todo.category">{{ todo.category }}</span>
                <span class="todo-due-date" *ngIf="todo.dueDate" [class.overdue]="isOverdue(todo.dueDate)">
                  Due: {{ todo.dueDate | date:'mediumDate' }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="todo-actions">
          <button class="btn btn-text edit-btn" (click)="startEditing()">
            Edit
          </button>
          <button class="btn btn-text delete-btn" (click)="deleteTodo()">
            Delete
          </button>
        </div>
      </div>
      
      <div class="todo-edit-form" *ngIf="isEditing">
        <div class="edit-header">
          <input 
            [(ngModel)]="editTitle" 
            class="edit-title" 
            placeholder="Task title"
          />
          
          <select [(ngModel)]="editPriority" class="edit-priority">
            <option [value]="TodoPriority.LOW">Low</option>
            <option [value]="TodoPriority.MEDIUM">Medium</option>
            <option [value]="TodoPriority.HIGH">High</option>
          </select>
        </div>
        
        <div class="edit-details">
          <div class="edit-row">
            <input 
              [(ngModel)]="editCategory" 
              class="edit-category" 
              placeholder="Category"
            />
            
            <input 
              type="date" 
              [(ngModel)]="editDueDate" 
              class="edit-due-date"
            />
          </div>
          
          <textarea 
            [(ngModel)]="editDescription" 
            class="edit-description" 
            placeholder="Description"
            rows="2"
          ></textarea>
        </div>
        
        <div class="edit-actions">
          <button class="btn btn-primary save-btn" (click)="saveEdit()">Save</button>
          <button class="btn btn-text cancel-btn" (click)="cancelEdit()">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .todo-item {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: var(--spacing-3);
      transition: all 0.2s ease;
      overflow: hidden;
    }
    
    .todo-item:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
    
    .todo-content {
      padding: var(--spacing-3) var(--spacing-4);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .todo-main {
      display: flex;
      flex: 1;
      min-width: 0;
    }
    
    .todo-info {
      flex: 1;
      min-width: 0;
      margin-left: var(--spacing-3);
      cursor: pointer;
    }
    
    .todo-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-2);
    }
    
    .todo-title {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: var(--gray-900);
      word-break: break-word;
      line-height: 1.3;
    }
    
    .completed .todo-title {
      text-decoration: line-through;
      color: var(--gray-500);
    }
    
    .todo-description {
      font-size: 14px;
      color: var(--gray-600);
      margin-bottom: var(--spacing-2);
    }
    
    .todo-details {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-2);
      font-size: 12px;
    }
    
    .todo-category {
      background-color: var(--primary-50);
      color: var(--primary-700);
      padding: 2px 8px;
      border-radius: 100px;
    }
    
    .todo-due-date {
      background-color: var(--gray-100);
      color: var(--gray-700);
      padding: 2px 8px;
      border-radius: 100px;
    }
    
    .todo-due-date.overdue {
      background-color: var(--error-500);
      color: white;
    }
    
    .todo-priority {
      font-size: 12px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 100px;
      text-transform: capitalize;
    }
    
    .priority-low {
      background-color: var(--gray-100);
      color: var(--gray-700);
    }
    
    .priority-medium {
      background-color: var(--secondary-100);
      color: var(--secondary-700);
    }
    
    .priority-high {
      background-color: var(--accent-100);
      color: var(--accent-700);
    }
    
    .todo-actions {
      display: flex;
      gap: var(--spacing-2);
    }
    
    .todo-checkbox {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    
    .checkbox-wrapper {
      position: relative;
      display: inline-block;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }
    
    .checkbox-label {
      position: absolute;
      top: 0;
      left: 0;
      height: 24px;
      width: 24px;
      background-color: white;
      border: 2px solid var(--gray-300);
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .checkbox-label:hover {
      border-color: var(--primary-500);
    }
    
    .todo-checkbox:checked + .checkbox-label {
      background-color: var(--primary-500);
      border-color: var(--primary-500);
    }
    
    .todo-checkbox:checked + .checkbox-label:after {
      content: '';
      position: absolute;
      left: 9px;
      top: 5px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    
    .todo-meta {
      margin-top: var(--spacing-2);
    }
    
    .completed .todo-meta {
      opacity: 0.6;
    }
    
    .todo-edit-form {
      padding: var(--spacing-4);
      background-color: var(--gray-50);
      border-top: 1px solid var(--gray-200);
    }
    
    .edit-header {
      display: flex;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-3);
    }
    
    .edit-title {
      flex: 1;
      padding: var(--spacing-2);
      font-size: 16px;
      border: 1px solid var(--gray-300);
      border-radius: 4px;
    }
    
    .edit-title:focus {
      outline: none;
      border-color: var(--primary-500);
    }
    
    .edit-priority {
      width: 100px;
      padding: var(--spacing-2);
      border: 1px solid var(--gray-300);
      border-radius: 4px;
    }
    
    .edit-details {
      margin-bottom: var(--spacing-3);
    }
    
    .edit-row {
      display: flex;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-3);
    }
    
    .edit-category, .edit-due-date {
      flex: 1;
      padding: var(--spacing-2);
      border: 1px solid var(--gray-300);
      border-radius: 4px;
    }
    
    .edit-description {
      width: 100%;
      padding: var(--spacing-2);
      border: 1px solid var(--gray-300);
      border-radius: 4px;
      resize: vertical;
    }
    
    .edit-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-3);
    }
    
    .completed {
      opacity: 0.8;
    }
    
    @media (max-width: 600px) {
      .todo-content {
        flex-direction: column;
      }
      
      .todo-actions {
        margin-top: var(--spacing-3);
        margin-left: 32px; /* align with content */
      }
      
      .edit-header, .edit-row {
        flex-direction: column;
        gap: var(--spacing-2);
      }
      
      .edit-priority {
        width: 100%;
      }
    }
  `]
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  
  private todoService = inject(TodoService);
  TodoPriority = TodoPriority;
  
  // Editing state
  isEditing = false;
  editTitle = '';
  editDescription = '';
  editPriority = TodoPriority.MEDIUM;
  editDueDate = '';
  editCategory = '';
  
  toggleComplete(): void {
    this.todoService.toggleComplete(this.todo.id);
  }
  
  deleteTodo(): void {
    this.todoService.deleteTodo(this.todo.id);
  }
  
  startEditing(): void {
    this.isEditing = true;
    this.editTitle = this.todo.title;
    this.editDescription = this.todo.description || '';
    this.editPriority = this.todo.priority;
    this.editCategory = this.todo.category || '';
    
    // Format date for input element
    if (this.todo.dueDate) {
      const date = new Date(this.todo.dueDate);
      this.editDueDate = date.toISOString().split('T')[0];
    } else {
      this.editDueDate = '';
    }
  }
  
  saveEdit(): void {
    if (!this.editTitle.trim()) {
      return;
    }
    
    // Convert date string to Date object if provided
    let dueDate: Date | undefined;
    if (this.editDueDate) {
      dueDate = new Date(this.editDueDate);
    }
    
    const updatedTodo: Todo = {
      ...this.todo,
      title: this.editTitle.trim(),
      description: this.editDescription.trim() || undefined,
      priority: this.editPriority,
      category: this.editCategory.trim() || undefined,
      dueDate: dueDate,
      updatedAt: new Date()
    };
    
    this.todoService.updateTodo(updatedTodo);
    this.isEditing = false;
  }
  
  cancelEdit(): void {
    this.isEditing = false;
  }
  
  isOverdue(date: Date): boolean {
    return new Date(date) < new Date() && !this.todo.completed;
  }
}