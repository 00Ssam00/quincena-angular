import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  OnDestroy,
  signal,
  untracked,
} from '@angular/core';
import { VistaQuincena } from '../../../core/models/quincena.model';
import { CopPipe } from '../../../shared/pipes/cop.pipe';

type EstadoSegmento = 'pasado' | 'hoy' | 'futuro';

@Component({
  selector: 'app-balance-card',
  standalone: false,
  templateUrl: './balance-card.component.html',
  styleUrl: './balance-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceCardComponent implements OnDestroy {
  vista = input.required<VistaQuincena>();

  // Cifra que se muestra: cuenta animada hacia el saldo real.
  protected readonly saldoMostrado = signal(0);
  private readonly listo = signal(false);
  private primeraVez = true;
  private frame = 0;
  private readonly cop = new CopPipe();

  protected readonly esDeficit = computed(() => this.vista().arrastre.tipo === 'deficit');

  protected readonly textoArrastre = computed(() => {
    const { arrastre, cerrada } = this.vista();
    const monto = this.cop.transform(arrastre.monto);
    if (cerrada) {
      return arrastre.tipo === 'sobrante'
        ? `Incluía ${monto} de la quincena anterior · pasó a la siguiente`
        : `Absorbió ${monto} de déficit de la quincena anterior`;
    }
    return arrastre.tipo === 'sobrante'
      ? `Incluye ${monto} que te sobraron de la quincena pasada`
      : `Se descontaron ${monto} de déficit de la quincena pasada`;
  });

  protected readonly textoRestan = computed(() => {
    const v = this.vista();
    if (v.cerrada) return 'Cerrada';
    return v.diasRestantes === 1 ? 'Queda 1 día' : `Quedan ${v.diasRestantes} días`;
  });

  // Los 15 segmentos de progreso; al inicio todos "futuro" y luego toman su color (entrada animada).
  protected readonly segmentos = computed<EstadoSegmento[]>(() => {
    const v = this.vista();
    return Array.from({ length: v.dias }, (_, i): EstadoSegmento => {
      if (!this.listo()) return 'futuro';
      if (v.cerrada) return 'pasado';
      const dia = i + 1;
      return dia < v.diaActual ? 'pasado' : dia === v.diaActual ? 'hoy' : 'futuro';
    });
  });

  constructor() {
    effect(() => {
      const objetivo = this.vista().saldo;
      untracked(() => this.animarHacia(objetivo));
    });
    setTimeout(() => this.listo.set(true), 0);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
  }

  private animarHacia(objetivo: number): void {
    cancelAnimationFrame(this.frame);
    const desde = this.primeraVez ? 0 : this.saldoMostrado();
    const duracion = this.primeraVez ? 1100 : 700;
    this.primeraVez = false;

    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sinMovimiento || desde === objetivo) {
      this.saldoMostrado.set(objetivo);
      return;
    }

    const inicio = performance.now();
    const paso = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / duracion);
      const suave = 1 - Math.pow(1 - t, 3); // easeOutCubic
      this.saldoMostrado.set(desde + (objetivo - desde) * suave);
      if (t < 1) this.frame = requestAnimationFrame(paso);
    };
    this.frame = requestAnimationFrame(paso);
  }
}
