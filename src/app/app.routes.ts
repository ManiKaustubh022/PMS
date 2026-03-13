import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'slots',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/parking-slots/parking-slots.component').then(m => m.ParkingSlotsComponent),
  },
  {
    path: 'vehicle',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/vehicle-entry-exit/vehicle-entry-exit.component').then(m => m.VehicleEntryExitComponent),
  },
  {
    path: 'records',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/parking-records/parking-records.component').then(m => m.ParkingRecordsComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
