import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Todo, TodoPayload, TodosApiResponse } from '@core/types/todo';
import { ApiPath } from '@core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiService = inject(ApiService);

  public getTodos(): Observable<TodosApiResponse> {
    return this.apiService.get<TodosApiResponse>(ApiPath.Todo);
  }

  public updateTodo(id: string, payload: TodoPayload): Observable<Todo> {
    return this.apiService.put<Todo>(`${ApiPath.Todo}/${id}/`, payload);
  }

  public createTodo(payload: TodoPayload): Observable<Todo> {
    return this.apiService.post<Todo>(ApiPath.Todo, payload);
  }

  public deleteTodo(id: string): Observable<void> {
    return this.apiService.delete<void>(`${ApiPath.Todo}/${id}/`);
  }
}
