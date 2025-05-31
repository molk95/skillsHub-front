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
  skills?: any[];
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApi = `${backendServer}/api/auth`;
  private readonly skillsBase = `${backendServer}/api/skill-market`;
  private readonly profileBase = `${backendServer}/api/users`;

  constructor(private http: HttpClient) {}

  signIn(payload: SignInPayload) {
    return this.http
      .post<{ message: string; data: { user: any; token: string } }>(
        `${this.authApi}/logIn`,
        payload
      )
      .pipe(
        tap((res) => {
          localStorage.setItem('auth_token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        })
      );
  }

  signUp(payload: SignUpPayload) {
    return this.http.post(`${this.authApi}/register`, payload);
  }

  getSkillsByName(query: string) {
    return this.http.get<any[]>(`${this.skillsBase}/?q=${query}`);
  }

  getProfile() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    const userId = user.id;
    return this.http.get(`${this.profileBase}/${userId}`);
  }

  forgotPassword(payload: ForgotPasswordPayload) {
    return this.http.post<{ message: string }>(
      `${this.authApi}/forgot-password`,
      payload
    );
  }

  resetPassword(payload: ResetPasswordPayload) {
    return this.http.post<{ message: string }>(
      `${this.authApi}/reset-password`,
      payload
    );
  }
}
