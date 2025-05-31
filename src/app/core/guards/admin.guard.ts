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
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('AdminGuard: Checking admin access for route:', state.url);

    // First check if user is authenticated
    const isAuthenticated = this.checkAuthentication();
    if (!isAuthenticated) {
      console.log('AdminGuard: User not authenticated, redirecting to login');
      this.router.navigate(['/auth/logIn']);
      return false;
    }

    // Check if user has admin role
    const isAdmin = this.checkAdminRole();
    if (isAdmin) {
      console.log('AdminGuard: User has admin access, allowing access');
      return true;
    } else {
      console.log(
        'AdminGuard: User is not admin, redirecting to client dashboard'
      );
      // Redirect non-admin users to client dashboard
      this.router.navigate(['/dashboard/client']);
      return false;
    }
  }

  private checkAuthentication(): boolean {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('auth_token');

      return !!(userStr && token);
    } catch (error) {
      return false;
    }
  }

  private checkAdminRole(): boolean {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return false;

      const user = JSON.parse(userStr);

      // Check if user role is ADMIN
      const isAdmin = user.role === 'ADMIN' || user.userRole === 'ADMIN';

      console.log('AdminGuard: User role check:', {
        role: user.role,
        userRole: user.userRole,
        isAdmin,
      });

      return isAdmin;
    } catch (error) {
      console.error('AdminGuard: Error checking admin role:', error);
      return false;
    }
  }
}
