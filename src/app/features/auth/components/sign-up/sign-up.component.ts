import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  switchMap,
  distinctUntilChanged,
  map,
} from 'rxjs/operators';

function passwordMatchValidator(form: AbstractControl) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  if (password !== confirmPassword) {
    form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    // Only clear the error if it was previously set
    if (form.get('confirmPassword')?.hasError('passwordMismatch')) {
      form.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  signUpForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  skills$: Observable<any[]> = of([]);
  selectedSkills: any[] = [];
  private skillInput$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group(
      {
        fullName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        skills: [[]],
      },
      { validators: passwordMatchValidator }
    );

    this.skills$ = this.skillInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) =>
        query.length > 0 ? this.authService.getSkillsByName(query) : of([])
      )
    );
  }

  onSkillInput(event: any) {
    const value = event.target.value;
    this.skillInput$.next(value);
  }

  selectSkill(skill: any) {
    if (!this.selectedSkills.find((s) => s._id === skill._id)) {
      this.selectedSkills.push(skill);
      this.signUpForm.patchValue({ skills: this.selectedSkills });
    }
  }

  removeSkill(skill: any) {
    this.selectedSkills = this.selectedSkills.filter(
      (s) => s._id !== skill._id
    );
    this.signUpForm.patchValue({ skills: this.selectedSkills });
  }

  onSubmit() {
    this.error = null;
    this.success = null;
    if (this.signUpForm.invalid) return;
    this.loading = true;
    const { fullName, email, password, skills } = this.signUpForm.value;
    this.authService.signUp({ fullName, email, password, skills }).subscribe({
      next: () => {
        this.success = 'Registration successful! You can now log in.';
        this.loading = false;
        this.signUpForm.reset();
        this.selectedSkills = [];
        setTimeout(() => this.router.navigate(['/logIn']), 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed.';
        this.loading = false;
      },
    });
  }
}
