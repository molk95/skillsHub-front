import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent {
  constructor(private router: Router, private authService: AuthService) {}

  goHome(): void {
    // Check if user is authenticated to redirect appropriately
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      if (user?.role === 'ADMIN' || user?.userRole === 'ADMIN') {
        this.router.navigate(['/dashboard/admin']);
      } else {
        this.router.navigate(['/dashboard/client']);
      }
    } else {
      this.router.navigate(['/home']);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/logIn']);
  }

  goToHomePage(): void {
    this.router.navigate(['/home']);
  }
}
