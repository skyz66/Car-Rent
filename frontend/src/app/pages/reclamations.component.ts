import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ReclamationsService } from '../services/reclamations.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule],
  styles: [`
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .field label {
      font-size: 0.75rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-2);
    }
    .field input, .field textarea {
      border-radius: 12px; border: 1.5px solid rgba(10,14,26,0.12);
      padding: 12px 14px; font-family: var(--font-body); font-size: 0.9rem;
      color: var(--ink); background: var(--paper); outline: none;
      width: 100%; box-sizing: border-box;
      transition: border-color 0.18s, box-shadow 0.18s; resize: vertical;
    }
    .field input { height: 46px; padding: 0 14px; }
    .field input:focus, .field textarea:focus {
      border-color: var(--blue); background: #fff; box-shadow: 0 0 0 3px rgba(23,87,240,0.1);
    }
    .btn-submit {
      height: 44px; padding: 0 24px; border-radius: 10px; border: none;
      background: var(--blue); color: #fff; font-family: var(--font-body);
      font-size: 0.875rem; font-weight: 600; cursor: pointer;
      box-shadow: 0 2px 12px var(--blue-glow); transition: all 0.18s;
    }
    .btn-submit:hover { background: var(--blue-dark); transform: translateY(-1px); }
  `],
  template: `
    <div class="page">
      <div class="section-header">
        <span class="section-title">{{ t('title') }}</span>
        <span class="count-badge">{{ reclamations.length }} {{ t('total') }}</span>
      </div>

      <mat-card style="margin-bottom:1.5rem">
        <mat-card-content style="padding:1.5rem">
          <h3 style="font-family:var(--font-head);font-weight:700;margin:0 0 1.25rem">{{ t('newTitle') }}</h3>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="field">
              <label>{{ t('subject') }}</label>
              <input type="text" formControlName="subject" />
            </div>
            <div class="field">
              <label>{{ t('description') }}</label>
              <textarea formControlName="description" rows="4"></textarea>
            </div>
            <button type="submit" class="btn-submit">{{ t('submit') }}</button>
          </form>
          <div class="note" *ngIf="successMsg" style="margin-top:12px">{{ successMsg }}</div>
          <div class="error-note" *ngIf="errorMsg" style="margin-top:12px">{{ errorMsg }}</div>
        </mat-card-content>
      </mat-card>

      <div style="display:flex;flex-direction:column;gap:12px">
        <mat-card *ngFor="let r of reclamations">
          <mat-card-content style="padding:1.25rem">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
              <div>
                <h4 style="font-family:var(--font-head);font-weight:700;margin:0 0 4px">{{ r.subject }}</h4>
                <p class="muted" style="font-size:0.85rem;margin:0">{{ r.description }}</p>
              </div>
              <span class="status-chip" [class]="'status-' + r.status">{{ r.status }}</span>
            </div>
          </mat-card-content>
        </mat-card>
        <div *ngIf="reclamations.length === 0" class="note">{{ t('none') }}</div>
      </div>
    </div>
  `
})
export class ReclamationsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  reclamations: any[] = [];
  successMsg = '';
  errorMsg = '';

  readonly form = this.fb.group({
    subject: ['', [Validators.required, Validators.maxLength(190)]],
    description: ['', Validators.required]
  });

  private readonly tr: Record<string, string> = {
    title: 'Reclamations',
    total: 'total',
    newTitle: 'Submit a Reclamation',
    subject: 'Subject',
    description: 'Description',
    submit: 'Submit',
    none: 'No reclamations found.',
  };
  t(key: string): string { return this.tr[key] ?? key; }

  constructor(private readonly reclamationsService: ReclamationsService) {}
  ngOnInit(): void { this.reclamationsService.my().subscribe(r => this.reclamations = r); }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMsg = 'Please fill all required fields correctly.';
      return;
    }
    this.reclamationsService.create(this.form.getRawValue() as any).subscribe({
      next: () => { this.successMsg = 'Reclamation submitted.'; this.form.reset(); this.ngOnInit(); },
      error: err => this.errorMsg = err?.error?.error?.message ?? 'Failed'
    });
  }
}

