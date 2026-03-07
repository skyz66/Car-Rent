import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RentalsService } from '../services/rentals.service';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="page">
      <div class="section-header">
        <span class="section-title">{{ t('title') }}</span>
        <span class="count-badge">{{ rentals.length }} {{ t('total') }}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div *ngFor="let r of rentals" class="rental-row" [class.ongoing]="r.status === 'ongoing'">
          <div>
            <div style="font-family:var(--font-head);font-weight:700;margin-bottom:4px">
              {{ r.car?.brand }} {{ r.car?.model }}
            </div>
            <div class="muted" style="font-size:0.82rem">
              {{ r.start_date | date:'mediumDate' }} to {{ r.end_date | date:'mediumDate' }}
            </div>
            <div class="price-display" style="margin-top:4px">
              <span class="price-amount" style="font-size:1.1rem">{{ r.total_price }}</span>
              <span class="price-currency">DT</span>
            </div>
          </div>
          <span class="status-chip" [class]="'status-' + r.status">{{ r.status }}</span>
        </div>
        <div *ngIf="rentals.length === 0" class="note">{{ t('noRentals') }}</div>
      </div>
    </div>
  `
})
export class MyRentalsComponent implements OnInit {
  rentals: any[] = [];
  lang: 'en' | 'fr' = 'en';

  private tr: Record<string, Record<string, string>> = {
    en: { title: 'My Rentals', total: 'total', noRentals: 'No rentals found.' },
    fr: { title: 'Mes Locations', total: 'au total', noRentals: 'Aucune location trouvée.' }
  };
  t(key: string): string { return this.tr[this.lang]?.[key] ?? this.tr['en'][key] ?? key; }

  constructor(private readonly rentalsService: RentalsService) {}
  ngOnInit(): void { this.rentalsService.list().subscribe(r => this.rentals = r); }
}
