import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ColumnaGrafico, VistaQuincena } from '../../../core/models/quincena.model';

@Component({
  selector: 'app-daily-chart-card',
  standalone: false,
  templateUrl: './daily-chart-card.component.html',
  styleUrl: './daily-chart-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyChartCardComponent {
  vista = input.required<VistaQuincena>();

  // Columna sobre la que está el cursor (null = ninguna).
  protected readonly activa = signal<number | null>(null);

  protected readonly altoLinea = computed(() => this.porcentaje(this.vista().valorLinea));

  protected readonly resumenAccesible = computed(() => {
    const n = this.vista().diasExcedidos;
    return n === 0
      ? 'Gasto diario: todos los días dentro del presupuesto'
      : `Gasto diario: ${n} ${n === 1 ? 'día' : 'días'} sobre el presupuesto`;
  });

  protected alto(columna: ColumnaGrafico): number {
    return this.porcentaje(columna.valor);
  }

  protected posicionTooltip(columna: ColumnaGrafico): string {
    return `calc(${this.alto(columna)}% + 8px)`;
  }

  protected entrar(indice: number): void {
    this.activa.set(indice);
  }

  protected salir(): void {
    this.activa.set(null);
  }

  private porcentaje(valor: number): number {
    return Math.min(100, (valor / this.vista().maximoGrafico) * 100);
  }
}
