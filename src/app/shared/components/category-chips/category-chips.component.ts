import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface ChipOpcion {
  valor: string;
  etiqueta: string;
  conteo?: number; // si viene, se muestra junto a la etiqueta
}

// Chips seleccionables: se usan como filtro (Movimientos) y como selector (modal).
@Component({
  selector: 'app-category-chips',
  standalone: false,
  templateUrl: './category-chips.component.html',
  styleUrl: './category-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryChipsComponent {
  opciones = input<ChipOpcion[]>([]);
  seleccionado = input<string | null>(null);
  error = input(false);
  etiquetaAccesible = input('Categorías');

  seleccionar = output<string>();
}
