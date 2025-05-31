import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  isLoading = false;
  errorMsg: string | null = null;
  returnUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get return URL from route parameters
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    console.log('SignIn: Return URL:', this.returnUrl);

    // If user is already authenticated, redirect them
    if (this.auth.isAuthenticated()) {
      this.redirectUser();
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMsg = null;
    const { email, password } = this.form.value;
    if (typeof email !== 'string' || typeof password !== 'string') {
      this.errorMsg = 'Email and password are required.';
      this.isLoading = false;
      return;
    }
    this.auth.signIn({ email, password }).subscribe({
      next: (res: any) => {
        console.log('SignIn: Login successful, redirecting...');
        this.redirectUser();
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Login failed';
        this.isLoading = false;
      },
    });
  }

  private redirectUser(): void {
    const user = this.auth.getCurrentUser();

    if (this.returnUrl) {
      // If there's a return URL, go there
      console.log('SignIn: Redirecting to return URL:', this.returnUrl);
      this.router.navigateByUrl(this.returnUrl);
    } else {
      // Default redirection based on role
      if (user && user.role === 'ADMIN') {
        this.router.navigate(['/dashboard/admin']);
      } else {
        this.router.navigate(['/dashboard/client']);
      }
    }
  }

  onGoogleSignIn() {
    this.auth.signInWithGoogle();
  }
}
