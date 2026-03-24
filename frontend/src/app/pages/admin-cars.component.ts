import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '../services/admin.service';
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
    .span-full { grid-column: 1 / -1; }
    .field { display: flex; flex-direction: column; gap: 5px; }
    .field label {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--ink-3);
    }
    .field input {
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
    .field input:focus {
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
    @media (max-width: 900px) { .form-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 560px)  { .form-grid { grid-template-columns: 1fr; } }
  `],
  template: `
    <div class="page">
      <div class="section-header">
        <span class="section-title">Fleet Management</span>
        <span class="count-badge">{{ cars.length }} cars</span>
      </div>

      <!-- Add / Edit form -->
      <mat-card style="margin-bottom:1.5rem">
        <mat-card-content style="padding:1.5rem">
          <h3 style="font-family:var(--font-head);font-weight:700;margin:0 0 1.25rem">
            {{ editingCarId ? 'Edit Vehicle' : 'Add Vehicle' }}
          </h3>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="form-grid">
              <div class="field"><label>Plate Number</label><input type="text" formControlName="plate_number" placeholder="123 TU 4567" /></div>
              <div class="field"><label>Brand</label><input type="text" formControlName="brand" placeholder="Toyota" /></div>
              <div class="field"><label>Model</label><input type="text" formControlName="model" placeholder="Corolla" /></div>
              <div class="field"><label>Year</label><input type="number" formControlName="year" placeholder="2023" /></div>
              <div class="field"><label>Status</label><input type="text" formControlName="status" placeholder="available" /></div>
              <div class="field"><label>Category</label><input type="text" formControlName="category" placeholder="economy, suv…" /></div>
              <div class="field"><label>Daily Price (DT)</label><input type="number" formControlName="daily_price" placeholder="85" /></div>
              <div class="field"><label>Gearbox</label><input type="text" formControlName="gearbox" placeholder="manual / automatic" /></div>
              <div class="field"><label>Fuel</label><input type="text" formControlName="fuel" placeholder="petrol, diesel, hybrid…" /></div>
              <div class="field"><label>Seats</label><input type="number" formControlName="seats" placeholder="5" /></div>
            </div>
            <div class="form-actions" style="margin-top:1rem">
              <button type="submit" class="btn-submit">{{ editingCarId ? 'Update Car' : 'Add Car' }}</button>
              <button type="button" class="btn-cancel" *ngIf="editingCarId" (click)="cancelEdit()">Cancel</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Cars grid -->
      <div class="grid grid-2">
        <mat-card *ngFor="let car of cars" class="car-item">
          <div class="car-img-placeholder">🚗</div>
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
  private readonly fb = inject(FormBuilder);

  private readonly defaultFormValues = {
    plate_number: '', brand: '', model: '', year: '',
    status: 'available', category: '', daily_price: '',
    gearbox: 'manual', fuel: 'petrol', seats: 5
  };

  readonly form = this.fb.group({
    plate_number: ['', Validators.required],
    brand: ['', Validators.required], model: ['', Validators.required],
    year: ['', Validators.required], status: ['available', Validators.required],
    category: [''], daily_price: ['', Validators.required],
    gearbox: ['manual', Validators.required], fuel: ['petrol', Validators.required],
    seats: [5, Validators.required]
  });

  constructor(
    private readonly adminService: AdminService,
    private readonly carsService: CarsService
  ) {}

  ngOnInit(): void { this.loadCars(); }

  submit(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue() as Record<string, unknown>;
    if (this.editingCarId !== null) {
      this.adminService.updateCar(this.editingCarId, payload).subscribe(() => { this.resetForm(); this.loadCars(); });
      return;
    }
    this.adminService.createCar(payload).subscribe(() => { this.resetForm(); this.loadCars(); });
  }

  startEdit(car: Car): void {
    this.editingCarId = car.id;
    this.form.patchValue({
      plate_number: car.plate_number, brand: car.brand, model: car.model,
      year: car.year as unknown as string, status: car.status,
      category: car.category ?? '', daily_price: car.daily_price as unknown as string,
      gearbox: car.gearbox, fuel: car.fuel, seats: car.seats
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void { this.resetForm(); }

  delete(car: Car): void {
    const label = `${car.brand} ${car.model}`.trim();
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    if (!window.confirm(`Final confirmation: permanently delete ${label}?`)) return;
    this.adminService.deleteCar(car.id).subscribe(() => {
      if (this.editingCarId === car.id) this.resetForm();
      this.loadCars();
    });
  }

  private loadCars(): void { this.carsService.list({}).subscribe(cars => this.cars = cars); }
  private resetForm(): void { this.editingCarId = null; this.form.reset(this.defaultFormValues); }
}
