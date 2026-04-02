import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', loadComponent: () => import('./pages/login.component').then((m) => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register.component').then((m) => m.RegisterComponent) },
  {
    path: 'cars',
    loadComponent: () => import('./pages/cars-list.component').then((m) => m.CarsListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cars/:id',
    loadComponent: () => import('./pages/car-details.component').then((m) => m.CarDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-rentals',
    loadComponent: () => import('./pages/my-rentals.component').then((m) => m.MyRentalsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reclamations',
    loadComponent: () => import('./pages/reclamations.component').then((m) => m.ReclamationsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/cars',
    loadComponent: () => import('./pages/admin-cars.component').then((m) => m.AdminCarsComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/rentals',
    loadComponent: () => import('./pages/admin-rentals.component').then((m) => m.AdminRentalsComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/reclamations',
    loadComponent: () => import('./pages/admin-reclamations.component').then((m) => m.AdminReclamationsComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./pages/admin-users.component').then((m) => m.AdminUsersComponent),
    canActivate: [authGuard, adminGuard]
  },
  { path: '**', redirectTo: 'login' }
];
