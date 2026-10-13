import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { CategoriasRoutingModule } from './categorias-routing-module';
import { CategoriasPageComponent } from './categorias-page/categorias-page.component';
import { CategoriaFormModalComponent } from './categoria-form-modal/categoria-form-modal.component';

@NgModule({
  declarations: [CategoriasPageComponent, CategoriaFormModalComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, CategoriasRoutingModule],
})
export class CategoriasModule {}
