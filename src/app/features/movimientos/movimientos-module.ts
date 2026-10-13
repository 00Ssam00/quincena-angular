import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { MovimientosRoutingModule } from './movimientos-routing-module';
import { MovimientosPageComponent } from './movimientos-page/movimientos-page.component';
import { MovementFiltersComponent } from './movement-filters/movement-filters.component';
import { MovementDayGroupComponent } from './movement-day-group/movement-day-group.component';

@NgModule({
  declarations: [MovimientosPageComponent, MovementFiltersComponent, MovementDayGroupComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, MovimientosRoutingModule],
})
export class MovimientosModule {}
