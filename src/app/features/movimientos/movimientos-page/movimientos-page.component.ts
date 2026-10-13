import { Component, computed, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, debounceTime, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { Categoria } from '../../../core/models/categoria.model';
import { Movimiento, MovimientoDto } from '../../../core/models/movimiento.model';
import { CategoriaService } from '../../../core/services/categoria.service';
import { MovimientosService } from '../../../core/services/movimientos.service';
import { QuincenaService } from '../../../core/services/quincena.service';
import { ToastService } from '../../../core/services/toast.service';
import { sumar } from '../../../core/utils/calculos';
import { normalizar } from '../../../core/utils/fechas';
import { ChipOpcion } from '../../../shared/components/category-chips/category-chips.component';
import { CopPipe } from '../../../shared/pipes/cop.pipe';
import { GrupoDia, ItemMovimiento } from '../movement-day-group/movement-day-group.component';

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
  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly categoria = signal(''); // id de la categoría elegida; '' = Todas
  protected readonly modalAbierto = signal(false);
  // Bandera de edición: null = se está creando; con valor = se está editando ese movimiento.
  protected readonly editando = signal<Movimiento | null>(null);
  protected readonly porEliminar = signal<Movimiento | null>(null);
  protected readonly eliminando = signal(false);
  protected readonly nuevoId = signal<string | null>(null);

  protected readonly busqueda = new FormControl('', { nonNullable: true });
  // El texto se actualiza 150 ms después de que el usuario deja de escribir.
  protected readonly texto = toSignal(
    this.busqueda.valueChanges.pipe(debounceTime(150), distinctUntilChanged()),
    { initialValue: '' },
  );

  // Datos de la quincena actual (sin espera: ya se usan en esta pantalla).
  protected readonly base;
  protected readonly titulo: string;

  private readonly nombresCategoria = computed(
    () => new Map(this.categorias().map((c) => [c.id, c.nombre])),
  );

  // 1) Resultado de la búsqueda (sin tildes ni mayúsculas) sobre descripción y categoría.
  private readonly porBusqueda = computed(() => {
    const q = normalizar(this.texto().trim());
    if (!q) return this.movimientos();
    const nombres = this.nombresCategoria();
    return this.movimientos().filter(
      (m) =>
        normalizar(m.descripcion).includes(q) ||
        normalizar(nombres.get(m.categoria_id) ?? '').includes(q),
    );
  });

  // 2) Chips con conteo; los conteos salen del resultado de la búsqueda.
  protected readonly opcionesChips = computed<ChipOpcion[]>(() => {
    const lista = this.porBusqueda();
    return [
      { valor: '', etiqueta: 'Todas', conteo: lista.length },
      ...this.categorias().map((c) => ({
        valor: c.id,
        etiqueta: c.nombre,
        conteo: lista.filter((m) => m.categoria_id === c.id).length,
      })),
    ];
  });

  // 3) Búsqueda + categoría elegida.
  protected readonly filtrados = computed(() => {
    const cat = this.categoria();
    return cat ? this.porBusqueda().filter((m) => m.categoria_id === cat) : this.porBusqueda();
  });

  protected readonly resumen = computed(() => ({
    cantidad: this.filtrados().length,
    total: sumar(this.filtrados().map((m) => m.monto)),
  }));

  // 4) Grupos por fecha, de la más reciente a la más antigua.
  protected readonly grupos = computed<GrupoDia[]>(() => {
    const nombres = this.nombresCategoria();
    const { hoy, pagos } = this.base;
    const porFecha = new Map<string, ItemMovimiento[]>();
    for (const movimiento of this.filtrados()) {
      const item: ItemMovimiento = {
        movimiento,
        categoria: nombres.get(movimiento.categoria_id) ?? 'Sin categoría',
        esPagoFijo: this.quincenaService.esPagoFijo(movimiento, pagos),
      };
      porFecha.set(movimiento.fecha, [...(porFecha.get(movimiento.fecha) ?? []), item]);
    }
    return [...porFecha.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([fecha, items]) => ({
        fecha,
        ...this.quincenaService.encabezadoDia(fecha, hoy),
        subtotal: sumar(items.map((i) => i.movimiento.monto)),
        items,
      }));
  });

  // Datos de la quincena actual para el modal (saldo, pagos pendientes, días restantes).
  protected readonly contexto = computed(() =>
    this.quincenaService.vistaActual(
      this.base,
      this.movimientos(),
      this.categorias(),
      this.base.periodo.arrastre,
    ),
  );

  private readonly cop = new CopPipe();
  private suscripcion?: Subscription;

  constructor(
    private quincenaService: QuincenaService,
    private movimientosService: MovimientosService,
    private categoriaService: CategoriaService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
  ) {
    this.base = this.quincenaService.baseActual;
    this.titulo = this.base.periodo.etiqueta;
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
    // getAll() simula la espera (y el error); después seguimos el estado compartido.
    this.suscripcion = this.movimientosService
      .getAll()
      .pipe(
        switchMap(() =>
          combineLatest([this.movimientosService.movimientos$, this.categoriaService.categorias$]),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ([movimientos, categorias]) => {
          this.movimientos.set(movimientos);
          this.categorias.set(categorias);
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
    this.editando.set(null);
    this.modalAbierto.set(true);
  }

  protected abrirEdicion(id: string): void {
    const movimiento = this.movimientos().find((m) => m.id === id);
    if (!movimiento) return;
    this.editando.set(movimiento);
    this.modalAbierto.set(true);
  }

  protected cerrarModal(): void {
    this.modalAbierto.set(false);
    this.editando.set(null);
  }

  // El mismo modal sirve para crear y para editar: aquí se decide qué servicio llamar.
  protected guardar(datos: MovimientoDto): void {
    const actual = this.editando();
    if (actual) this.actualizar(actual.id, datos);
    else this.crear(datos);
  }

  private crear(datos: MovimientoDto): void {
    this.movimientosService.create(datos).subscribe({
      next: (movimiento) => {
        this.cerrarModal();
        this.resaltar(movimiento.id);
        const categoria = this.nombresCategoria().get(movimiento.categoria_id) ?? '';
        this.toastService.mostrar({
          mensaje: `Registraste ${this.cop.transform(movimiento.monto)} en ${categoria}`,
          accionTexto: 'Deshacer',
          accion: () => this.movimientosService.delete(movimiento.id).subscribe(),
        });
      },
      error: () => this.toastService.mostrar({ mensaje: 'No pudimos registrar el gasto.' }),
    });
  }

  private actualizar(id: string, datos: MovimientoDto): void {
    this.movimientosService.update(id, datos).subscribe({
      next: (movimiento) => {
        this.cerrarModal();
        this.resaltar(movimiento.id);
        this.toastService.mostrar({ mensaje: `Actualizaste "${movimiento.descripcion}"` });
      },
      error: () => this.toastService.mostrar({ mensaje: 'No pudimos guardar los cambios.' }),
    });
  }

  // --- Eliminar con confirmación ---
  protected pedirEliminar(id: string): void {
    this.porEliminar.set(this.movimientos().find((m) => m.id === id) ?? null);
  }

  protected cancelarEliminar(): void {
    this.porEliminar.set(null);
  }

  protected confirmarEliminar(): void {
    const movimiento = this.porEliminar();
    if (!movimiento) return;
    this.eliminando.set(true);
    this.movimientosService.delete(movimiento.id).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.porEliminar.set(null);
        this.toastService.mostrar({ mensaje: `Eliminaste "${movimiento.descripcion}"` });
      },
      error: () => {
        this.eliminando.set(false);
        this.porEliminar.set(null);
        this.toastService.mostrar({ mensaje: 'No pudimos eliminar el movimiento.' });
      },
    });
  }

  private resaltar(id: string): void {
    this.nuevoId.set(id);
    setTimeout(() => this.nuevoId.set(null), 1800);
  }
}
