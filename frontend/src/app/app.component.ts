import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule],
  template: `
    <div class="app-shell">
      <nav class="app-toolbar">
        <a class="brand" routerLink="/cars">DriveNow</a>
        <span class="toolbar-spacer"></span>
        <div class="menu-links">
          <a mat-button class="nav-link-btn" routerLink="/cars" routerLinkActive="menu-active" *ngIf="auth.isAuthenticated()">{{ t('nav.cars') }}</a>
          <a mat-button class="nav-link-btn" routerLink="/my-rentals" routerLinkActive="menu-active" *ngIf="auth.isAuthenticated()">{{ t('nav.myRentals') }}</a>
          <a mat-button class="nav-link-btn" routerLink="/reclamations" routerLinkActive="menu-active" *ngIf="auth.isAuthenticated()">{{ t('nav.reclamations') }}</a>
          <a mat-button class="nav-link-btn" routerLink="/profile" routerLinkActive="menu-active" *ngIf="auth.isAuthenticated()">{{ t('nav.profile') }}</a>
          <a mat-button class="nav-link-btn" routerLink="/admin/dashboard" routerLinkActive="menu-active" *ngIf="auth.isAdmin()">{{ t('nav.admin') }}</a>

          <div class="lang-toggle">
            <button class="lang-btn" [class.active]="lang === 'en'" (click)="setLang('en')">EN</button>
            <button class="lang-btn" [class.active]="lang === 'fr'" (click)="setLang('fr')">FR</button>
          </div>

          <a mat-button class="nav-link-btn login-btn" routerLink="/login" routerLinkActive="menu-active" *ngIf="!auth.isAuthenticated()">{{ t('nav.login') }}</a>
          <a mat-button class="nav-link-btn" routerLink="/register" routerLinkActive="menu-active" *ngIf="!auth.isAuthenticated()">{{ t('nav.register') }}</a>
          <button mat-stroked-button class="logout-btn" *ngIf="auth.isAuthenticated()" (click)="logout()">{{ t('nav.logout') }}</button>
        </div>
      </nav>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  lang: 'en' | 'fr' = 'en';

  private translations: Record<string, Record<string, string>> = {
    en: {
      'nav.cars': 'Cars', 'nav.myRentals': 'My Rentals', 'nav.reclamations': 'Reclamations',
      'nav.profile': 'Profile', 'nav.admin': 'Admin', 'nav.login': 'Login', 'nav.register': 'Register', 'nav.logout': 'Logout',
    },
    fr: {
      'nav.cars': 'Véhicules', 'nav.myRentals': 'Mes Locations', 'nav.reclamations': 'Réclamations',
      'nav.profile': 'Profil', 'nav.admin': 'Admin', 'nav.login': 'Connexion', 'nav.register': 'Inscription', 'nav.logout': 'Déconnexion',
    }
  };

  t(key: string): string {
    return this.translations[this.lang]?.[key] ?? this.translations['en'][key] ?? key;
  }

  setLang(l: 'en' | 'fr'): void { this.lang = l; }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}

