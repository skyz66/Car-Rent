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
        <span class="section-title">All Rentals</span>
        <span class="count-badge">{{ rentals.length }} total</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <mat-card *ngFor="let r of rentals">
          <mat-card-content style="padding:1.25rem">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
              <div>
                <div style="font-family:var(--font-head);font-weight:700;margin-bottom:4px">{{ r.brand }} {{ r.model }}</div>
                <div class="muted" style="font-size:0.82rem">{{ r.start_date | date:'mediumDate' }} to {{ r.end_date | date:'mediumDate' }}</div>
                <div class="price-display" style="margin-top:4px">
                  <span class="price-amount" style="font-size:1.1rem">{{ r.total_price }}</span>
                  <span class="price-currency">DT</span>
                </div>
              </div>
              <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
                <span class="status-chip" [class]="'status-' + r.status">{{ r.status }}</span>
                <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">
                  <button mat-stroked-button class="!rounded-lg !text-sm" (click)="setStatus(r.id, 'confirmed')" *ngIf="r.status === 'pending'">
                    Confirm
                  </button>
                  <button mat-stroked-button class="!rounded-lg !text-sm" (click)="setStatus(r.id, 'ongoing')" *ngIf="r.status === 'confirmed'">
                    Start
                  </button>
                  <button mat-stroked-button class="!rounded-lg !text-sm" (click)="setStatus(r.id, 'completed')" *ngIf="r.status === 'ongoing'">
                    Complete
                  </button>
                  <button
                    mat-stroked-button
                    color="warn"
                    class="!rounded-lg !text-sm"
                    (click)="setStatus(r.id, 'cancelled')"
                    *ngIf="r.status === 'pending' || r.status === 'confirmed' || r.status === 'ongoing'"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class AdminRentalsComponent implements OnInit {
  rentals: any[] = [];
  constructor(private readonly rentalsService: RentalsService) {}
  ngOnInit(): void { this.rentalsService.all().subscribe(r => this.rentals = r); }
  setStatus(id: number, status: 'confirmed' | 'ongoing' | 'completed' | 'cancelled'): void {
    if (status === 'cancelled' && !window.confirm('Cancel this rental?')) {
      return;
    }
    this.rentalsService.updateStatus(id, status).subscribe(() => this.ngOnInit());
  }
}

