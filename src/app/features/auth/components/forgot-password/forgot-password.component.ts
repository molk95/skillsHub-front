import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  loading = false;
  message: string = '';
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      this.error = '';
      this.message = '';

      const payload = {
        email: this.forgotPasswordForm.value.email,
      };

      this.authService.forgotPassword(payload).subscribe({
        next: (response) => {
          this.loading = false;
          this.message =
            response.message || 'Password reset link sent to your email!';

          // Redirect to login after 5 seconds
          setTimeout(() => {
            this.router.navigate(['/auth/logIn']);
          }, 5000);
        },
        error: (err) => {
          this.loading = false;
          this.error =
            err.error?.message ||
            'Failed to send reset email. Please try again.';
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.forgotPasswordForm.controls).forEach((key) => {
        this.forgotPasswordForm.get(key)?.markAsTouched();
      });
    }
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }
}
