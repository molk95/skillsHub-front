import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('AuthGuard: Checking authentication for route:', state.url);

    // Check if user is authenticated
    const isAuthenticated = this.checkAuthentication();

    if (isAuthenticated) {
      console.log('AuthGuard: User is authenticated, allowing access');
      return true;
    } else {
      console.log('AuthGuard: User not authenticated, redirecting to login');
      // Redirect to login page
      this.router.navigate(['/auth/logIn'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
  }

  private checkAuthentication(): boolean {
    try {
      // Check if user data and token exist in localStorage
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('auth_token');

      if (!userStr || !token) {
        console.log('AuthGuard: No user data or token found');
        return false;
      }

      // Parse and validate user data
      const user = JSON.parse(userStr);
      if (!user.id || !user.email) {
        console.log('AuthGuard: Invalid user data structure');
        return false;
      }

      // Optional: Check token expiration (if you have JWT)
      if (this.isTokenExpired(token)) {
        console.log('AuthGuard: Token has expired');
        this.clearAuthData();
        return false;
      }

      console.log('AuthGuard: Authentication valid for user:', user.email);
      return true;
    } catch (error) {
      console.error('AuthGuard: Error checking authentication:', error);
      this.clearAuthData();
      return false;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      // For JWT tokens, decode and check expiration
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      return currentTime > expirationTime;
    } catch (error) {
      console.error('AuthGuard: Error checking token expiration:', error);
      return true; // Consider expired if can't parse
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('google_oauth_pending');
  }
}
