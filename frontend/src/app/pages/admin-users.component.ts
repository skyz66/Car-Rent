import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '../services/admin.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule],
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .span-full { grid-column: 1 / -1; }
    .field { display: flex; flex-direction: column; gap: 5px; }
    .field label {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--ink-3);
    }
    .field input, .field select {
      height: 42px;
      border-radius: 10px;
      border: 1.5px solid rgba(10,14,26,0.12);
      padding: 0 12px;
      font-family: var(--font-body);
      font-size: 0.875rem;
      color: var(--ink);
      background: var(--paper);
      outline: none;
      transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
      width: 100%;
      box-sizing: border-box;
    }
    .field input:focus, .field select:focus {
      border-color: var(--blue);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(23,87,240,0.08);
    }
    .form-actions { display: flex; gap: 8px; align-items: center; }
    .btn-submit {
      height: 42px; padding: 0 20px; border-radius: 10px; border: none;
      background: var(--blue); color: #fff; font-family: var(--font-body);
      font-size: 0.875rem; font-weight: 600; cursor: pointer;
      box-shadow: 0 2px 12px var(--blue-glow); transition: all 0.18s;
    }
    .btn-submit:hover { background: var(--blue-dark); transform: translateY(-1px); }
    .btn-cancel {
      height: 42px; padding: 0 16px; border-radius: 10px;
      border: 1.5px solid rgba(10,14,26,0.15); background: transparent;
      color: var(--ink-2); font-family: var(--font-body); font-size: 0.875rem;
      font-weight: 500; cursor: pointer; transition: all 0.18s;
    }
    .btn-cancel:hover { background: rgba(10,14,26,0.05); }
    .btn-edit {
      height: 34px; padding: 0 14px; border-radius: 8px;
      border: 1.5px solid rgba(23,87,240,0.25); background: transparent;
      color: var(--blue); font-family: var(--font-body); font-size: 0.8rem;
      font-weight: 600; cursor: pointer; transition: all 0.18s;
    }
    .btn-edit:hover { background: rgba(23,87,240,0.06); }
    .btn-delete {
      height: 34px; padding: 0 14px; border-radius: 8px;
      border: 1.5px solid rgba(239,68,68,0.25); background: transparent;
      color: #ef4444; font-family: var(--font-body); font-size: 0.8rem;
      font-weight: 600; cursor: pointer; transition: all 0.18s;
    }
    .btn-delete:hover { background: rgba(239,68,68,0.06); }
    .form-error {
      margin-top: 1rem;
      padding: 12px 14px;
      border-radius: 10px;
      background: rgba(239,68,68,0.06);
      border: 1px solid rgba(239,68,68,0.14);
      color: #b91c1c;
      font-size: 0.82rem;
    }
    .table {
      display: grid;
      gap: 10px;
    }
    .row {
      display: grid;
      grid-template-columns: 1.2fr 1.4fr 1fr 0.8fr 120px;
      gap: 10px;
      align-items: center;
      padding: 12px 14px;
      background: var(--card);
      border: 1px solid rgba(10,14,26,0.07);
      border-radius: var(--r);
      box-shadow: var(--shadow);
    }
    .row.head {
      background: transparent;
      border: none;
      box-shadow: none;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ink-3);
      padding: 0 6px;
    }
    .actions { display: flex; gap: 6px; justify-content: flex-end; }
    @media (max-width: 900px) {
      .form-grid { grid-template-columns: 1fr 1fr; }
      .row { grid-template-columns: 1fr 1fr; }
      .row.head { display: none; }
      .actions { justify-content: flex-start; }
    }
    @media (max-width: 560px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `],
  template: `
    <div class="page">
      <div class="section-header">
        <span class="section-title">Users</span>
        <span class="count-badge">{{ users.length }} users</span>
      </div>

      <mat-card style="margin-bottom:1.5rem">
        <mat-card-content style="padding:1.5rem">
          <h3 style="font-family:var(--font-head);font-weight:700;margin:0 0 1.25rem">
            {{ editingUserId ? 'Edit User' : 'Add User' }}
          </h3>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="form-grid">
              <div class="field"><label>First name</label><input type="text" formControlName="first_name" /></div>
              <div class="field"><label>Last name</label><input type="text" formControlName="last_name" /></div>
              <div class="field"><label>Email</label><input type="email" formControlName="email" /></div>
              <div class="field"><label>Phone</label><input type="text" formControlName="phone" /></div>
              <div class="field">
                <label>Role</label>
                <select formControlName="role">
                  <option value="customer">customer</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div class="field">
                <label>Password {{ editingUserId ? '(optional)' : '' }}</label>
                <input type="password" formControlName="password" />
              </div>
            </div>
            <div class="form-actions" style="margin-top:1rem">
              <button type="submit" class="btn-submit">{{ editingUserId ? 'Update User' : 'Add User' }}</button>
              <button type="button" class="btn-cancel" *ngIf="editingUserId" (click)="cancelEdit()">Cancel</button>
            </div>
            <div class="form-error" *ngIf="submitError">{{ submitError }}</div>
          </form>
        </mat-card-content>
      </mat-card>

      <div class="table">
        <div class="row head">
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Role</div>
          <div>Action</div>
        </div>
        <div class="row" *ngFor="let user of users">
          <div>{{ user.first_name }} {{ user.last_name }}</div>
          <div>{{ user.email }}</div>
          <div>{{ user.phone || '-' }}</div>
          <div><span class="status-chip" [class]="'status-' + user.role">{{ user.role }}</span></div>
          <div class="actions">
            <button class="btn-edit" (click)="startEdit(user)">Edit</button>
            <button class="btn-delete" (click)="delete(user)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  editingUserId: number | null = null;
  submitError = '';
  private readonly fb = inject(FormBuilder);
  private readonly phonePattern = /^\+?[0-9 ]{8,15}$/;
  private readonly passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  private readonly defaultFormValues = {
    first_name: '', last_name: '', email: '', phone: '', role: 'customer', password: ''
  };

  readonly form = this.fb.group({
    first_name: ['', [Validators.required, Validators.maxLength(100)]],
    last_name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.pattern(this.phonePattern)],
    role: ['customer', [Validators.required, Validators.pattern(/^(customer|admin)$/)]],
    password: ['', Validators.pattern(this.passwordPattern)],
  });

  constructor(private readonly adminService: AdminService) {}

  ngOnInit(): void { this.loadUsers(); }

  submit(): void {
    this.submitError = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submitError = 'Please fix validation errors before submitting.';
      return;
    }

    const payload = this.form.getRawValue() as Record<string, unknown>;
    const password = String(payload['password'] ?? '').trim();
    if (this.editingUserId === null && password === '') {
      this.submitError = 'Password is required when creating a user.';
      return;
    }

    if (this.editingUserId !== null) {
      this.adminService.updateUser(this.editingUserId, payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadUsers();
        },
        error: err => this.submitError = err?.error?.error?.message ?? 'Failed to update user.'
      });
      return;
    }

    this.adminService.createUser(payload).subscribe({
      next: () => {
        this.resetForm();
        this.loadUsers();
      },
      error: err => this.submitError = err?.error?.error?.message ?? 'Failed to add user.'
    });
  }

  startEdit(user: any): void {
    this.submitError = '';
    this.editingUserId = user.id;
    this.form.patchValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone ?? '',
      role: user.role,
      password: ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void { this.resetForm(); }

  delete(user: any): void {
    const label = `${user.first_name} ${user.last_name}`.trim();
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    if (!window.confirm(`Final confirmation: permanently delete ${label}?`)) return;
    this.adminService.deleteUser(user.id).subscribe(() => {
      if (this.editingUserId === user.id) this.resetForm();
      this.loadUsers();
    });
  }

  private loadUsers(): void { this.adminService.users().subscribe(rows => this.users = rows); }
  private resetForm(): void { this.editingUserId = null; this.submitError = ''; this.form.reset(this.defaultFormValues); }
}
