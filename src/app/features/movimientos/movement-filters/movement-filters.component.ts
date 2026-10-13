import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChipOpcion } from '../../../shared/components/category-chips/category-chips.component';

export interface ResumenFiltro {
  cantidad: number;
  total: number;
}

// Presentación: buscador + chips. El FormControl y los datos los maneja el contenedor.
@Component({
  selector: 'app-movement-filters',
  standalone: false,
  templateUrl: './movement-filters.component.html',
  styleUrl: './movement-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementFiltersComponent {
  busqueda = input.required<FormControl<string>>();
  hayTexto = input(false);
  opciones = input<ChipOpcion[]>([]);
  categoria = input('');
  resumen = input.required<ResumenFiltro>();

  seleccionarCategoria = output<string>();
  limpiarBusqueda = output<void>();
}
