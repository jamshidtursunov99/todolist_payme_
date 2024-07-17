import { Component, DestroyRef, inject, signal } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  Validators,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonVariant } from '@core/enums/button.enum';
import { RoutePaths } from '@core/enums/route.enum';
import { AuthService } from '@core/services/auth.service';
import { TodoService } from '@core/services/todo.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'payme-todo-new',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    ButtonComponent,
    SpinnerComponent,
  ],
  templateUrl: './todo-new.component.html',
  styleUrl: './todo-new.component.scss',
})
export class TodoNewComponent {
  public router = inject(Router);
  public authService = inject(AuthService);
  public todoService = inject(TodoService);
  public destroyRef = inject(DestroyRef);
  public btnOutlinedVariant = ButtonVariant.Outlined;
  public title = new FormControl<string>('', [Validators.required]);
  public status = toSignal(this.title.statusChanges);
  public todoFailMsg = signal<string>('');
  public loading = signal<boolean>(false);
  public invalid = 'INVALID';

  get titleErrors(): ValidationErrors | null {
    const control = this.title;
    return control?.invalid && (control?.touched || control?.dirty)
      ? control.errors
      : null;
  }

  public cancel(): void {
    this.router.navigate([RoutePaths.TodoList]);
  }

  public submit(): void {
    if (this.title.valid) {
      this.loading.set(true);
      const user = this.authService.getUser();
      const payload = {
        title: this.title.value!,
        completed: false,
        user: user.user_id,
      };

      this.todoService
        .createTodo(payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => {
            this.loading.set(false);
            this.todoFailMsg.set('');
            this.router.navigate([RoutePaths.TodoList]);
          },
          error: ({ error }) => {
            this.todoFailMsg.set(error.message);
            this.loading.set(false);
          },
        });
    }
  }
}
