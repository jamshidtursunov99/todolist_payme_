import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'api/';
  private requestOpts = {
    headers: new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8',
    ),
  };

  public get<ResponseType>(
    path: string,
    params: Record<string, any> = {},
  ): Observable<ResponseType> {
    const options = Object.assign({}, this.requestOpts, { params });
    return this.http.get<ResponseType>(`${this.baseUrl}${path}`, options);
  }

  public post<ResponseType>(
    path: string,
    body: Record<string, any> = {},
  ): Observable<ResponseType> {
    return this.http.post<ResponseType>(
      `${this.baseUrl}${path}`,
      JSON.stringify(body),
      this.requestOpts,
    );
  }

  public put<ResponseType>(
    path: string,
    body: Record<string, any> = {},
  ): Observable<ResponseType> {
    return this.http.put<ResponseType>(
      `${this.baseUrl}${path}`,
      JSON.stringify(body),
      this.requestOpts,
    );
  }

  public patch<ResponseType>(
    path: string,
    body: Record<string, any> = {},
  ): Observable<ResponseType> {
    return this.http.patch<ResponseType>(
      `${this.baseUrl}${path}`,
      JSON.stringify(body),
      this.requestOpts,
    );
  }

  public delete<ResponseType>(path: string): Observable<ResponseType> {
    return this.http.delete<ResponseType>(
      `${this.baseUrl}${path}`,
      this.requestOpts,
    );
  }
}
