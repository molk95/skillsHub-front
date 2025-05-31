import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  loading = false;
  message: string = '';
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Get token from URL params
    this.token = this.route.snapshot.params['token'];
    if (!this.token) {
      this.error = 'Invalid reset token';
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    if (confirmPassword?.hasError('mismatch')) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  onSubmit(): void {
    if (this.resetForm.valid && this.token) {
      this.loading = true;
      this.error = '';
      this.message = '';

      const payload = {
        token: this.token,
        password: this.resetForm.value.password,
      };

      this.authService.resetPassword(payload).subscribe({
        next: (response) => {
          this.loading = false;
          this.message = response.message || 'Password reset successfully!';

          // Redirect to login after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/auth/logIn']);
          }, 3000);
        },
        error: (err) => {
          this.loading = false;
          this.error =
            err.error?.message || 'Failed to reset password. Please try again.';
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.resetForm.controls).forEach((key) => {
        this.resetForm.get(key)?.markAsTouched();
      });
    }
  }

  get password() {
    return this.resetForm.get('password');
  }
  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }
}
