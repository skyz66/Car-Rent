import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../services/admin.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <div class="page">
      <div class="dash-header">
        <div class="dash-header-content">
          <h2>{{ t('title') }}</h2>
          <p>{{ t('subtitle') }}</p>
        </div>
        <div class="dash-actions">
          <button class="ql-btn" routerLink="/admin/cars">{{ t('cars') }}</button>
          <button class="ql-btn" routerLink="/admin/rentals">{{ t('rentals') }}</button>
          <button class="ql-btn" routerLink="/admin/reclamations">{{ t('reclamations') }}</button>
          <button class="ql-btn" routerLink="/admin/users">{{ t('users') }}</button>
        </div>
      </div>

      <div class="grid grid-3 section">
        <mat-card class="stat-card">
          <mat-card-content style="padding:1.5rem">
            <div class="stat-circle stat-circle-total" [style.--p]="totalRentalsPct()">
              <div class="circle-inner">{{ summary?.total_rentals ?? 0 }}</div>
            </div>
            <div class="stat-label">{{ t('totalRentals') }}</div>
            <div class="stat-sub">{{ t('thisMonth') }}</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content style="padding:1.5rem">
            <div class="stat-circle stat-circle-ongoing" [style.--p]="ongoingRentalsPct()">
              <div class="circle-inner">{{ summary?.ongoing_rentals ?? 0 }}</div>
            </div>
            <div class="stat-label">{{ t('ongoingRentals') }}</div>
            <div class="stat-sub">{{ t('activeNow') }}</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content style="padding:1.5rem">
            <div class="stat-circle stat-circle-revenue" [style.--p]="revenuePct()">
              <div class="circle-inner">
                <span class="stat-amount">{{ summary?.revenue ?? 0 }}</span>
                <span class="stat-currency">DT</span>
              </div>
            </div>
            <div class="stat-label">{{ t('revenue') }}</div>
            <div class="stat-sub">{{ t('vsLastMonth') }}</div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="line-card">
        <div class="line-card-head">
          <h3>{{ t('rentalsByDay') }}</h3>
          <p>{{ t('rentalsByDaySubtitle') }}</p>
        </div>
        <div class="line-chart-wrap">
          <svg class="line-chart" viewBox="0 0 640 260" preserveAspectRatio="none">
            <g class="line-y">
              <line *ngFor="let t of lineTicks" [attr.x1]="30" [attr.x2]="610" [attr.y1]="t.y" [attr.y2]="t.y"></line>
              <text *ngFor="let t of lineTicks" [attr.x]="18" [attr.y]="t.y" text-anchor="end">{{ t.label }}</text>
            </g>
            <polygon class="line-area" [attr.points]="lineAreaPoints"></polygon>
            <polyline class="line-path" [attr.points]="linePoints"></polyline>
            <g class="line-dots">
              <circle *ngFor="let p of linePointCoords" [attr.cx]="p.x" [attr.cy]="p.y" r="5"></circle>
            </g>
            <g class="line-labels">
              <text *ngFor="let p of linePointCoords; let i = index" [attr.x]="p.x" [attr.y]="252" text-anchor="middle">
                {{ lineLabels[i] }}
              </text>
            </g>
          </svg>
        </div>
      </mat-card>

      <mat-card class="top-cars-card">
        <div class="top-cars-head">
          <h3>{{ t('topCars') }}</h3>
          <p>{{ t('topCarsSubtitle') }}</p>
        </div>
        <div *ngFor="let car of topRented; let i = index" class="list-item">
          <div style="display:flex;align-items:center">
            <span class="car-rank">#{{ i + 1 }}</span>
            <span style="font-weight:500;font-size:0.9rem">{{ car.brand }} {{ car.model }}</span>
          </div>
          <div class="bar-wrap">
            <div class="car-bar">
              <div class="fill" [style.width.%]="barWidth(car.rentals_count)"></div>
            </div>
            <span class="rental-count">{{ car.rentals_count }}</span>
          </div>
        </div>
      </mat-card>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  summary?: { total_rentals: number; ongoing_rentals: number; revenue: number };
  topRented: any[] = [];
  rentalsByDay: Array<{ day: string; count: number }> = [];
  linePoints = '';
  lineAreaPoints = '';
  linePointCoords: Array<{ x: number; y: number }> = [];
  lineLabels: string[] = [];
  lineTicks: Array<{ label: number; y: number }> = [];
  lang: 'en' | 'fr' = 'en';

  private tr: Record<string, Record<string, string>> = {
    en: {
      title: 'Admin Dashboard', subtitle: 'Overview of your fleet and operations',
      cars: 'Cars', rentals: 'Rentals', reclamations: 'Reclamations', users: 'Users',
      totalRentals: 'Total Rentals', ongoingRentals: 'Ongoing Rentals', revenue: 'Revenue',
      thisMonth: '+12 this month', activeNow: 'Active now', vsLastMonth: 'up 8.4% vs last month',
      topCars: 'Top 10 Most Rented Cars', topCarsSubtitle: 'Ranked by number of rentals',
      rentalsByDay: 'Rentals by Day', rentalsByDaySubtitle: 'Last 7 days activity',
    },
    fr: {
      title: 'Tableau de bord Admin', subtitle: "Vue d'ensemble de votre flotte et opérations",
      cars: 'Véhicules', rentals: 'Locations', reclamations: 'Réclamations', users: 'Utilisateurs',
      totalRentals: 'Total Locations', ongoingRentals: 'Locations en cours', revenue: "Chiffre d'affaires",
      thisMonth: '+12 ce mois-ci', activeNow: 'Actif maintenant', vsLastMonth: 'en hausse de 8,4% vs mois dernier',
      topCars: 'Top 10 des véhicules les plus loués', topCarsSubtitle: 'Classés par nombre de locations',
      rentalsByDay: 'Locations par jour', rentalsByDaySubtitle: 'Activité sur 7 jours',
    }
  };
  t(key: string): string { return this.tr[this.lang]?.[key] ?? this.tr['en'][key] ?? key; }

  barWidth(count: number): number {
    const max = this.topRented[0]?.rentals_count || 1;
    return Math.round((count / max) * 100);
  }

  totalRentalsPct(): number {
    const total = this.summary?.total_rentals ?? 0;
    return this.clampPct((total / 100) * 100);
  }

  ongoingRentalsPct(): number {
    const total = this.summary?.total_rentals ?? 0;
    const ongoing = this.summary?.ongoing_rentals ?? 0;
    if (total <= 0) return 0;
    return this.clampPct((ongoing / total) * 100);
  }

  revenuePct(): number {
    const revenue = this.summary?.revenue ?? 0;
    return this.clampPct((revenue / 50000) * 100);
  }

  private clampPct(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  constructor(private readonly adminService: AdminService) {}
  ngOnInit(): void {
    this.adminService.summary().subscribe(data => this.summary = data);
    this.adminService.topRented().subscribe(data => this.topRented = data);
    this.adminService.rentalsByDay().subscribe(data => {
      this.rentalsByDay = data;
      this.buildLineChart();
    });
  }

  private buildLineChart(): void {
    const width = 640;
    const height = 260;
    const padX = 30;
    const padY = 24;
    const baseY = height - padY - 14;
    const series = this.rentalsByDay.length ? this.rentalsByDay : [];
    const values = series.map(d => d.count);
    const max = Math.max(1, ...values);
    const step = series.length > 1 ? (width - padX * 2) / (series.length - 1) : 0;

    this.linePointCoords = series.map((d, i) => {
      const x = padX + i * step;
      const y = padY + (1 - d.count / max) * (height - padY * 2);
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    });
    this.linePoints = this.linePointCoords.map(p => `${p.x},${p.y}`).join(' ');
    if (this.linePointCoords.length) {
      const first = this.linePointCoords[0];
      const last = this.linePointCoords[this.linePointCoords.length - 1];
      this.lineAreaPoints = `${first.x},${baseY} ${this.linePoints} ${last.x},${baseY}`;
    } else {
      this.lineAreaPoints = '';
    }
    this.lineLabels = series.map(d => {
      const dt = new Date(d.day + 'T00:00:00');
      return dt.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    });

    const maxTick = Math.max(6, Math.ceil(max));
    const ticks = Array.from({ length: 6 }, (_, i) => maxTick - i);
    this.lineTicks = ticks.map((label) => {
      const y = padY + (1 - label / maxTick) * (height - padY * 2);
      return { label, y: Math.round(y * 10) / 10 };
    });
  }
}
