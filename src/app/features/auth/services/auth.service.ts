import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${backendServer}/api/auth`;
  private readonly skillsBase = `${backendServer}/api/skill-market`;
  private readonly profileBase = `${backendServer}/api/user`;

  constructor(private http: HttpClient) {}

  signIn(payload: SignInPayload) {
    return this.http
      .post<{ message: string; data: { user: any; token: string } }>(
        `${this.base}/logIn`,
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
    return this.http.post(`${this.base}/register`, payload);
  }

  getSkillsByName(query: string) {
    return this.http.get<any[]>(`${this.skillsBase}/?q=${query}`);
  }

  getProfile() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded: any = jwtDecode(token);
    const user = JSON.parse(decoded.user);
    const userId = user.id;

    return this.http.get(`${this.profileBase}/${userId}`);
  }
}
