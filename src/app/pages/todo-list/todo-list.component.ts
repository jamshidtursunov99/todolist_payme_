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

type EditingTodo = {
  id: string;
  title: string;
  isEditing: boolean;
};

const defaultTodoEditing = {
  id: '',
  title: '',
  isEditing: false,
};

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
  currentCheckedTodoId: string | null = null;
  editingTodo = signal<EditingTodo>(defaultTodoEditing);
  todoUpdateLoading = signal<boolean>(false);

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
    this.editingTodo.update((details) => ({
      ...details,
      id: todo.id,
      isEditing: !this.editingTodo().isEditing,
    }));
    const { id, title, isEditing } = this.editingTodo();
    const noTitleChanges = (id && title === todo.title && !isEditing) || !title;

    if (noTitleChanges && !isEditing) {
      this.reset();
    }

    if (!noTitleChanges) {
      this.updateTodo(todo.id, { ...todo, title });
    }
  }

  public handleInputChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.editingTodo.update((details) => ({ ...details, title: value }));
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
    this.todoUpdateLoading.set(true);
    this.todoService
      .updateTodo(id, payload)
      .pipe(
        finalize(() => this.reset()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((updatedTodo: Todo) => {
        this.todos = this.todos.map((todo: Todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        );
      });
  }

  reset(): void {
    this.editingTodo.set(defaultTodoEditing);
    this.currentCheckedTodoId = null;
    this.todoUpdateLoading.set(false);
  }
}
