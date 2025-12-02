import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiHttpService {
  private baseUrl = environment.apiBaseUrl.replace(/\/$/, '');

  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: any): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`, options) as any;
  }

  post<T>(url: string, body: any, options?: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, options) as any;
  }

  put<T>(url: string, body: any, options?: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${url}`, body, options) as any;
  }

  delete<T>(url: string, options?: any): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${url}`, options) as any;
  }
}
