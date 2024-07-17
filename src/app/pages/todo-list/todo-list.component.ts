import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ButtonSize, ButtonVariant } from '@core/enums/button.enum';
import { RoutePaths } from '@core/enums/route.enum';
import { TodoService } from '@core/services/todo.service';
import { Todo, TodosApiResponse } from '@core/types/todo';
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
  btnDangerVariant = ButtonVariant.Danger;
  btnSmall = ButtonSize.Small;
  checkboxLoading: boolean = false;
  currentCheckedTodoId: string | null = null;

  columns = [
    { key: 'checkbox', title: '' },
    { key: 'title', title: 'Todo title' },
    { key: 'cr_date', title: 'Created at' },
    { key: 'up_date', title: 'Updated at' },
    { key: 'actions', title: 'Actions' },
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
    this.checkboxLoading = true;
    const payload = { title: todo.title, user: todo.user, completed: val };
    this.todoService
      .updateTodo(todo.id, payload)
      .pipe(
        finalize(() => (this.checkboxLoading = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((updatedTodo: Todo) => {
        this.todos = this.todos.map((todo: Todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        );
      });
  }

  createTodo(): void {
    this.router.navigate([RoutePaths.TodoNew]);
  }

  editTodo(id: string): void {}

  deleteTodo(id: string): void {}
}
