import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';

const backendServer = 'http://localhost:3000';

@Component({
  selector: 'app-dashboard-settings',
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.css'],
})
export class DashboardSettingsComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  profile: any = null;
  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadProfile();
  }

  initializeForms() {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  loadProfile() {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.profile = JSON.parse(userString);
      this.profileForm.patchValue({
        fullName: this.profile.fullName,
        email: this.profile.email,
      });
    }
  }

  updateProfile() {
    if (this.profileForm.valid && this.profile?.id) {
      this.loading = true;
      this.message = '';

      const updateData = this.profileForm.value;

      // Call the real API endpoint
      this.http
        .put(`${backendServer}/api/users/${this.profile.id}`, updateData)
        .subscribe({
          next: (response: any) => {
            // Update localStorage with the new data
            const updatedProfile = { ...this.profile, ...updateData };
            localStorage.setItem('user', JSON.stringify(updatedProfile));
            this.profile = updatedProfile;

            this.message = 'Profile updated successfully!';
            this.loading = false;
            setTimeout(() => (this.message = ''), 3000);
          },
          error: (error) => {
            console.error('Error updating profile:', error);
            this.message =
              error.error?.message ||
              'Failed to update profile. Please try again.';
            this.loading = false;
            setTimeout(() => (this.message = ''), 5000);
          },
        });
    }
  }

  updatePassword() {
    if (this.passwordForm.valid && this.profile?.id) {
      const { newPassword, confirmPassword, currentPassword } =
        this.passwordForm.value;
      if (newPassword !== confirmPassword) {
        this.message = 'Passwords do not match!';
        setTimeout(() => (this.message = ''), 3000);
        return;
      }

      this.loading = true;
      this.message = '';

      const passwordData = {
        currentPassword,
        newPassword,
      };

      // Call API to update password (you may need a different endpoint for password)
      this.http
        .put(
          `${backendServer}/api/users/${this.profile.id}/password`,
          passwordData
        )
        .subscribe({
          next: (response: any) => {
            this.message = 'Password updated successfully!';
            this.loading = false;
            this.passwordForm.reset();
            setTimeout(() => (this.message = ''), 3000);
          },
          error: (error) => {
            console.error('Error updating password:', error);
            this.message =
              error.error?.message ||
              'Failed to update password. Please try again.';
            this.loading = false;
            setTimeout(() => (this.message = ''), 5000);
          },
        });
    }
  }
}
