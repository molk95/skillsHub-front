import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  navigateToAbout(): void {
    this.router.navigate(['/about']);
  }

  navigateToSignup(): void {
    this.router.navigate(['/signUp']);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitError = false;

      const formData = {
        name: this.contactForm.get('name')?.value,
        email: this.contactForm.get('email')?.value,
        subject: this.contactForm.get('subject')?.value,
        message: this.contactForm.get('message')?.value,
        timestamp: new Date().toISOString()
      };

      console.log('Sending contact form:', formData);

      // Send to backend API
      this.http.post(`${environment.BASE_URL_API}contact/send`, formData)
        .subscribe({
          next: (response: any) => {
            console.log('Contact form sent successfully:', response);
            this.isSubmitting = false;
            this.submitSuccess = true;
            this.contactForm.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
              this.submitSuccess = false;
            }, 5000);
          },
          error: (error) => {
            console.error('Error sending contact form:', error);
            this.isSubmitting = false;
            this.submitError = true;

            // Hide error message after 5 seconds
            setTimeout(() => {
              this.submitError = false;
            }, 5000);
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  // Helper methods for form validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${requiredLength} characters`;
      }
    }
    return '';
  }
}
