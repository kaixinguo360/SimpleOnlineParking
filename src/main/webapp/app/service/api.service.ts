import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';

import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

export interface Message {
  timestamp: number;
  status: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private root = environment.apiRoot;
  private authService: AuthService;

  public setAuthService(authService: AuthService) {
    this.authService = authService;
  }

  public get<T>(path: string, params?: { [param: string]: string | string[] }, needAuth: boolean = true, responseType?: string): Observable<T> {
    const headers = needAuth ? { Authorization: this.authService.getToken() } : null;
    return this.http.get<T>(this.root + path, {
      params: params,
      headers: headers,
      responseType: responseType as 'json',
    }).pipe(
      catchError(err => {
        this.handleError(err, needAuth);
        return throwError(err);
      })
    );
  }

  public post<T>(path: string, body?: any, needAuth: boolean = true): Observable<T> {
    const headers = needAuth ? { Authorization: this.authService.getToken() } : null;
    return this.http.post<T>(this.root + path,  body, {
      headers: headers
    }).pipe(
      catchError(err => {
        this.handleError(err, needAuth);
        return throwError(err);
      })
    );
  }

  public put<T>(path: string, body?: any, needAuth: boolean = true): Observable<T> {
    const headers = needAuth ? { Authorization: this.authService.getToken() } : null;
    return this.http.put<T>(this.root + path,  body, {
      headers: headers
    }).pipe(
      catchError(err => {
        this.handleError(err, needAuth);
        return throwError(err);
      })
    );
  }

  public delete<T>(path: string, body?: any, needAuth: boolean = true): Observable<T> {
    const headers = needAuth ? { Authorization: this.authService.getToken() } : null;
    return this.http.request<T>('delete', this.root + path, {
      body: body,
      headers: headers
    }).pipe(
      catchError(err => {
        this.handleError(err, needAuth);
        return throwError(err);
      })
    );
  }

  public request<T>(type: string,
                    path: string,
                    body?: any,
                    params?: HttpParams | { [param: string]: string | string[]; },
                    needAuth: boolean = true): Observable<T> {
    const headers = needAuth ? { Authorization: this.authService.getToken() } : null;
    return this.http.request<T>(type, this.root + path, {
      body: body,
      params: params,
      headers: headers
    }).pipe(
      catchError(err => {
        this.handleError(err, needAuth);
        return throwError(err);
      })
    );
  }

  private handleError(err, needAuth: boolean) {
    if (err instanceof HttpErrorResponse && err.status === 401) {
      this.authService.clearToken();
      if (needAuth) {
        this.router.navigate([ '' ]);
      }
    }
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
}
