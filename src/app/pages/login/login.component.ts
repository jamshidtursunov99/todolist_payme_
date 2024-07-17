import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonVariant } from '@core/enums/button.enum';
import { RoutePaths } from '@core/enums/route.enum';
import { AuthService } from '@core/services/auth.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'payme-login',
  standalone: true,
  imports: [
    FormFieldComponent,
    ButtonComponent,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public router = inject(Router);
  public authService = inject(AuthService);
  public destroyRef = inject(DestroyRef);
  public btnOutlinedVariant = ButtonVariant.Outlined;
  public loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });
  public status = toSignal(this.loginForm.statusChanges);
  public loginFailMsg = signal<string>('');
  public loading = signal<boolean>(false);
  public hint = { email: 'nurlan@payme.uz', password: '12345678' };

  get emailErrors(): ValidationErrors | null {
    const control = this.loginForm.get('email');
    return control?.invalid && (control?.touched || control?.dirty)
      ? control.errors
      : null;
  }

  get passwordErrors(): ValidationErrors | null {
    const control = this.loginForm.get('password');
    return control?.invalid && (control?.touched || control?.dirty)
      ? control.errors
      : null;
  }

  public cancel(): void {
    this.router.navigate([RoutePaths.Dashboard]);
  }

  public submit(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      const { email, password } = this.loginForm.value;
      this.authService
        .login({ email: email!, password: password! })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => {
            this.loading.set(false);
            this.loginFailMsg.set('');
            this.authService.setUser(data);
            this.router.navigate([RoutePaths.Dashboard]);
          },
          error: ({ error }) => {
            this.loginFailMsg.set(error.message);
            this.loading.set(false);
          },
        });
    }
  }
}
