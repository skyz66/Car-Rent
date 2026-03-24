import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CarsService } from '../services/cars.service';
import { Car } from '../models/types';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule, MatButtonModule],
  styles: [`
    .filter-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: flex-end;
    }
    .filter-field {
      display: flex;
      flex-direction: column;
      gap: 5px;
      flex: 1;
      min-width: 130px;
    }
    .filter-field label {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--ink-3);
    }
    .filter-field input {
      height: 42px;
      border-radius: 10px;
      border: 1.5px solid rgba(10,14,26,0.12);
      padding: 0 14px;
      font-family: var(--font-body);
      font-size: 0.875rem;
      color: var(--ink);
      background: var(--paper);
      outline: none;
      transition: border-color 0.18s, background 0.18s;
      width: 100%;
    }
    .filter-field input:focus {
      border-color: var(--blue);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(23,87,240,0.08);
    }
    .filter-field.narrow { max-width: 120px; }
    .filter-actions {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      padding-bottom: 1px;
    }
    .btn-apply {
      height: 42px;
      padding: 0 20px;
      border-radius: 10px;
      border: none;
      background: var(--blue);
      color: #fff;
      font-family: var(--font-body);
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 12px var(--blue-glow);
      transition: all 0.18s;
      white-space: nowrap;
    }
    .btn-apply:hover { background: var(--blue-dark); transform: translateY(-1px); }
    .btn-reset {
      height: 42px;
      padding: 0 16px;
      border-radius: 10px;
      border: 1.5px solid rgba(10,14,26,0.12);
      background: transparent;
      color: var(--ink-2);
      font-family: var(--font-body);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.18s;
      white-space: nowrap;
    }
    .btn-reset:hover { background: rgba(10,14,26,0.05); color: var(--ink); }
    .car-photo { object-fit: cover; width: 100%; display: block; }
  `],
  template: `
    <div class="hero">
      <div class="hero-bg"></div>
      <div class="hero-grid"></div>
      <div class="hero-content">
        <div class="hero-eyebrow">{{ t('hero.eyebrow') }}</div>
        <h1>{{ t('hero.h1a') }}<br/><span>{{ t('hero.h1b') }}</span></h1>
        <p>{{ t('hero.subtitle') }}</p>
      </div>
    </div>

    <div class="page">
      <mat-card class="filters-card" style="margin-bottom:1.5rem;padding:1.5rem">
        <div class="filters-label">{{ t('filters.title') }}</div>
        <form [formGroup]="filters" (ngSubmit)="load()">
          <div class="filter-row">
            <div class="filter-field">
              <label>{{ t('filters.keyword') }}</label>
              <input type="text" formControlName="search" [placeholder]="t('filters.keywordPh')" />
            </div>

            <div class="filter-field">
              <label>{{ t('filters.brand') }}</label>
              <input type="text" formControlName="brand" placeholder="Toyota, BMW..." />
            </div>

            <div class="filter-field">
              <label>{{ t('filters.model') }}</label>
              <input type="text" formControlName="model" placeholder="Corolla, X5..." />
            </div>

            <div class="filter-field narrow">
              <label>{{ t('filters.minPrice') }}</label>
              <input type="number" formControlName="minPrice" placeholder="0" />
            </div>

            <div class="filter-field narrow">
              <label>{{ t('filters.maxPrice') }}</label>
              <input type="number" formControlName="maxPrice" placeholder="999" />
            </div>

            <div class="filter-actions">
              <button type="submit" class="btn-apply">{{ t('filters.apply') }}</button>
              <button type="button" class="btn-reset" (click)="filters.reset(); load()">{{ t('filters.reset') }}</button>
            </div>
          </div>
        </form>
      </mat-card>

      <div class="section-header">
        <span class="section-title">{{ t('cars.sectionTitle') }}</span>
        <span class="count-badge">{{ cars.length }} {{ t('cars.countLabel') }}</span>
      </div>

      <div class="grid grid-2">
        <mat-card *ngFor="let car of cars" class="car-item" [routerLink]="['/cars', car.id]">
          <div class="car-img-placeholder" *ngIf="!car.main_image">No Image</div>
          <img *ngIf="car.main_image" [src]="car.main_image" [alt]="car.brand + ' ' + car.model" class="car-img-placeholder car-photo" />
          <mat-card-content style="padding: 1.1rem 1.1rem 0.5rem">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px">
              <h3 class="card-head" style="margin:0;font-size:1rem">{{ car.brand }} {{ car.model }}</h3>
              <span class="status-chip" [class]="'status-' + car.status">{{ car.status }}</span>
            </div>
            <div class="price-display">
              <span class="price-amount">{{ car.daily_price }}</span>
              <span class="price-currency">DT</span>
              <span class="price-period">{{ t('cars.perDay') }}</span>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">
              <span class="spec-tag">{{ car.gearbox }}</span>
              <span class="spec-tag">{{ car.fuel }}</span>
              <span class="spec-tag">{{ car.seats }} {{ t('specs.seats') }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class CarsListComponent implements OnInit {
  cars: Car[] = [];
  lang: 'en' | 'fr' = 'en';
  private readonly fb = inject(FormBuilder);

  readonly filters = this.fb.group({
    search: [''], brand: [''], model: [''], minPrice: [''], maxPrice: ['']
  });

  private tr: Record<string, Record<string, string>> = {
    en: {
      'hero.eyebrow': 'Fleet available now',
      'hero.h1a': 'Find Your', 'hero.h1b': 'Perfect Ride',
      'hero.subtitle': 'Browse premium vehicles and reserve in a few clicks. Transparent pricing, zero hidden fees.',
      'filters.title': 'Filter Vehicles',
      'filters.keyword': 'Keyword', 'filters.keywordPh': 'Search...',
      'filters.brand': 'Brand', 'filters.model': 'Model',
      'filters.minPrice': 'Min. price', 'filters.maxPrice': 'Max. price',
      'filters.apply': 'Apply Filters', 'filters.reset': 'Reset',
      'cars.sectionTitle': 'Available vehicles', 'cars.countLabel': 'cars',
      'cars.perDay': 'per day', 'cars.viewDetails': 'View Details ->',
      'specs.seats': 'seats',
    },
    fr: {
      'hero.eyebrow': 'Flotte disponible maintenant',
      'hero.h1a': 'Trouvez Votre', 'hero.h1b': 'Vehicule Ideal',
      'hero.subtitle': 'Parcourez nos vehicules premium et reservez en quelques clics. Prix transparents, zero frais caches.',
      'filters.title': 'Filtrer les vehicules',
      'filters.keyword': 'Mot-cle', 'filters.keywordPh': 'Rechercher...',
      'filters.brand': 'Marque', 'filters.model': 'Modele',
      'filters.minPrice': 'Prix min.', 'filters.maxPrice': 'Prix max.',
      'filters.apply': 'Appliquer', 'filters.reset': 'Reinitialiser',
      'cars.sectionTitle': 'Vehicules disponibles', 'cars.countLabel': 'voitures',
      'cars.perDay': 'par jour', 'cars.viewDetails': 'Voir les details ->',
      'specs.seats': 'places',
    }
  };

  t(key: string): string { return this.tr[this.lang]?.[key] ?? this.tr['en'][key] ?? key; }

  constructor(private readonly carsService: CarsService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.carsService.list(this.filters.getRawValue() as Record<string, string>).subscribe(cars => this.cars = cars);
  }
}
