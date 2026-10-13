import { Injectable } from '@angular/core';
import { BehaviorSubject, defer, delay, mergeMap, Observable, of, throwError, timer } from 'rxjs';
import {
  METODO_PAGO_POR_DEFECTO,
  MOVIMIENTOS_MOCK,
  PERIODO_ACTUAL_MOCK,
} from '../data/quincena.mock';
import { Movimiento, MovimientoDto } from '../models/movimiento.model';
import { timestampLocal } from '../utils/fechas';

// Simula una API REST de movimientos (tabla transactions): getAll, getById, create, update, delete.
// Todos devuelven Observable con of().pipe(delay()), así que en noviembre solo cambia el cuerpo
// de cada método por una llamada con HttpClient y los componentes no se tocan.
//
// El estado es un BehaviorSubject privado e inmutable: cada cambio crea un arreglo nuevo.
// Resumen y Movimientos leen este MISMO estado (movimientos$).
@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private readonly estado = new BehaviorSubject<Movimiento[]>(
    MOVIMIENTOS_MOCK.map((m) => ({ ...m })),
  );
  readonly movimientos$ = this.estado.asObservable();

  private simularError = false;
  private siguienteId = MOVIMIENTOS_MOCK.length + 1;

  // Interruptor para probar el estado de error y el botón "Reintentar".
  setSimularError(activo: boolean): void {
    this.simularError = activo;
  }

  getAll(): Observable<Movimiento[]> {
    return defer(() =>
      this.simularError
        ? timer(1200).pipe(mergeMap(() => throwError(() => new Error('Error de conexión'))))
        : of([...this.estado.value]).pipe(delay(1200)),
    );
  }

  getById(id: string): Observable<Movimiento> {
    return defer(() => {
      const movimiento = this.estado.value.find((m) => m.id === id);
      return movimiento
        ? of({ ...movimiento })
        : throwError(() => new Error('El movimiento no existe.'));
    }).pipe(delay(300));
  }

  create(datos: MovimientoDto): Observable<Movimiento> {
    return defer(() => {
      const nuevo: Movimiento = {
        id: `m${this.siguienteId++}`,
        periodo_id: PERIODO_ACTUAL_MOCK.id,
        categoria_id: datos.categoria_id,
        metodo_pago_id: METODO_PAGO_POR_DEFECTO,
        tarjeta_id: null,
        tipo: 'expense',
        monto: datos.monto,
        descripcion: datos.descripcion.trim(),
        nota: null,
        fecha: datos.fecha,
        creado_en: timestampLocal(),
      };
      this.estado.next([nuevo, ...this.estado.value]);
      return of({ ...nuevo });
    }).pipe(delay(400));
  }

  // Reemplaza solo el elemento editado; el resto del arreglo se conserva.
  update(id: string, datos: MovimientoDto): Observable<Movimiento> {
    return defer(() => {
      const actual = this.estado.value.find((m) => m.id === id);
      if (!actual) return throwError(() => new Error('El movimiento no existe.'));
      const editado: Movimiento = {
        ...actual,
        categoria_id: datos.categoria_id,
        monto: datos.monto,
        descripcion: datos.descripcion.trim(),
        fecha: datos.fecha,
      };
      this.estado.next(this.estado.value.map((m) => (m.id === id ? editado : m)));
      return of({ ...editado });
    }).pipe(delay(400));
  }

  delete(id: string): Observable<void> {
    return defer(() => {
      if (!this.estado.value.some((m) => m.id === id)) {
        return throwError(() => new Error('El movimiento no existe.'));
      }
      this.estado.next(this.estado.value.filter((m) => m.id !== id));
      return of(undefined);
    }).pipe(delay(400));
  }

  // Consulta síncrona para validar que una categoría no se borre estando en uso.
  categoriaEnUso(categoriaId: string): boolean {
    return this.estado.value.some((m) => m.categoria_id === categoriaId);
  }
}
