import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule],
  styles: [`
    .profile-card { max-width: 560px; margin: 0 auto; }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .field label {
      font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-2);
    }
    .field input {
      height: 46px; border-radius: 12px; border: 1.5px solid rgba(10,14,26,0.12);
      padding: 0 14px; font-family: var(--font-body); font-size: 0.9rem;
      color: var(--ink); background: var(--paper); outline: none;
      width: 100%; box-sizing: border-box; transition: border-color 0.18s, box-shadow 0.18s;
    }
    .field input:focus { border-color: var(--blue); background: #fff; box-shadow: 0 0 0 3px rgba(23,87,240,0.1); }
    .field input[readonly] { background: #f3f4f8; color: var(--ink-3); }
    .btn-submit {
      height: 44px; border-radius: 10px; border: none;
      background: var(--blue); color: #fff; font-family: var(--font-body);
      font-size: 0.9rem; font-weight: 600; cursor: pointer;
      box-shadow: 0 2px 14px var(--blue-glow); transition: all 0.18s;
    }
    .btn-submit:hover { background: var(--blue-dark); transform: translateY(-1px); }
    .note { font-size: 0.85rem; margin-top: 10px; }
    .note.success { color: #0f766e; }
    .note.error { color: #b91c1c; }
  `],
  template: `
    <div class="page">
      <mat-card class="profile-card">
        <mat-card-content style="padding:1.75rem">
          <div class="section-header" style="margin-bottom:1rem">
            <span class="section-title">Profile</span>
          </div>
          <div class="field">
            <label>Email</label>
            <input type="email" [value]="email" readonly />
          </div>

          <h3 style="font-family:var(--font-head);font-size:1.05rem;font-weight:700;margin:0.75rem 0 0.5rem">Change Password</h3>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="field">
              <label>Current password</label>
              <input type="password" formControlName="current_password" />
            </div>
            <div class="field"><label>New password</label><input type="password" formControlName="new_password" /></div>
            <div class="field"><label>Confirm new password</label><input type="password" formControlName="confirm_password" /></div>
            <button class="btn-submit" type="submit">Update Password</button>
          </form>

          <div class="note success" *ngIf="successMessage">{{ successMessage }}</div>
          <div class="note error" *ngIf="errorMessage">{{ errorMessage }}</div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  successMessage = '';
  errorMessage = '';

  readonly form = this.fb.group({
    current_password: [''],
    new_password: ['', [Validators.required, Validators.minLength(6)]],
    confirm_password: ['', Validators.required],
  });

  get email(): string {
    return this.auth.currentUser()?.email ?? '';
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.form.invalid) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }
    const { current_password, new_password, confirm_password } = this.form.getRawValue();
    if (new_password !== confirm_password) {
      this.errorMessage = 'New passwords do not match.';
      return;
    }
    this.auth.changePassword(current_password!, new_password!).subscribe({
      next: () => {
        this.form.reset({ current_password: '', new_password: '', confirm_password: '' });
        this.successMessage = 'Password updated successfully.';
      },
      error: (err) => {
        this.errorMessage = err?.error?.error?.message ?? 'Failed to update password.';
      }
    });
  }
}
