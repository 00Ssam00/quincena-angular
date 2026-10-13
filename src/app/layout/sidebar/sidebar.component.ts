import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Tema } from '../../core/services/theme.service';
import { OpcionToggle } from '../../shared/components/segmented-toggle/segmented-toggle.component';

export interface ItemNav {
  ruta: string;
  etiqueta: string;
}

const ALTO_ITEM = 41;
const SEPARACION = 2;

// Componente de presentación: no inyecta servicios; todo llega por input() y sale por output().
@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  items = input.required<ItemNav[]>();
  indiceActivo = input(0);
  tema = input<Tema>('light');
  esMovil = input(false);
  abierta = input(false);

  cambiarTema = output<Tema>();
  navegar = output<void>();

  protected readonly opcionesTema: OpcionToggle[] = [
    { valor: 'light', etiqueta: 'Claro' },
    { valor: 'dark', etiqueta: 'Oscuro' },
  ];

  // La pastilla es un único elemento que se desliza hasta el ítem activo (41 px + 2 px de separación).
  protected readonly desplazamiento = computed(
    () => `translateY(${this.indiceActivo() * (ALTO_ITEM + SEPARACION)}px)`,
  );

  protected alCambiarTema(valor: string): void {
    this.cambiarTema.emit(valor as Tema);
  }
}
