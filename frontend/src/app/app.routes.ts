import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { CarsListComponent } from './pages/cars-list.component';
import { CarDetailsComponent } from './pages/car-details.component';
import { MyRentalsComponent } from './pages/my-rentals.component';
import { ReclamationsComponent } from './pages/reclamations.component';
import { ProfileComponent } from './pages/profile.component';
import { AdminDashboardComponent } from './pages/admin-dashboard.component';
import { AdminCarsComponent } from './pages/admin-cars.component';
import { AdminRentalsComponent } from './pages/admin-rentals.component';
import { AdminReclamationsComponent } from './pages/admin-reclamations.component';
import { AdminUsersComponent } from './pages/admin-users.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cars', component: CarsListComponent, canActivate: [authGuard] },
  { path: 'cars/:id', component: CarDetailsComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'my-rentals', component: MyRentalsComponent, canActivate: [authGuard] },
  { path: 'reclamations', component: ReclamationsComponent, canActivate: [authGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/cars', component: AdminCarsComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/rentals', component: AdminRentalsComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/reclamations', component: AdminReclamationsComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: 'login' }
];
