import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export interface OpcionToggle {
  valor: string;
  etiqueta: string;
}

// Toggle de dos opciones con indicador deslizante (tema Claro/Oscuro y fecha Ayer/Hoy).
@Component({
  selector: 'app-segmented-toggle',
  standalone: false,
  templateUrl: './segmented-toggle.component.html',
  styleUrl: './segmented-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedToggleComponent {
  opciones = input.required<OpcionToggle[]>();
  valor = input.required<string>();
  tamano = input<'sm' | 'md'>('sm');
  variante = input<'neutro' | 'fecha'>('neutro');
  etiquetaAccesible = input('Opciones');

  cambiar = output<string>();

  protected readonly indice = computed(() =>
    Math.max(0, this.opciones().findIndex((o) => o.valor === this.valor())),
  );
}
