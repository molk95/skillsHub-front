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

  signInWithGoogle() {
    // Create the frontend callback URL
    const frontendCallbackUrl = `${window.location.origin}/auth/google/callback`;

    // Store the callback URL for the backend to use
    localStorage.setItem('redirectUrl', frontendCallbackUrl);

    // Redirect to Google OAuth endpoint with frontend callback URL
    window.location.href = `${
      this.authApi
    }/google?redirect_uri=${encodeURIComponent(frontendCallbackUrl)}`;
  }

  processGoogleAuthResponse(authData: any) {
    // Process the authentication data from Google OAuth response
    if (authData && authData.user && authData.token) {
      const mappedUserData = {
        id: authData.user.id,
        email: authData.user.email,
        fullName: authData.user.fullName,
        role: authData.user.userRole || authData.user.role || 'CLIENT',
        skills: authData.user.skills || authData.user.validatedSkills || [],
      };

      localStorage.setItem('auth_token', authData.token);
      localStorage.setItem('user', JSON.stringify(mappedUserData));

      return mappedUserData;
    }
    return null;
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

  // Logout method
  logout(): void {
    console.log('AuthService: Logging out user');

    // Clear all authentication data
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('google_oauth_pending');

    // Additional cleanup if needed
    sessionStorage.clear();

    console.log('AuthService: User logged out successfully');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('auth_token');

      return !!(userStr && token);
    } catch (error) {
      return false;
    }
  }

  // Get current user
  getCurrentUser(): any {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }
}
