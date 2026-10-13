import { Component, computed, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, Subscription, switchMap } from 'rxjs';
import { Categoria, CategoriaDto } from '../../../core/models/categoria.model';
import { Movimiento } from '../../../core/models/movimiento.model';
import { CategoriaService } from '../../../core/services/categoria.service';
import { MovimientosService } from '../../../core/services/movimientos.service';
import { ToastService } from '../../../core/services/toast.service';
import { sumar } from '../../../core/utils/calculos';

type Estado = 'cargando' | 'listo' | 'error';

interface FilaCategoria {
  categoria: Categoria;
  cantidad: number; // movimientos de esa categoría
  total: number; // suma de sus montos
}

// Componente CONTENEDOR de Categorías: lista y creación. El formulario es de presentación.
@Component({
  selector: 'app-categorias-page',
  standalone: false,
  templateUrl: './categorias-page.component.html',
  styleUrl: './categorias-page.component.scss',
})
export class CategoriasPageComponent implements OnInit {
  protected readonly estado = signal<Estado>('cargando');
  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly movimientos = signal<Movimiento[]>([]);
  protected readonly modalAbierto = signal(false);
  protected readonly guardando = signal(false);

  // Cada fila junta la categoría con lo que ya se gastó en ella (computed: se recalcula solo).
  protected readonly filas = computed<FilaCategoria[]>(() =>
    [...this.categorias()]
      .sort((a, b) => a.orden - b.orden)
      .map((categoria) => {
        const propios = this.movimientos().filter((m) => m.categoria_id === categoria.id);
        return { categoria, cantidad: propios.length, total: sumar(propios.map((m) => m.monto)) };
      }),
  );

  protected readonly nombres = computed(() => this.categorias().map((c) => c.nombre));

  private suscripcion?: Subscription;

  constructor(
    private categoriaService: CategoriaService,
    private movimientosService: MovimientosService,
    private toastService: ToastService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  protected cargar(): void {
    this.suscripcion?.unsubscribe();
    this.estado.set('cargando');
    // getAll() simula la espera; después seguimos el estado compartido de ambos servicios.
    this.suscripcion = this.categoriaService
      .getAll()
      .pipe(
        switchMap(() =>
          combineLatest([this.categoriaService.categorias$, this.movimientosService.movimientos$]),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ([categorias, movimientos]) => {
          this.categorias.set(categorias);
          this.movimientos.set(movimientos);
          this.estado.set('listo');
        },
        error: () => this.estado.set('error'),
      });
  }

  protected abrirModal(): void {
    this.modalAbierto.set(true);
  }

  protected cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  protected crear(datos: CategoriaDto): void {
    this.guardando.set(true);
    this.categoriaService.create(datos).subscribe({
      next: (categoria) => {
        this.guardando.set(false);
        this.cerrarModal();
        this.toastService.mostrar({ mensaje: `Creaste la categoría "${categoria.nombre}"` });
      },
      error: (e: Error) => {
        this.guardando.set(false);
        this.toastService.mostrar({ mensaje: e.message || 'No pudimos crear la categoría.' });
      },
    });
  }
}
