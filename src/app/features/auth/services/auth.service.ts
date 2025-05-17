import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
const backendServer = 'http://localhost:3000';
interface SignInPayload {
  email: string;
  password: string;
}
interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${backendServer}/api/auth`;

  constructor(private http: HttpClient) {}

  signIn(payload: SignInPayload) {
    return this.http
      .post<{ token: string }>(`${this.base}/login`, payload)
      .pipe(tap((res) => localStorage.setItem('auth_token', res.token)));
  }

  signUp(payload: SignUpPayload) {
    return this.http.post(`${this.base}/register`, payload);
  }
}
