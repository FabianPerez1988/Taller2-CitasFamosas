import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'gestion-citas',
    loadComponent: () => import('./pages/gestion-citas/gestion-citas.page').then((m) => m.GestionCitasPage),
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./pages/configuracion/configuracion.page').then((m) => m.ConfiguracionPage),
  },
];
