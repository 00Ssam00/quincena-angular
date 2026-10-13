import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import {
  ARRASTRE_DEFICIT,
  CATEGORIAS_MOCK,
  MOVIMIENTOS_MOCK,
} from '../data/quincena.mock';
import { QuincenaService } from './quincena.service';

describe('QuincenaService (valores del handoff)', () => {
  let servicio: QuincenaService;

  beforeEach(() => {
    servicio = TestBed.inject(QuincenaService);
  });

  it('calcula saldo, ritmo, presupuesto diario y días excedidos de la quincena actual', () => {
    const base = servicio.baseActual;
    const v = servicio.vistaActual(base, MOVIMIENTOS_MOCK, CATEGORIAS_MOCK, base.periodo.arrastre);
    expect(v.gastado).toBe(1312400);
    expect(v.saldo).toBe(657600);
    expect(v.totalPagosPendientes).toBe(324900);
    expect(Math.round(v.valorLinea)).toBe(66540);
    expect(Math.round(v.presupuestoDiario)).toBe(46340);
    expect(v.diasExcedidos).toBe(3);
  });

  it('escenario con déficit baja el presupuesto diario a $26.340', () => {
    const base = servicio.baseActual;
    const v = servicio.vistaActual(base, MOVIMIENTOS_MOCK, CATEGORIAS_MOCK, ARRASTRE_DEFICIT);
    expect(Math.round(v.presupuestoDiario)).toBe(26340);
    expect(v.arrastre.tipo).toBe('deficit');
  });

  it('no modifica los datos que recibe (inmutabilidad)', () => {
    const copia = structuredClone(MOVIMIENTOS_MOCK);
    const base = servicio.baseActual;
    servicio.vistaActual(base, MOVIMIENTOS_MOCK, CATEGORIAS_MOCK, base.periodo.arrastre);
    expect(MOVIMIENTOS_MOCK).toEqual(copia);
  });

  it('el pago fijo ya pagado (Arriendo) no cuenta como gasto del día', () => {
    const base = servicio.baseActual;
    const arriendo = MOVIMIENTOS_MOCK.find((m) => m.descripcion === 'Arriendo')!;
    expect(servicio.esPagoFijo(arriendo, base.pagos)).toBe(true);
    const comun = MOVIMIENTOS_MOCK.find((m) => m.descripcion === 'Taxi')!;
    expect(servicio.esPagoFijo(comun, base.pagos)).toBe(false);
  });

  it('calcula una quincena cerrada con su promedio', () => {
    const cerrada = servicio.baseActual.cerradas[0];
    const v = servicio.vistaCerrada(cerrada);
    expect(v.cerrada).toBe(true);
    expect(v.columnas.length).toBe(15);
    const gasto = cerrada.gastoDiario.reduce((a, b) => a + b, 0);
    expect(v.valorLinea).toBeCloseTo(gasto / 15);
  });

  it('getResumen entrega el periodo actual y las quincenas cerradas', async () => {
    const base = await firstValueFrom(servicio.getResumen());
    expect(base.periodo.id).toBe('2026-10-a');
    expect(base.cerradas.length).toBe(2);
  });

  it('arma los encabezados de día: Hoy, Ayer y el resto', () => {
    expect(servicio.encabezadoDia('2026-10-10', '2026-10-10').titulo).toBe('Hoy – sábado 10 de octubre');
    expect(servicio.encabezadoDia('2026-10-09', '2026-10-10').titulo).toBe('Ayer – viernes 9 de octubre');
    expect(servicio.encabezadoDia('2026-10-07', '2026-10-10').titulo).toBe('Miércoles 7 de octubre');
  });
});
