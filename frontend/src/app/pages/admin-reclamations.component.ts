import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReclamationsService } from '../services/reclamations.service';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="page">
      <div class="section-header">
        <span class="section-title">Reclamations</span>
        <span class="count-badge">{{ reclamations.length }} total</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <mat-card *ngFor="let r of reclamations">
          <mat-card-content style="padding:1.25rem">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
              <div>
                <h4 style="font-family:var(--font-head);font-weight:700;margin:0 0 4px">{{ r.subject }}</h4>
                <p class="muted" style="font-size:0.85rem;margin:0 0 8px">{{ r.description }}</p>
                <span class="muted" style="font-size:0.75rem">By: {{ r.first_name }} {{ r.last_name }}</span>
              </div>
              <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
                <span class="status-chip" [class]="'status-' + r.status">{{ r.status }}</span>
                <button mat-stroked-button class="!rounded-lg !text-sm" (click)="resolve(r.id)" *ngIf="r.status !== 'resolved'">Resolve</button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class AdminReclamationsComponent implements OnInit {
  reclamations: any[] = [];
  constructor(private readonly reclamationsService: ReclamationsService) {}
  ngOnInit(): void { this.reclamationsService.all().subscribe(r => this.reclamations = r); }
  resolve(id: number): void { this.reclamationsService.updateStatus(id, 'resolved').subscribe(() => this.ngOnInit()); }
}

