import { Injectable } from '@angular/core';
import { defer, delay, Observable, of } from 'rxjs';
import {
  ARRASTRE_DEFICIT,
  HOY_SIMULADO,
  PAGOS_PROXIMOS_MOCK,
  PERIODO_ACTUAL_MOCK,
  QUINCENAS_CERRADAS_MOCK,
} from '../data/quincena.mock';
import { Categoria } from '../models/categoria.model';
import { Movimiento } from '../models/movimiento.model';
import { PagoProximo } from '../models/pago-proximo.model';
import {
  ColumnaGrafico,
  MovimientoVista,
  PagoFijoVista,
  QuincenaCerrada,
  ResumenBase,
  VistaQuincena,
} from '../models/quincena.model';
import {
  calcularPresupuestoDiario,
  calcularRitmoSugerido,
  calcularSaldo,
  sumar,
} from '../utils/calculos';
import {
  abreviaturaMes,
  diaDeFecha,
  diasDelPeriodo,
  fechaLarga,
  mayuscula,
  sumarDias,
} from '../utils/fechas';

// Datos y cálculos de la quincena. Los cálculos son métodos puros: reciben datos y
// devuelven un modelo de vista nuevo, sin tocar nada de lo que reciben.
@Injectable({ providedIn: 'root' })
export class QuincenaService {
  readonly usuario = 'Laura';

  // Arrastre negativo para probar el escenario con déficit (/resumen?escenario=deficit).
  readonly arrastreDeficit = ARRASTRE_DEFICIT;

  // Datos de la quincena actual sin espera, para pantallas que ya tienen el estado cargado.
  get baseActual(): ResumenBase {
    return this.armarBase();
  }

  getResumen(): Observable<ResumenBase> {
    return defer(() => of(this.armarBase())).pipe(delay(1400));
  }

  // Un movimiento es un pago fijo ya pagado si coincide con un pago próximo en monto y fecha.
  esPagoFijo(movimiento: Movimiento, pagos: PagoProximo[]): boolean {
    return pagos.some(
      (p) =>
        p.estado === 'paid' &&
        p.monto === movimiento.monto &&
        p.fecha_vencimiento === movimiento.fecha,
    );
  }

  vistaActual(
    base: ResumenBase,
    movimientos: Movimiento[],
    categorias: Categoria[],
    arrastre: number,
  ): VistaQuincena {
    const { periodo, pagos, hoy } = base;
    const dias = diasDelPeriodo(periodo.fecha_inicio, periodo.fecha_fin);
    const diaActual = diaDeFecha(hoy);
    const gastos = movimientos.filter((m) => m.tipo === 'expense');
    const gastado = sumar(gastos.map((m) => m.monto));
    const saldo = calcularSaldo(periodo.ingreso_base, arrastre, gastado);

    const pendientes = pagos.filter((p) => p.estado !== 'paid');
    const totalPendientes = sumar(pendientes.map((p) => p.monto));
    const diasRestantes = dias - diaActual;
    const ritmo = calcularRitmoSugerido(saldo, totalPendientes, diasRestantes);
    const presupuesto = calcularPresupuestoDiario(
      periodo.ingreso_base,
      arrastre,
      sumar(pagos.map((p) => p.monto)),
      dias,
    );

    // El gasto del día NO cuenta los pagos fijos (ya están descontados del presupuesto diario).
    const gastoDelDia = (dia: number) =>
      sumar(
        gastos
          .filter((m) => diaDeFecha(m.fecha) === dia && !this.esPagoFijo(m, pagos))
          .map((m) => m.monto),
      );
    const mes = abreviaturaMes(periodo.fecha_inicio);

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
      fechaTexto: mayuscula(fechaLarga(p.fecha_vencimiento)),
      monto: p.monto,
    }));

    // Más recientes primero; a igual fecha se respeta el orden de la lista (el nuevo va primero).
    const nombres = new Map(categorias.map((c) => [c.id, c.nombre]));
    const recientes = [...movimientos].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5);
    const ultimos: MovimientoVista[] = recientes.map((m) => ({
      id: m.id,
      nombre: m.descripcion,
      subtitulo: `${nombres.get(m.categoria_id) ?? 'Sin categoría'} · ${this.etiquetaDia(m.fecha, hoy, mes)}`,
      monto: m.monto,
    }));

    return {
      cerrada: false,
      titulo: periodo.etiqueta,
      diaActual,
      dias,
      saldo,
      arrastre: { tipo: arrastre >= 0 ? 'sobrante' : 'deficit', monto: Math.abs(arrastre) },
      gastado,
      disponibleTotal: periodo.ingreso_base + arrastre,
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
  etiquetaDia(fecha: string, hoy: string, mes: string): string {
    if (fecha === hoy) return 'Hoy';
    if (fecha === sumarDias(hoy, -1)) return 'Ayer';
    return `${diaDeFecha(fecha)} ${mes}`;
  }

  // Encabezado de grupo en Movimientos: "Hoy – sábado 10 de octubre"
  encabezadoDia(fecha: string, hoy: string): { titulo: string; reciente: boolean } {
    const larga = fechaLarga(fecha);
    if (fecha === hoy) return { titulo: `Hoy – ${larga}`, reciente: true };
    if (fecha === sumarDias(hoy, -1)) return { titulo: `Ayer – ${larga}`, reciente: false };
    return { titulo: mayuscula(larga), reciente: false };
  }

  private armarBase(): ResumenBase {
    return {
      hoy: HOY_SIMULADO,
      periodo: { ...PERIODO_ACTUAL_MOCK },
      pagos: PAGOS_PROXIMOS_MOCK.map((p) => ({ ...p })),
      cerradas: structuredClone(QUINCENAS_CERRADAS_MOCK),
    };
  }

  // Escala del gráfico: nunca menos de 100.000, con 10 % de aire arriba.
  private maximo(columnas: ColumnaGrafico[], linea: number): number {
    const mayorGasto = Math.max(...columnas.filter((c) => c.estado !== 'futuro').map((c) => c.valor));
    return Math.max(100000, Math.max(mayorGasto, linea) * 1.1);
  }
}
