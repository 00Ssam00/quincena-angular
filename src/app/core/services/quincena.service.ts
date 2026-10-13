import { Injectable } from '@angular/core';
import { defer, delay, Observable, of } from 'rxjs';
import { DATOS_MOCK } from '../data/quincena.mock';
import { Movimiento } from '../models/movimiento.model';
import {
  Arrastre,
  ColumnaGrafico,
  MovimientoVista,
  PagoFijoVista,
  QuincenaActual,
  QuincenaCerrada,
  ResumenBase,
  VistaQuincena,
} from '../models/quincena.model';
import {
  arrastreFirmado,
  calcularPresupuestoDiario,
  calcularRitmoSugerido,
  calcularSaldo,
  sumar,
} from '../utils/calculos';
import { abreviaturaMes, fechaDelDia, fechaLarga, mayuscula } from '../utils/fechas';

// Datos y cálculos de la quincena. Los cálculos son métodos puros: reciben datos y
// devuelven un modelo de vista nuevo, sin tocar nada de lo que reciben.
@Injectable({ providedIn: 'root' })
export class QuincenaService {
  readonly usuario = 'Laura';

  // Datos de la quincena actual sin espera, para pantallas que ya tienen el estado cargado.
  get quincenaActual(): QuincenaActual {
    return structuredClone(DATOS_MOCK.quincenaActual);
  }

  getResumen(): Observable<ResumenBase> {
    return defer(() =>
      of<ResumenBase>({
        actual: structuredClone(DATOS_MOCK.quincenaActual),
        cerradas: structuredClone(DATOS_MOCK.quincenasCerradas),
      }),
    ).pipe(delay(1400));
  }

