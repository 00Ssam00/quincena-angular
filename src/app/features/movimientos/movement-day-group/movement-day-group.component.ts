import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Movimiento } from '../../../core/models/movimiento.model';

// Un renglón de la lista: el movimiento tal como llega del servicio + lo que la vista necesita.
export interface ItemMovimiento {
  movimiento: Movimiento;
  categoria: string; // nombre de la categoría
  esPagoFijo: boolean;
}

export interface GrupoDia {
  fecha: string;
  titulo: string;
  reciente: boolean; // Hoy se muestra en color de texto; los demás en gris
  subtotal: number;
  items: ItemMovimiento[];
}

@Component({
  selector: 'app-movement-day-group',
  standalone: false,
  templateUrl: './movement-day-group.component.html',
  styleUrl: './movement-day-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementDayGroupComponent {
  grupo = input.required<GrupoDia>();
  indice = input(0); // para escalonar la animación de entrada
  nuevoId = input<string | null>(null);

  // Los ids suben al contenedor: este componente solo presenta.
  editar = output<string>();
  eliminar = output<string>();
}
