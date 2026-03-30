import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CarsService } from '../services/cars.service';
import { RentalsService } from '../services/rentals.service';
import { Car } from '../models/types';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule],
  styles: [`
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .field label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-2); }
    .field input {
      height: 46px; border-radius: 12px; border: 1.5px solid rgba(10,14,26,0.12);
      padding: 0 14px; font-family: var(--font-body); font-size: 0.9rem;
      color: var(--ink); background: var(--paper); outline: none;
      width: 100%; box-sizing: border-box; transition: border-color 0.18s, box-shadow 0.18s;
    }
    .field input:focus { border-color: var(--blue); background: #fff; box-shadow: 0 0 0 3px rgba(23,87,240,0.1); }
    .btn-row { display: flex; gap: 8px; margin-top: 4px; }
    .btn-check {
      flex: 1; height: 44px; border-radius: 10px;
      border: 1.5px solid rgba(23,87,240,0.3); background: transparent; color: var(--blue);
      font-family: var(--font-body); font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.18s;
    }
    .btn-check:hover { background: rgba(23,87,240,0.05); }
    .btn-book {
      flex: 1; height: 44px; border-radius: 10px; border: none;
      background: var(--blue); color: #fff; font-family: var(--font-body);
      font-size: 0.875rem; font-weight: 600; cursor: pointer;
      box-shadow: 0 2px 14px var(--blue-glow); transition: all 0.18s;
    }
    .btn-book:hover { background: var(--blue-dark); transform: translateY(-1px); }
    .detail-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      position: relative;
      z-index: 1;
    }
    .detail-fallback {
      position: relative;
      z-index: 1;
      font-size: 4rem;
      color: #fff;
      font-weight: 700;
    }
  `],
  template: `
    <div class="page" *ngIf="car">
      <div class="detail-hero">
        <img *ngIf="car.main_image" [src]="car.main_image" [alt]="car.brand + ' ' + car.model" class="detail-image" />
        <span *ngIf="!car.main_image" class="detail-fallback">No Image</span>
      </div>
      <div class="grid grid-2" style="align-items:start;gap:1.25rem">
        <mat-card>
          <mat-card-content style="padding:1.75rem">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:4px">
              <h2 style="font-family:var(--font-head);font-size:1.7rem;font-weight:800;margin:0">{{ car.brand }} {{ car.model }}</h2>
              <span class="status-chip" [class]="'status-' + car.status" style="margin-top:6px">{{ car.status }}</span>
            </div>
            <div class="price-display" style="margin:0.75rem 0">
              <span class="price-amount-lg">{{ car.daily_price }}</span>
              <span class="price-currency-lg">DT</span>
              <span class="price-period-lg">{{ t('perDay') }}</span>
            </div>
            <div class="spec-grid">
              <div class="spec-box"><div class="spec-box-label">{{ t('gearbox') }}</div><div class="spec-box-val">{{ car.gearbox }}</div></div>
              <div class="spec-box"><div class="spec-box-label">{{ t('fuel') }}</div><div class="spec-box-val">{{ car.fuel }}</div></div>
              <div class="spec-box"><div class="spec-box-label">{{ t('seats') }}</div><div class="spec-box-val">{{ car.seats }}</div></div>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-content style="padding:1.75rem">
            <h3 style="font-family:var(--font-head);font-size:1.1rem;font-weight:700;margin:0 0 4px">{{ t('bookTitle') }}</h3>
            <p class="muted" style="font-size:0.85rem;margin:0 0 1.2rem">{{ t('bookSubtitle') }}</p>
            <form [formGroup]="form" (ngSubmit)="book()">
              <div class="field"><label>{{ t('startDate') }}</label><input type="datetime-local" formControlName="start_date" /></div>
              <div class="field"><label>{{ t('endDate') }}</label><input type="datetime-local" formControlName="end_date" /></div>
              <div class="btn-row">
                <button type="button" class="btn-check" (click)="check()">{{ t('checkAvail') }}</button>
                <button type="submit" class="btn-book">{{ t('bookNow') }}</button>
              </div>
            </form>
            <div class="note" *ngIf="availabilityMessage" style="margin-top:12px">{{ availabilityMessage }}</div>
            <div class="note" *ngIf="bookingMessage" style="margin-top:12px">{{ bookingMessage }}</div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class CarDetailsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  car?: Car;
  availabilityMessage = '';
  bookingMessage = '';
  lang: 'en' | 'fr' = 'en';
  readonly form = this.fb.group({ start_date: ['', Validators.required], end_date: ['', Validators.required] });

  private tr: Record<string, Record<string, string>> = {
    en: {
      perDay: 'per day', gearbox: 'Gearbox', fuel: 'Fuel', seats: 'Seats',
      bookTitle: 'Book This Car', bookSubtitle: 'Select your rental period and confirm instantly.',
      startDate: 'Start date & time', endDate: 'End date & time',
      checkAvail: 'Check Availability', bookNow: 'Book Now',
    },
    fr: {
      perDay: 'par jour', gearbox: 'Boite de vitesse', fuel: 'Carburant', seats: 'Places',
      bookTitle: 'Reserver ce vehicule', bookSubtitle: 'Selectionnez votre periode de location et confirmez instantanement.',
      startDate: 'Date & heure de debut', endDate: 'Date & heure de fin',
      checkAvail: 'Verifier la disponibilite', bookNow: 'Reserver maintenant',
    }
  };

  t(key: string): string { return this.tr[this.lang]?.[key] ?? this.tr['en'][key] ?? key; }

  constructor(private readonly route: ActivatedRoute, private readonly carsService: CarsService, private readonly rentalsService: RentalsService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carsService.detail(id).subscribe(car => this.car = car);
  }

  check(): void {
    if (!this.car || this.form.invalid) return;
    const { start_date, end_date } = this.form.getRawValue();
    if (!this.validateDateRange(start_date, end_date)) {
      return;
    }
    this.carsService.checkAvailability(this.car.id, start_date!, end_date!).subscribe({
      next: res => this.availabilityMessage = res.available ? 'Car is available for selected dates.' : 'Car is not available for selected dates.',
      error: err => this.availabilityMessage = err?.error?.error?.message ?? 'Failed'
    });
  }

  book(): void {
    if (!this.car || this.form.invalid) return;
    const { start_date, end_date } = this.form.getRawValue();
    if (!this.validateDateRange(start_date, end_date)) {
      return;
    }
    this.rentalsService.create({ car_id: this.car.id, start_date: start_date!, end_date: end_date! }).subscribe({
      next: () => this.bookingMessage = 'Booking created with pending status.',
      error: err => this.bookingMessage = err?.error?.error?.message ?? 'Booking failed'
    });
  }

  private validateDateRange(startDate: string | null, endDate: string | null): boolean {
    this.availabilityMessage = '';
    this.bookingMessage = '';

    if (!startDate || !endDate) {
      this.availabilityMessage = 'Start and end date are required.';
      this.bookingMessage = 'Start and end date are required.';
      return false;
    }

    const startTs = Date.parse(startDate);
    const endTs = Date.parse(endDate);
    if (Number.isNaN(startTs) || Number.isNaN(endTs)) {
      this.availabilityMessage = 'Invalid date format.';
      this.bookingMessage = 'Invalid date format.';
      return false;
    }

    if (endTs <= startTs) {
      this.availabilityMessage = 'End date must be after start date.';
      this.bookingMessage = 'End date must be after start date.';
      return false;
    }

    return true;
  }
}
