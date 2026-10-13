import { Injectable } from '@angular/core';
import { BehaviorSubject, defer, delay, Observable, of, throwError } from 'rxjs';
import { CATEGORIAS_MOCK } from '../data/quincena.mock';
import { Categoria, CategoriaDto } from '../models/categoria.model';
import { MovimientosService } from './movimientos.service';

// Simula una API REST de categorías (tabla categories). Mismo patrón que MovimientosService.
@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly estado = new BehaviorSubject<Categoria[]>(
    CATEGORIAS_MOCK.map((c) => ({ ...c })),
  );
  readonly categorias$ = this.estado.asObservable();

  private siguienteId = CATEGORIAS_MOCK.length + 1;

  constructor(private movimientosService: MovimientosService) {}

  getAll(): Observable<Categoria[]> {
    return defer(() => of([...this.estado.value])).pipe(delay(600));
  }

  getById(id: string): Observable<Categoria> {
    return defer(() => {
      const categoria = this.estado.value.find((c) => c.id === id);
      return categoria
        ? of({ ...categoria })
        : throwError(() => new Error('La categoría no existe.'));
    }).pipe(delay(300));
  }

  create(datos: CategoriaDto): Observable<Categoria> {
    return defer(() => {
      const nombre = datos.nombre.trim();
      if (this.existeNombre(nombre)) {
        return throwError(() => new Error(`Ya existe una categoría llamada "${nombre}".`));
      }
      const nueva: Categoria = {
        id: `cat-${this.siguienteId++}`,
        nombre,
        color: datos.color,
        icono: null,
        esta_activo: true,
        orden: Math.max(0, ...this.estado.value.map((c) => c.orden)) + 1,
      };
      this.estado.next([...this.estado.value, nueva]);
      return of({ ...nueva });
    }).pipe(delay(400));
  }

  update(id: string, datos: CategoriaDto): Observable<Categoria> {
    return defer(() => {
      const actual = this.estado.value.find((c) => c.id === id);
      if (!actual) return throwError(() => new Error('La categoría no existe.'));
      const nombre = datos.nombre.trim();
      if (this.existeNombre(nombre, id)) {
        return throwError(() => new Error(`Ya existe una categoría llamada "${nombre}".`));
      }
      const editada: Categoria = { ...actual, nombre, color: datos.color };
      this.estado.next(this.estado.value.map((c) => (c.id === id ? editada : c)));
      return of({ ...editada });
    }).pipe(delay(400));
  }

  delete(id: string): Observable<void> {
    return defer(() => {
      if (!this.estado.value.some((c) => c.id === id)) {
        return throwError(() => new Error('La categoría no existe.'));
      }
      if (this.movimientosService.categoriaEnUso(id)) {
        return throwError(() => new Error('No se puede eliminar: tiene movimientos asociados.'));
      }
      this.estado.next(this.estado.value.filter((c) => c.id !== id));
      return of(undefined);
    }).pipe(delay(400));
  }

  private existeNombre(nombre: string, excluirId?: string): boolean {
    const buscado = nombre.toLowerCase();
    return this.estado.value.some(
      (c) => c.id !== excluirId && c.nombre.toLowerCase() === buscado,
    );
  }
}
