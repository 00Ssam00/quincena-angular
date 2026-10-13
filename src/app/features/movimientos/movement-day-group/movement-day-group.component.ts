import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MovimientoVista } from '../../../core/models/quincena.model';

export interface GrupoDia {
  dia: number;
  titulo: string;
  reciente: boolean; // Hoy se muestra en color de texto; los demás en gris
  subtotal: number;
  items: MovimientoVista[];
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
