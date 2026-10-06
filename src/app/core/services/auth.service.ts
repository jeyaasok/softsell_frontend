import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  private _currentUser = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('bracezin_token'));

  public currentUser = this._currentUser.asReadonly();
  public token = this._token.asReadonly();
  public isLoggedIn = computed(() => !!this._token());
  public isAdmin = computed(() => {
    const role = this._currentUser()?.role;
    return role === 'super_admin' || role === 'admin' || role === 'support';
  });
  public isSuperAdmin = computed(() => this._currentUser()?.role === 'super_admin');

  constructor() {
    const savedUser = localStorage.getItem('bracezin_user');
    if (savedUser) {
      try {
        this._currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        this.logout();
      }
    }

    if (this._token()) {
      this.fetchProfile().subscribe({
        error: () => this.logout()
      });
    }
  }

  register(data: any): Observable<any> {
    return this.api.post<any>('/auth/register', data).pipe(
      tap(res => {
        if (res.success && res.data?.token) {
          this.setSession(res.data.user, res.data.token);
        }
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.api.post<any>('/auth/login', credentials).pipe(
      tap(res => {
        if (res.success && res.data?.token) {
          this.setSession(res.data.user, res.data.token);
        }
      })
    );
  }

  fetchProfile(): Observable<any> {
    return this.api.get<any>('/user').pipe(
      tap(res => {
        if (res.success && res.data?.user) {
          this._currentUser.set(res.data.user);
          localStorage.setItem('bracezin_user', JSON.stringify(res.data.user));
        }
      })
    );
  }

  logout(): void {
    if (this._token()) {
      this.api.post('/auth/logout', {}).subscribe({ error: () => {} });
    }
    this._currentUser.set(null);
    this._token.set(null);
    localStorage.removeItem('bracezin_token');
    localStorage.removeItem('bracezin_user');
    this.router.navigate(['/']);
  }

  private setSession(user: User, token: string): void {
    this._currentUser.set(user);
    this._token.set(token);
    localStorage.setItem('bracezin_token', token);
    localStorage.setItem('bracezin_user', JSON.stringify(user));
  }
}

