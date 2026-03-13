import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'slots',
    loadComponent: () =>
      import('./features/parking-slots/parking-slots.component').then(m => m.ParkingSlotsComponent),
  },
  {
    path: 'vehicle',
    loadComponent: () =>
      import('./features/vehicle-entry-exit/vehicle-entry-exit.component').then(m => m.VehicleEntryExitComponent),
  },
  {
    path: 'records',
    loadComponent: () =>
      import('./features/parking-records/parking-records.component').then(m => m.ParkingRecordsComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
