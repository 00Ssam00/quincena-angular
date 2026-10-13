import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CopPipe } from './pipes/cop.pipe';
import { DiaHoraPipe } from './pipes/dia-hora.pipe';
import { LogoComponent } from './components/logo/logo.component';
import { CardComponent } from './components/card/card.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';
import { CategoryChipsComponent } from './components/category-chips/category-chips.component';
import { SegmentedToggleComponent } from './components/segmented-toggle/segmented-toggle.component';
import { ToastComponent } from './components/toast/toast.component';
import { RegistrarGastoModalComponent } from './components/registrar-gasto-modal/registrar-gasto-modal.component';
import { ProximamenteComponent } from './components/proximamente/proximamente.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { FocusTrapDirective } from './directives/focus-trap.directive';

const PIEZAS = [
  CopPipe,
  DiaHoraPipe,
  LogoComponent,
  CardComponent,
  SkeletonComponent,
  CategoryChipsComponent,
  SegmentedToggleComponent,
  ToastComponent,
  RegistrarGastoModalComponent,
  ProximamenteComponent,
  ConfirmModalComponent,
  FocusTrapDirective,
];

// Piezas reutilizables (componentes de presentación y pipes) para cualquier módulo.
@NgModule({
  declarations: PIEZAS,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  exports: PIEZAS,
})
export class SharedModule {}