  vistaActual(
    quincena: QuincenaActual,
    movimientos: Movimiento[],
    arrastre: Arrastre,
  ): VistaQuincena {
    const { dias, diaActual, ingreso, inicio } = quincena;
    const arrastreNum = arrastreFirmado(arrastre.tipo, arrastre.monto);
    const gastado = sumar(movimientos.map((m) => m.monto));
    const saldo = calcularSaldo(ingreso, arrastreNum, gastado);

    const pendientes = quincena.pagosFijos.filter((p) => !p.pagado);
    const totalPendientes = sumar(pendientes.map((p) => p.monto));
    const diasRestantes = dias - diaActual;
    const ritmo = calcularRitmoSugerido(saldo, totalPendientes, diasRestantes);
    const presupuesto = calcularPresupuestoDiario(
      ingreso,
      arrastreNum,
      sumar(quincena.pagosFijos.map((p) => p.monto)),
      dias,
    );

    // El gasto del día NO cuenta los pagos fijos (ya están descontados del presupuesto diario).
    const gastoDelDia = (dia: number) =>
      sumar(movimientos.filter((m) => m.dia === dia && !m.pagoFijoId).map((m) => m.monto));
    const mes = abreviaturaMes(inicio);

    const columnas: ColumnaGrafico[] = Array.from({ length: dias }, (_, i) => {
      const dia = i + 1;
      if (dia > diaActual) {
        return { dia, estado: 'futuro', valor: ritmo, excedido: false, exceso: 0, etiqueta: `${dia} ${mes} – sugerido` };
      }
      const valor = gastoDelDia(dia);
      const excedido = valor > presupuesto;
      return {
        dia,
        estado: dia === diaActual ? 'hoy' : 'pasado',
        valor,
        excedido,
        exceso: excedido ? valor - presupuesto : 0,
        etiqueta: dia === diaActual ? 'Hoy' : `${dia} ${mes}`,
      };
    });

    const pagosFijos: PagoFijoVista[] = pendientes.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      fechaTexto: mayuscula(fechaLarga(p.fecha)),
      monto: p.monto,
    }));

    // Más recientes primero; a igual día se respeta el orden de la lista (el nuevo va primero).
    const recientes = [...movimientos].sort((a, b) => b.dia - a.dia).slice(0, 5);
    const ultimos: MovimientoVista[] = recientes.map((m) => ({
      id: m.id,
      nombre: m.descripcion,
      subtitulo: `${m.categoria} · ${this.etiquetaDia(m.dia, diaActual, mes)}`,
      monto: m.monto,
    }));

    return {
      cerrada: false,
      titulo: quincena.titulo,
      diaActual,
      dias,
      saldo,
      arrastre,
      gastado,
      disponibleTotal: ingreso + arrastreNum,
      diasRestantes,
      pagosFijos,
      totalPagosPendientes: totalPendientes,
      columnas,
      maximoGrafico: this.maximo(columnas, ritmo),
      valorLinea: ritmo,
      presupuestoDiario: presupuesto,
      diasExcedidos: columnas.filter((c) => c.excedido).length,
      ultimos,
    };
  }

  vistaCerrada(q: QuincenaCerrada): VistaQuincena {
    const dias = q.gastoDiario.length;
    const totalPagos = sumar(q.pagosFijos.map((p) => p.monto));
    const totalGasto = sumar(q.gastoDiario);
    const saldoFinal = q.ingreso + q.arrastreEntrada - totalGasto - totalPagos;
    const presupuesto = (q.ingreso + q.arrastreEntrada - totalPagos) / dias;
    const promedio = totalGasto / dias;

    const columnas: ColumnaGrafico[] = q.gastoDiario.map((valor, i) => {
      const excedido = valor > presupuesto;
      const dia = q.diaInicio + i;
      return {
        dia,
        estado: 'pasado',
        valor,
        excedido,
        exceso: excedido ? valor - presupuesto : 0,
        etiqueta: `${dia} ${q.mes}`,
      };
    });

    return {
      cerrada: true,
      titulo: q.titulo,
      diaActual: 0,
      dias,
      saldo: saldoFinal,
      arrastre: {
        tipo: q.arrastreEntrada >= 0 ? 'sobrante' : 'deficit',
        monto: Math.abs(q.arrastreEntrada),
      },
      gastado: totalGasto + totalPagos,
      disponibleTotal: q.ingreso + q.arrastreEntrada,
      diasRestantes: 0,
      pagosFijos: q.pagosFijos.map((p, i) => ({
        id: `${q.id}-pf-${i}`,
        nombre: p.nombre,
        fechaTexto: `Pagado el ${p.fecha}`,
        monto: p.monto,
      })),
      totalPagosPendientes: totalPagos,
      columnas,
      maximoGrafico: this.maximo(columnas, promedio),
      valorLinea: promedio,
      presupuestoDiario: presupuesto,
      diasExcedidos: columnas.filter((c) => c.excedido).length,
      ultimos: q.ultimosMovimientos.map((m, i) => ({
        id: `${q.id}-m-${i}`,
        nombre: m.descripcion,
        subtitulo: `${m.categoria} · ${m.fecha}`,
        monto: m.monto,
      })),
    };
  }

  // "Hoy", "Ayer" o "8 oct"
  etiquetaDia(dia: number, diaActual: number, mes: string): string {
    if (dia === diaActual) return 'Hoy';
    if (dia === diaActual - 1) return 'Ayer';
    return `${dia} ${mes}`;
  }

  // Encabezado de grupo en Movimientos: "Hoy – sábado 10 de octubre"
  encabezadoDia(dia: number): { titulo: string; reciente: boolean } {
    const q = DATOS_MOCK.quincenaActual;
    const fecha = fechaLarga(fechaDelDia(q.inicio, dia));
    if (dia === q.diaActual) return { titulo: `Hoy – ${fecha}`, reciente: true };
    if (dia === q.diaActual - 1) return { titulo: `Ayer – ${fecha}`, reciente: false };
    return { titulo: mayuscula(fecha), reciente: false };
  }

  // Escala del gráfico: nunca menos de 100.000, con 10 % de aire arriba.
  private maximo(columnas: ColumnaGrafico[], linea: number): number {
    const mayorGasto = Math.max(...columnas.filter((c) => c.estado !== 'futuro').map((c) => c.valor));
    return Math.max(100000, Math.max(mayorGasto, linea) * 1.1);
  }
}
