import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Credentials, User } from '@core/types/user';
import { ApiPath } from '@core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);

  public getUser(): User {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  public setUser(val: User | null): void {
    sessionStorage.setItem('user', JSON.stringify(val));
  }

  public getToken(): string | null {
    return this.getUser()?.token || null;
  }

  public login(credentials: Credentials): Observable<User> {
    return this.apiService.post(ApiPath.Login, credentials);
  }
}
