import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

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
        const user = res.data.user;
        if (user && user.role === 'ADMIN') {
          this.router.navigate(['/dashboard/admin']);
        } else {
          this.router.navigate(['/dashboard/client']);
        }
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Login failed';
        this.isLoading = false;
      },
    });
  }
}
