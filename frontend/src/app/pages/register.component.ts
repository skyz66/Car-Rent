import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styles: [`
    .auth-wrap {
      min-height: calc(100vh - 62px);
      display: grid; place-items: center;
      padding: 2rem;
      background: linear-gradient(160deg, var(--paper) 60%, rgba(23,87,240,0.04) 100%);
    }
    .auth-box {
      width: min(680px, 100%);
      background: #fff; border-radius: 24px;
      border: 1px solid rgba(10,14,26,0.08);
      box-shadow: 0 16px 56px rgba(10,14,26,0.12);
      padding: 2.5rem;
    }
    .eyebrow { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--blue); margin-bottom: 0.6rem; }
    .title { font-family: var(--font-head); font-size: 1.9rem; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 6px; color: var(--ink); }
    .subtitle { font-size: 0.875rem; color: var(--ink-3); margin: 0 0 1.75rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .span-2 { grid-column: 1 / -1; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-2); }
    .field input {
      height: 46px; border-radius: 12px;
      border: 1.5px solid rgba(10,14,26,0.12);
      padding: 0 14px; font-family: var(--font-body); font-size: 0.9rem;
      color: var(--ink); background: var(--paper); outline: none;
      transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
      width: 100%; box-sizing: border-box;
    }
    .field input:focus { border-color: var(--blue); background: #fff; box-shadow: 0 0 0 3px rgba(23,87,240,0.1); }
    .section-sep { display: flex; align-items: center; gap: 12px; grid-column: 1/-1; margin: 4px 0; }
    .section-sep hr { flex: 1; border: none; height: 1px; background: rgba(10,14,26,0.08); }
    .section-sep span { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-3); white-space: nowrap; }
    .btn-register {
      width: 100%; height: 50px; border-radius: 12px; border: none;
      background: var(--blue); color: #fff; font-family: var(--font-head);
      font-size: 1rem; font-weight: 700; cursor: pointer;
      box-shadow: 0 4px 18px rgba(23,87,240,0.3); transition: all 0.18s; margin-top: 8px;
    }
    .btn-register:hover { background: var(--blue-dark); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(23,87,240,0.35); }
    .link { font-size: 0.875rem; color: var(--blue); font-weight: 500; text-decoration: none; text-align: center; display: block; margin-top: 14px; cursor: pointer; }
    .link:hover { text-decoration: underline; }
    .field-error { font-size: 0.78rem; color: #b91c1c; }
    .error-box { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 12px 16px; font-size: 0.82rem; color: #b91c1c; margin-top: 8px; }
    @media (max-width: 560px) { .form-grid { grid-template-columns: 1fr; } .span-2, .section-sep { grid-column: 1; } }
  `],
  template: `
    <div class="auth-wrap">
      <div class="auth-box">
        <div class="eyebrow">{{ t('eyebrow') }}</div>
        <h2 class="title">{{ t('title') }}</h2>
        <p class="subtitle">{{ t('subtitle') }}</p>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-grid">
            <div class="field"><label>{{ t('firstName') }}</label><input type="text" formControlName="first_name" placeholder="Ahmed Amine" /></div>
            <div class="field"><label>{{ t('lastName') }}</label><input type="text" formControlName="last_name" placeholder="Lahbib" /></div>
            <div class="field"><label>{{ t('email') }}</label><input type="email" formControlName="email" placeholder="you@example.com" /></div>
            <div class="field">
              <label>{{ t('phone') }}</label>
              <input type="tel" formControlName="phone" placeholder="12345678" />
              <div class="field-error" *ngIf="form.controls.phone.touched && form.controls.phone.errors?.['pattern']">
                Phone must contain exactly 8 digits.
              </div>
            </div>
            <div class="field span-2"><label>{{ t('password') }}</label><input type="password" formControlName="password" [placeholder]="t('passwordPh')" /></div>
            <div class="field span-2"><label>{{ t('confirmPassword') }}</label><input type="password" formControlName="confirm_password" [placeholder]="t('confirmPasswordPh')" /></div>
          </div>
          <button type="submit" class="btn-register">{{ t('submit') }}</button>
          <a class="link" routerLink="/login">{{ t('login') }}</a>
          <div class="error-box" *ngIf="error">{{ error }}</div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly phonePattern = /^\d{8}$/;
  private readonly passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  error = '';
  readonly form = this.fb.group({
    first_name: ['', [Validators.required, Validators.maxLength(100)]], last_name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]], phone: ['', Validators.pattern(this.phonePattern)],
    password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
    confirm_password: ['', Validators.required]
  });
  private readonly tr: Record<string, string> = {
    eyebrow: 'Get Started',
    title: 'Create your account',
    subtitle: 'Register once and start renting in minutes.',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone',
    password: 'Password',
    passwordPh: 'Create a strong password',
    confirmPassword: 'Confirm password',
    confirmPasswordPh: 'Re-enter your password',
    submit: 'Create Account ->',
    login: 'Already have an account? Sign in',
  };
  t(key: string): string { return this.tr[key] ?? key; }
  constructor(private readonly auth: AuthService, private readonly router: Router) {}
  submit(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = this.buildValidationErrorMessage();
      return;
    }
    const { confirm_password, ...payload } = this.form.getRawValue();
    if (payload.password !== confirm_password) {
      this.error = 'Passwords do not match';
      return;
    }
    this.auth.register(payload).subscribe({
      next: () => this.router.navigateByUrl('/cars'),
      error: err => this.error = err?.error?.error?.message ?? 'Registration failed'
    });
  }

  private buildValidationErrorMessage(): string {
    const firstName = this.form.controls.first_name;
    if (firstName.errors?.['required']) return 'First name is required.';
    if (firstName.errors?.['maxlength']) return 'First name is too long.';

    const lastName = this.form.controls.last_name;
    if (lastName.errors?.['required']) return 'Last name is required.';
    if (lastName.errors?.['maxlength']) return 'Last name is too long.';

    const email = this.form.controls.email;
    if (email.errors?.['required']) return 'Email is required.';
    if (email.errors?.['email']) return 'Email format is invalid.';

    const phone = this.form.controls.phone;
    if (phone.errors?.['pattern']) return 'Phone must contain exactly 8 digits.';

    const password = this.form.controls.password;
    if (password.errors?.['required']) return 'Password is required.';
    if (password.errors?.['pattern']) return 'Password must be at least 6 characters with at least one letter and one number.';

    const confirmPassword = this.form.controls.confirm_password;
    if (confirmPassword.errors?.['required']) return 'Please confirm your password.';

    return 'Please enter valid data in all required fields.';
  }
}

