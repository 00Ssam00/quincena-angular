import { Injectable } from '@angular/core';
import { BehaviorSubject, defer, delay, mergeMap, Observable, of, throwError, timer } from 'rxjs';
import { DATOS_MOCK } from '../data/quincena.mock';
import { Movimiento, NuevoGasto } from '../models/movimiento.model';
import { horaActual } from '../utils/fechas';

// Simula una API de movimientos. El estado vive en un BehaviorSubject privado y es
// inmutable: cada cambio crea un arreglo nuevo, nunca se modifica el anterior.
// Resumen y Movimientos leen este MISMO estado, por eso un gasto aparece en ambas pantallas.
@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private readonly estado = new BehaviorSubject<Movimiento[]>(
    DATOS_MOCK.movimientos.map((m) => ({ ...m })),
  );
  readonly movimientos$ = this.estado.asObservable();

  private simularError = false;
  private siguienteId = DATOS_MOCK.movimientos.length + 1;

  // Interruptor para probar el estado de error y el botón "Reintentar".
  setSimularError(activo: boolean): void {
    this.simularError = activo;
  }

  getMovimientos(): Observable<Movimiento[]> {
    return defer(() =>
      this.simularError
        ? timer(1200).pipe(mergeMap(() => throwError(() => new Error('Error de conexión'))))
        : of([...this.estado.value]).pipe(delay(1200)),
    );
  }

  registrarGasto(datos: NuevoGasto): Observable<Movimiento> {
    return defer(() => {
      const nuevo: Movimiento = {
        id: `m${this.siguienteId++}`,
        dia: datos.dia,
        descripcion: datos.descripcion.trim() || datos.categoria,
        categoria: datos.categoria,
        hora: horaActual(),
        monto: datos.monto,
      };
      this.estado.next([nuevo, ...this.estado.value]);
      return of({ ...nuevo });
    }).pipe(delay(400));
  }

  // Edita un movimiento existente: reemplaza solo ese elemento y crea un arreglo nuevo.
  actualizarGasto(id: string, datos: NuevoGasto): Observable<Movimiento> {
    return defer(() => {
      const actual = this.estado.value.find((m) => m.id === id);
      if (!actual) return throwError(() => new Error('El movimiento no existe.'));
      const editado: Movimiento = {
        ...actual,
        dia: datos.dia,
        descripcion: datos.descripcion.trim() || datos.categoria,
        categoria: datos.categoria,
        monto: datos.monto,
      };
      this.estado.next(this.estado.value.map((m) => (m.id === id ? editado : m)));
      return of({ ...editado });
    }).pipe(delay(400));
  }

  eliminarGasto(id: string): Observable<Movimiento> {
    return defer(() => {
      const existente = this.estado.value.find((m) => m.id === id);
      if (!existente) return throwError(() => new Error('El movimiento no existe.'));
      this.estado.next(this.estado.value.filter((m) => m.id !== id));
      return of({ ...existente });
    }).pipe(delay(400));
  }

  // Revierte un gasto registrado (botón "Deshacer" del toast).
  deshacerGasto(id: string): Observable<void> {
    return defer(() => {
      this.estado.next(this.estado.value.filter((m) => m.id !== id));
      return of(undefined);
    });
  }
}
