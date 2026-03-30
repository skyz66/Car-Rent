import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CarsService } from '../services/cars.service';
import { Car } from '../models/types';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule],
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .field { display: flex; flex-direction: column; gap: 5px; }
    .field label {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--ink-3);
    }
    .field input,
    .field select {
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
    .field input:focus,
    .field select:focus {
      border-color: var(--blue);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(23,87,240,0.08);
    }
    .field input.invalid,
    .field select.invalid {
      border-color: rgba(239,68,68,0.55);
      background: rgba(239,68,68,0.03);
    }
    .error-text {
      font-size: 0.76rem;
      color: #b91c1c;
      line-height: 1.35;
    }
    .form-error {
      margin-top: 1rem;
      padding: 12px 14px;
      border-radius: 10px;
      background: rgba(239,68,68,0.06);
      border: 1px solid rgba(239,68,68,0.14);
      color: #b91c1c;
      font-size: 0.82rem;
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
    @media (max-width: 900px) { .form-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 560px)  { .form-grid { grid-template-columns: 1fr; } }
  `],
  template: `
    <div class="page">
      <div class="section-header">
        <span class="section-title">Fleet Management</span>
        <span class="count-badge">{{ cars.length }} cars</span>
      </div>

      <mat-card style="margin-bottom:1.5rem">
        <mat-card-content style="padding:1.5rem">
          <h3 style="font-family:var(--font-head);font-weight:700;margin:0 0 1.25rem">
            {{ editingCarId ? 'Edit Vehicle' : 'Add Vehicle' }}
          </h3>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="form-grid">
              <div class="field">
                <label>Plate Number</label>
                <input type="text" formControlName="plate_number" placeholder="123 TU 4567" [class.invalid]="isInvalid('plate_number')" />
                <span class="error-text" *ngIf="isInvalid('plate_number')">Use Tunisian format like 123 TU 4567.</span>
              </div>
              <div class="field">
                <label>Brand</label>
                <input type="text" formControlName="brand" placeholder="Toyota" [class.invalid]="isInvalid('brand')" />
                <span class="error-text" *ngIf="isInvalid('brand')">Brand is required.</span>
              </div>
              <div class="field">
                <label>Model</label>
                <input type="text" formControlName="model" placeholder="Corolla" [class.invalid]="isInvalid('model')" />
                <span class="error-text" *ngIf="isInvalid('model')">Model is required.</span>
              </div>
              <div class="field">
                <label>Year</label>
                <input type="number" formControlName="year" placeholder="2023" [class.invalid]="isInvalid('year')" />
                <span class="error-text" *ngIf="isInvalid('year')">Enter a valid year between 1900 and 2199.</span>
              </div>
              <div class="field">
                <label>Status</label>
                <select formControlName="status" [class.invalid]="isInvalid('status')">
                  <option value="available">available</option>
                  <option value="maintenance">maintenance</option>
                  <option value="unavailable">unavailable</option>
                </select>
              </div>
              <div class="field">
                <label>Category</label>
                <input type="text" formControlName="category" placeholder="economy, suv..." />
              </div>
              <div class="field">
                <label>Daily Price (DT)</label>
                <input type="number" step="0.01" formControlName="daily_price" placeholder="85" [class.invalid]="isInvalid('daily_price')" />
                <span class="error-text" *ngIf="isInvalid('daily_price')">Use a positive number with up to 2 decimals.</span>
              </div>
              <div class="field">
                <label>Gearbox</label>
                <select formControlName="gearbox" [class.invalid]="isInvalid('gearbox')">
                  <option value="manual">manual</option>
                  <option value="automatic">automatic</option>
                </select>
              </div>
              <div class="field">
                <label>Fuel</label>
                <select formControlName="fuel" [class.invalid]="isInvalid('fuel')">
                  <option value="petrol">petrol</option>
                  <option value="diesel">diesel</option>
                  <option value="hybrid">hybrid</option>
                  <option value="electric">electric</option>
                </select>
              </div>
              <div class="field">
                <label>Seats</label>
                <input type="number" formControlName="seats" placeholder="5" [class.invalid]="isInvalid('seats')" />
                <span class="error-text" *ngIf="isInvalid('seats')">Seats must be a positive integer.</span>
              </div>
              <div class="field">
                <label>Image URL</label>
                <input type="url" formControlName="image_url" placeholder="https://example.com/car.jpg" [class.invalid]="isInvalid('image_url')" />
                <span class="error-text" *ngIf="isInvalid('image_url')">Enter a valid URL (http:// or https://).</span>
              </div>
            </div>
            <div class="form-actions" style="margin-top:1rem">
              <button type="submit" class="btn-submit">{{ editingCarId ? 'Update Car' : 'Add Car' }}</button>
              <button type="button" class="btn-cancel" *ngIf="editingCarId" (click)="cancelEdit()">Cancel</button>
            </div>
            <div class="form-error" *ngIf="submitError">{{ submitError }}</div>
          </form>
        </mat-card-content>
      </mat-card>

      <div class="grid grid-2">
        <mat-card *ngFor="let car of cars" class="car-item">
          <div class="car-img-placeholder" *ngIf="!car.main_image">No Image</div>
          <img *ngIf="car.main_image" [src]="car.main_image" [alt]="car.brand + ' ' + car.model" class="car-img-placeholder" style="object-fit:cover;width:100%;display:block" />
          <mat-card-content style="padding:1.1rem 1.1rem 0.5rem">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px">
              <h3 style="font-family:var(--font-head);font-weight:700;margin:0;font-size:1rem">{{ car.brand }} {{ car.model }}</h3>
              <span class="status-chip" [class]="'status-' + car.status">{{ car.status }}</span>
            </div>
            <div class="price-display">
              <span class="price-amount">{{ car.daily_price }}</span>
              <span class="price-currency">DT</span>
              <span class="price-period">per day</span>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
              <span class="spec-tag">{{ car.gearbox }}</span>
              <span class="spec-tag">{{ car.fuel }}</span>
              <span class="spec-tag">{{ car.seats }} seats</span>
            </div>
          </mat-card-content>
          <mat-card-actions style="padding:0 1.1rem 1rem;display:flex;gap:8px">
            <button class="btn-edit" (click)="startEdit(car)">Edit</button>
            <button class="btn-delete" (click)="delete(car)">Delete</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `
})
export class AdminCarsComponent implements OnInit {
  cars: Car[] = [];
  editingCarId: number | null = null;
  submitError = '';
  private readonly fb = inject(FormBuilder);

  private readonly defaultFormValues = {
    plate_number: '', brand: '', model: '', year: '',
    status: 'available', category: '', daily_price: '',
    gearbox: 'manual', fuel: 'petrol', seats: 5, image_url: ''
  };

  readonly form = this.fb.group({
    plate_number: ['', [Validators.required, Validators.pattern(/^\d{1,3}\s?TU\s?\d{1,4}$/)]],
    brand: ['', [Validators.required, Validators.maxLength(100)]],
    model: ['', [Validators.required, Validators.maxLength(100)]],
    year: ['', [Validators.required, Validators.min(1900), Validators.max(2199), Validators.pattern(/^\d{4}$/)]],
    status: ['available', Validators.required],
    category: ['', Validators.maxLength(100)],
    daily_price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    gearbox: ['manual', Validators.required],
    fuel: ['petrol', Validators.required],
    seats: [5, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]],
    image_url: ['', Validators.pattern(/^https?:\/\/.+/i)]
  });

  constructor(private readonly carsService: CarsService) {}

  ngOnInit(): void { this.loadCars(); }

  submit(): void {
    this.submitError = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as Record<string, unknown>;
    if (this.editingCarId !== null) {
      this.carsService.update(this.editingCarId, payload).subscribe({
        next: () => { this.resetForm(); this.loadCars(); },
        error: err => this.submitError = err?.error?.error?.message ?? 'Failed to update car.'
      });
      return;
    }

    this.carsService.create(payload).subscribe({
      next: () => { this.resetForm(); this.loadCars(); },
      error: err => this.submitError = err?.error?.error?.message ?? 'Failed to add car.'
    });
  }

  startEdit(car: Car): void {
    this.submitError = '';
    this.editingCarId = car.id;
    this.form.patchValue({
      plate_number: car.plate_number,
      brand: car.brand,
      model: car.model,
      year: car.year as unknown as string,
      status: car.status,
      category: car.category ?? '',
      daily_price: car.daily_price as unknown as string,
      gearbox: car.gearbox,
      fuel: car.fuel,
      seats: car.seats,
      image_url: car.main_image ?? ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void { this.resetForm(); }

  delete(car: Car): void {
    const label = `${car.brand} ${car.model}`.trim();
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    if (!window.confirm(`Final confirmation: permanently delete ${label}?`)) return;
    this.carsService.delete(car.id).subscribe(() => {
      if (this.editingCarId === car.id) this.resetForm();
      this.loadCars();
    });
  }

  isInvalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  private loadCars(): void { this.carsService.list({}).subscribe(cars => this.cars = cars); }

  private resetForm(): void {
    this.editingCarId = null;
    this.submitError = '';
    this.form.reset(this.defaultFormValues);
  }
}
