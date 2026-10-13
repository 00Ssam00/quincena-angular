import { Component, computed, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { CATEGORIAS } from '../../../core/models/categoria';
import { Movimiento, NuevoGasto } from '../../../core/models/movimiento.model';
import { MovimientosService } from '../../../core/services/movimientos.service';
import { QuincenaService } from '../../../core/services/quincena.service';
import { ToastService } from '../../../core/services/toast.service';
import { sumar, } from '../../../core/utils/calculos';
import { abreviaturaMes, normalizar } from '../../../core/utils/fechas';
import { ChipOpcion } from '../../../shared/components/category-chips/category-chips.component';
import { CopPipe } from '../../../shared/pipes/cop.pipe';
import { GrupoDia } from '../movement-day-group/movement-day-group.component';

type Estado = 'cargando' | 'listo' | 'error';

// Componente CONTENEDOR: búsqueda, filtro, agrupación y estados (carga / vacío / error).
@Component({
  selector: 'app-movimientos-page',
  standalone: false,
  templateUrl: './movimientos-page.component.html',
  styleUrl: './movimientos-page.component.scss',
})
export class MovimientosPageComponent implements OnInit {
  protected readonly estado = signal<Estado>('cargando');
  protected readonly movimientos = signal<Movimiento[]>([]);
  protected readonly categoria = signal(''); // '' = Todas
  protected readonly modalAbierto = signal(false);
  protected readonly nuevoId = signal<string | null>(null);

  protected readonly busqueda = new FormControl('', { nonNullable: true });
  // El texto se actualiza 150 ms después de que el usuario deja de escribir.
  protected readonly texto = toSignal(
    this.busqueda.valueChanges.pipe(debounceTime(150), distinctUntilChanged()),
    { initialValue: '' },
  );

  protected readonly titulo: string;
  protected readonly quincena;

  // 1) Resultado de la búsqueda (sin tildes ni mayúsculas) sobre descripción y categoría.
  private readonly porBusqueda = computed(() => {
    const q = normalizar(this.texto().trim());
    if (!q) return this.movimientos();
    return this.movimientos().filter(
      (m) => normalizar(m.descripcion).includes(q) || normalizar(m.categoria).includes(q),
    );
  });

  // 2) Chips con conteo; los conteos salen del resultado de la búsqueda.
  protected readonly opcionesChips = computed<ChipOpcion[]>(() => {
    const lista = this.porBusqueda();
    return [
      { valor: '', etiqueta: 'Todas', conteo: lista.length },
      ...CATEGORIAS.map((c) => ({
        valor: c,
        etiqueta: c,
        conteo: lista.filter((m) => m.categoria === c).length,
      })),
    ];
  });

  // 3) Búsqueda + categoría elegida.
  protected readonly filtrados = computed(() => {
    const cat = this.categoria();
    return cat ? this.porBusqueda().filter((m) => m.categoria === cat) : this.porBusqueda();
  });

  protected readonly resumen = computed(() => ({
    cantidad: this.filtrados().length,
    total: sumar(this.filtrados().map((m) => m.monto)),
  }));

  // 4) Grupos por día, del más reciente al más antiguo.
  protected readonly grupos = computed<GrupoDia[]>(() => {
    const porDia = new Map<number, Movimiento[]>();
    for (const m of this.filtrados()) {
      porDia.set(m.dia, [...(porDia.get(m.dia) ?? []), m]);
    }
    return [...porDia.entries()]
      .sort(([a], [b]) => b - a)
      .map(([dia, items]) => {
        const { titulo, reciente } = this.quincenaService.encabezadoDia(dia);
        return {
          dia,
          titulo,
          reciente,
          subtotal: sumar(items.map((m) => m.monto)),
          items: items.map((m) => ({
            id: m.id,
            nombre: m.descripcion,
            subtitulo: `${m.categoria} – ${m.hora}`,
            monto: m.monto,
          })),
        };
      });
  });

  // Datos de la quincena actual para el modal (saldo, pagos pendientes, días restantes).
  protected readonly contexto = computed(() =>
    this.quincenaService.vistaActual(
      this.quincena,
      this.movimientos(),
      this.quincena.arrastre,
    ),
  );
  protected readonly mes: string;

  private readonly cop = new CopPipe();
  private suscripcion?: Subscription;

  constructor(
    private quincenaService: QuincenaService,
    private movimientosService: MovimientosService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
  ) {
    this.quincena = this.quincenaService.quincenaActual;
    this.titulo = this.quincena.titulo;
    this.mes = abreviaturaMes(this.quincena.inicio);
  }

  ngOnInit(): void {
    // Para ver el estado de error: /movimientos?error=1  (luego "Reintentar" lo quita)
    if (this.route.snapshot.queryParamMap.get('error') === '1') {
      this.movimientosService.setSimularError(true);
    }
    this.cargar();
  }

  protected cargar(): void {
    this.suscripcion?.unsubscribe();
    this.estado.set('cargando');
    this.suscripcion = this.movimientosService
      .getMovimientos()
      .pipe(
        switchMap(() => this.movimientosService.movimientos$),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (lista) => {
          this.movimientos.set(lista);
          this.estado.set('listo');
        },
        error: () => this.estado.set('error'),
      });
  }

  protected reintentar(): void {
    this.movimientosService.setSimularError(false);
    this.cargar();
  }

  protected elegirCategoria(valor: string): void {
    this.categoria.set(valor);
  }

  protected limpiarBusqueda(): void {
    this.busqueda.setValue('');
  }

  protected limpiarFiltros(): void {
    this.busqueda.setValue('');
    this.categoria.set('');
  }

  protected abrirModal(): void {
    this.modalAbierto.set(true);
  }

  protected cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  protected registrar(datos: NuevoGasto): void {
    this.movimientosService.registrarGasto(datos).subscribe({
      next: (movimiento) => {
        this.cerrarModal();
        this.nuevoId.set(movimiento.id);
        setTimeout(() => this.nuevoId.set(null), 1800);
        this.toastService.mostrar({
          mensaje: `Registraste ${this.cop.transform(movimiento.monto)} en ${movimiento.categoria}`,
          accionTexto: 'Deshacer',
          accion: () => this.movimientosService.deshacerGasto(movimiento.id).subscribe(),
        });
      },
      error: () => this.toastService.mostrar({ mensaje: 'No pudimos registrar el gasto.' }),
    });
  }
}
