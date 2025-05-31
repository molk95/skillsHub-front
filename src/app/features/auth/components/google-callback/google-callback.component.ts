import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-google-callback',
  templateUrl: './google-callback.component.html',
  styleUrls: ['./google-callback.component.css'],
})
export class GoogleCallbackComponent implements OnInit {
  loading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Check for token and user data in URL parameters
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const user = params['user'];
      const error = params['error'];

      if (error) {
        this.error = 'Google authentication failed. Please try again.';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/auth/logIn']);
        }, 3000);
        return;
      }

      if (token && user) {
        try {
          // Store the token and user data
          localStorage.setItem('auth_token', token);
          const userData = JSON.parse(decodeURIComponent(user));

          // Map the user data to match the expected format
          const mappedUserData = {
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName,
            role: userData.userRole || userData.role || 'CLIENT', // Handle different role field names
            skills: userData.skills || userData.validatedSkills || [],
          };

          localStorage.setItem('user', JSON.stringify(mappedUserData));

          // Redirect based on user role
          if (mappedUserData.role === 'ADMIN') {
            this.router.navigate(['/dashboard/admin']);
          } else {
            this.router.navigate(['/dashboard/client']);
          }
        } catch (err) {
          this.error = 'Failed to process authentication data.';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/auth/logIn']);
          }, 3000);
        }
      } else {
        this.error = 'Invalid authentication response.';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/auth/logIn']);
        }, 3000);
      }
    });
  }
}
