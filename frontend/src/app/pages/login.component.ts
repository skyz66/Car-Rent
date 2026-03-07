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
      display: grid;
      place-items: center;
      padding: 2rem;
      background: linear-gradient(160deg, var(--paper) 60%, rgba(23,87,240,0.04) 100%);
    }
    .auth-box {
      width: min(460px, 100%);
      background: #fff;
      border-radius: 24px;
      border: 1px solid rgba(10,14,26,0.08);
      box-shadow: 0 16px 56px rgba(10,14,26,0.12);
      padding: 2.5rem;
    }
    .eyebrow {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--blue);
      margin-bottom: 0.6rem;
    }
    .title {
      font-family: var(--font-head);
      font-size: 1.9rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0 0 6px;
      color: var(--ink);
    }
    .subtitle {
      font-size: 0.875rem;
      color: var(--ink-3);
      margin: 0 0 2rem;
    }
    .form { display: flex; flex-direction: column; gap: 14px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--ink-2);
    }
    .field input {
      height: 48px;
      border-radius: 12px;
      border: 1.5px solid rgba(10,14,26,0.12);
      padding: 0 16px;
      font-family: var(--font-body);
      font-size: 0.95rem;
      color: var(--ink);
      background: var(--paper);
      outline: none;
      transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
      width: 100%;
      box-sizing: border-box;
    }
    .field input:focus {
      border-color: var(--blue);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(23,87,240,0.1);
    }
    .btn-signin {
      height: 50px;
      border-radius: 12px;
      border: none;
      background: var(--blue);
      color: #fff;
      font-family: var(--font-head);
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(23,87,240,0.3);
      transition: all 0.18s;
      margin-top: 4px;
    }
    .btn-signin:hover { background: var(--blue-dark); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(23,87,240,0.35); }
    .divider { height: 1px; background: rgba(10,14,26,0.08); margin: 4px 0; }
    .link {
      font-size: 0.875rem; color: var(--blue); font-weight: 500;
      text-decoration: none; text-align: center; cursor: pointer;
    }
    .link:hover { text-decoration: underline; }
    .error-box {
      background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2);
      border-radius: 10px; padding: 12px 16px;
      font-size: 0.82rem; color: #b91c1c;
    }
  `],
  template: `
    <div class="auth-wrap">
      <div class="auth-box">
        <div class="eyebrow">{{ t('eyebrow') }}</div>
        <h2 class="title">{{ t('title') }}</h2>
        <p class="subtitle">{{ t('subtitle') }}</p>
        <form [formGroup]="form" (ngSubmit)="submit()" class="form">
          <div class="field">
            <label>{{ t('email') }}</label>
            <input type="email" formControlName="email" [placeholder]="t('emailPh')" />
          </div>
          <div class="field">
            <label>{{ t('password') }}</label>
            <input type="password" formControlName="password" placeholder="••••••••" />
          </div>
          <button type="submit" class="btn-signin">{{ t('submit') }}</button>
          <div class="divider"></div>
          <a class="link" routerLink="/register">{{ t('register') }}</a>
          <div class="error-box" *ngIf="error">{{ error }}</div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  error = '';
  lang: 'en' | 'fr' = 'en';
  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  private tr: Record<string, Record<string, string>> = {
    en: {
      eyebrow: 'Customer Portal', title: 'Welcome back',
      subtitle: 'Log in to book cars and manage your rentals.',
      email: 'Email address', emailPh: 'you@example.com',
      password: 'Password', submit: 'Sign in →',
      register: "Don't have an account? Create one →",
    },
    fr: {
      eyebrow: 'Espace Client', title: 'Bon retour',
      subtitle: 'Connectez-vous pour réserver et gérer vos locations.',
      email: 'Adresse e-mail', emailPh: 'vous@exemple.com',
      password: 'Mot de passe', submit: 'Se connecter →',
      register: 'Pas encore de compte ? Créez-en un →',
    }
  };
  t(key: string): string { return this.tr[this.lang]?.[key] ?? this.tr['en'][key] ?? key; }
  constructor(private readonly auth: AuthService, private readonly router: Router) {}
  submit(): void {
    if (this.form.invalid) return;
    const { email, password } = this.form.getRawValue();
    this.auth.login(email!, password!).subscribe({
      next: data => this.router.navigateByUrl(data.user.role === 'admin' ? '/admin/dashboard' : '/cars'),
      error: err => this.error = err?.error?.error?.message ?? 'Login failed'
    });
  }
}
