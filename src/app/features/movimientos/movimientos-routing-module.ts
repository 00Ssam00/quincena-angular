import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovimientosPageComponent } from './movimientos-page/movimientos-page.component';

const routes: Routes = [{ path: '', component: MovimientosPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovimientosRoutingModule {}
