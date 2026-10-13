import { Component, computed, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, switchMap } from 'rxjs';
import { Categoria } from '../../../core/models/categoria.model';
import { Movimiento, MovimientoDto } from '../../../core/models/movimiento.model';
import { ResumenBase, VistaQuincena } from '../../../core/models/quincena.model';
import { CategoriaService } from '../../../core/services/categoria.service';
import { MovimientosService } from '../../../core/services/movimientos.service';
import { QuincenaService } from '../../../core/services/quincena.service';
import { ToastService } from '../../../core/services/toast.service';
import { CopPipe } from '../../../shared/pipes/cop.pipe';

// Componente CONTENEDOR: inyecta servicios y maneja carga, periodo y modal.
// Las tarjetas son componentes de presentación que solo reciben la vista ya calculada.
@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  protected readonly cargando = signal(true);
  protected readonly base = signal<ResumenBase | null>(null);
  protected readonly movimientos = signal<Movimiento[]>([]);
  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly indicePeriodo = signal(0); // 0 = quincena actual; 1.. = cerradas
  protected readonly escenarioDeficit = signal(false);
  protected readonly modalAbierto = signal(false);
  protected readonly nuevoId = signal<string | null>(null);

  protected readonly esActual = computed(() => this.indicePeriodo() === 0);
  protected readonly puedeIrAtras = computed(
    () => this.indicePeriodo() < (this.base()?.cerradas.length ?? 0),
  );
  protected readonly nombre: string;

  // La vista se recalcula sola cuando cambian la base, los movimientos o el periodo.
  protected readonly vista = computed<VistaQuincena | null>(() => {
    const base = this.base();
    if (!base) return null;
    const i = this.indicePeriodo();
    if (i === 0) {
      const arrastre = this.escenarioDeficit()
        ? this.quincenaService.arrastreDeficit
        : base.periodo.arrastre;
      return this.quincenaService.vistaActual(base, this.movimientos(), this.categorias(), arrastre);
    }
    return this.quincenaService.vistaCerrada(base.cerradas[i - 1]);
  });

  private readonly cop = new CopPipe();

  constructor(
    private quincenaService: QuincenaService,
    private movimientosService: MovimientosService,
    private categoriaService: CategoriaService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
  ) {
    this.nombre = this.quincenaService.usuario;
  }

  ngOnInit(): void {
    // Para probar la quincena con déficit: /resumen?escenario=deficit
    this.escenarioDeficit.set(this.route.snapshot.queryParamMap.get('escenario') === 'deficit');

    // Primero carga el resumen (con espera simulada) y luego sigue el estado compartido de movimientos.
    this.quincenaService
      .getResumen()
      .pipe(
        switchMap((base) =>
          combineLatest([
            this.movimientosService.movimientos$,
            this.categoriaService.categorias$,
          ]).pipe(map(([m, c]) => ({ base, m, c }))),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ base, m, c }) => {
          this.base.set(base);
          this.movimientos.set(m);
          this.categorias.set(c);
          this.cargando.set(false);
        },
        error: () => {
          this.cargando.set(false);
          this.toastService.mostrar({ mensaje: 'No pudimos cargar tu resumen.' });
        },
      });
  }

  protected periodoAnterior(): void {
    if (this.puedeIrAtras()) this.indicePeriodo.update((i) => i + 1);
  }

  protected periodoSiguiente(): void {
    if (!this.esActual()) this.indicePeriodo.update((i) => i - 1);
  }

  protected volverALaActual(): void {
    this.indicePeriodo.set(0);
  }

  protected abrirModal(): void {
    this.modalAbierto.set(true);
  }

  protected cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  protected registrar(datos: MovimientoDto): void {
    this.movimientosService.create(datos).subscribe({
      next: (movimiento) => {
        this.cerrarModal();
        this.nuevoId.set(movimiento.id);
        setTimeout(() => this.nuevoId.set(null), 1800);
        this.toastService.mostrar({
          mensaje: `Registraste ${this.cop.transform(movimiento.monto)} en ${this.nombreCategoria(movimiento.categoria_id)}`,
          accionTexto: 'Deshacer',
          accion: () => this.movimientosService.delete(movimiento.id).subscribe(),
        });
      },
      error: () => this.toastService.mostrar({ mensaje: 'No pudimos registrar el gasto.' }),
    });
  }

  private nombreCategoria(id: string): string {
    return this.categorias().find((c) => c.id === id)?.nombre ?? '';
  }
}
