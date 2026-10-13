import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProximamenteComponent } from './shared/components/proximamente/proximamente.component';

// Resumen, Movimientos y Categorías son feature modules con carga diferida (lazy loading).
// Las secciones sin diseño muestran la página "Próximamente".
const routes: Routes = [
  { path: '', redirectTo: 'resumen', pathMatch: 'full' },
  {
    path: 'resumen',
    loadChildren: () =>
      import('./features/dashboard/dashboard-module').then((m) => m.DashboardModule),
  },
  {
    path: 'movimientos',
    loadChildren: () =>
      import('./features/movimientos/movimientos-module').then((m) => m.MovimientosModule),
  },
  {
    path: 'categorias',
    loadChildren: () =>
      import('./features/categorias/categorias-module').then((m) => m.CategoriasModule),
  },
  { path: 'metas', component: ProximamenteComponent, data: { titulo: 'Metas' } },
  { path: 'historial', component: ProximamenteComponent, data: { titulo: 'Historial' } },
  { path: 'ajustes', component: ProximamenteComponent, data: { titulo: 'Ajustes' } },
  { path: '**', redirectTo: 'resumen' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
