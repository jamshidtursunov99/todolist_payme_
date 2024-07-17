import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Credentials } from '@core/types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);

  public getUser(): any {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  public setUser(val: any): void {
    sessionStorage.setItem('user', JSON.stringify(val));
  }

  public getToken(): string | null {
    return this.getUser()?.token || null;
  }

  public login(credentials: Credentials): Observable<any> {
    return this.apiService.post('auth/token/login/', credentials);
  }
}
