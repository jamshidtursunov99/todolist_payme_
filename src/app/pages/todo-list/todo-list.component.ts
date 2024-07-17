import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ButtonSize, ButtonVariant } from '@core/enums/button.enum';
import { RoutePaths } from '@core/enums/route.enum';
import { TodoService } from '@core/services/todo.service';
import { Todo, TodoPayload, TodosApiResponse } from '@core/types/todo';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'payme-todo-list',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, CheckboxComponent, ButtonComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit {
  todoService = inject(TodoService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  todos: Todo[] = [];
  todosLoading: boolean = false;
  btnOutlinedVariant = ButtonVariant.Outlined;
  btnSuccessVariant = ButtonVariant.Success;
  btnDangerVariant = ButtonVariant.Danger;
  btnSmall = ButtonSize.Small;
  editingLoading: boolean = false;
  currentCheckedTodoId: string | null = null;
  editingTodoId = signal<string>('');
  editingTodoTitle = '';

  columns = [
    { key: 'checkbox', title: '' },
    { key: 'title', title: 'Todo title' },
    { key: 'cr_date', title: 'Created at' },
    { key: 'up_date', title: 'Updated at' },
    { key: 'actions', title: '' },
  ];

  ngOnInit(): void {
    this.fetchTodos();
  }

  fetchTodos(): void {
    this.todosLoading = true;
    this.todoService
      .getTodos()
      .pipe(
        finalize(() => (this.todosLoading = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res: TodosApiResponse) => (this.todos = res.results));
  }

  onCheckToggle(val: boolean, todo: Todo): void {
    this.currentCheckedTodoId = todo.id;
    const payload = { title: todo.title, user: todo.user, completed: val };
    this.updateTodo(todo.id, payload);
  }

  createTodo(): void {
    this.router.navigate([RoutePaths.TodoNew]);
  }

  editTodo(todo: Todo): void {
    const isDone = this.editingTodoId() == todo.id;
    this.editingTodoId.set(isDone ? '' : todo.id);
    const hasChanges =
      !!this.editingTodoTitle && this.editingTodoTitle !== todo.title;

    if (isDone && hasChanges) {
      this.updateTodo(todo.id, { ...todo, title: this.editingTodoTitle });
    }
  }

  public handleInputChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.editingTodoTitle = value;
  }

  deleteTodo(id: string): void {
    this.todoService
      .deleteTodo(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        () => (this.todos = this.todos.filter((todo: Todo) => todo.id !== id)),
      );
  }

  updateTodo(id: string, payload: TodoPayload): void {
    this.editingLoading = true;
    this.todoService
      .updateTodo(id, payload)
      .pipe(
        finalize(() => (this.editingLoading = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((updatedTodo: Todo) => {
        this.todos = this.todos.map((todo: Todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        );
      });
  }
}
