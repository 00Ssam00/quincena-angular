import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { DATOS_MOCK } from '../data/quincena.mock';
import { QuincenaService } from './quincena.service';

describe('QuincenaService (valores del handoff)', () => {
  let servicio: QuincenaService;
  const q = DATOS_MOCK.quincenaActual;

  beforeEach(() => {
    servicio = TestBed.inject(QuincenaService);
  });

  it('calcula saldo, ritmo, presupuesto diario y días excedidos de la quincena actual', () => {
    const v = servicio.vistaActual(q, DATOS_MOCK.movimientos, q.arrastre);
    expect(v.gastado).toBe(1312400);
    expect(v.saldo).toBe(657600);
    expect(v.totalPagosPendientes).toBe(324900);
    expect(Math.round(v.valorLinea)).toBe(66540);
    expect(Math.round(v.presupuestoDiario)).toBe(46340);
    expect(v.diasExcedidos).toBe(3);
  });

  it('escenario con déficit baja el presupuesto diario a $26.340', () => {
    const v = servicio.vistaActual(q, DATOS_MOCK.movimientos, q.escenarioDeficit);
    expect(Math.round(v.presupuestoDiario)).toBe(26340);
    expect(v.arrastre.tipo).toBe('deficit');
  });

  it('no modifica los datos que recibe (inmutabilidad)', () => {
    const copia = structuredClone(DATOS_MOCK.movimientos);
    servicio.vistaActual(q, DATOS_MOCK.movimientos, q.arrastre);
    expect(DATOS_MOCK.movimientos).toEqual(copia);
  });

  it('calcula una quincena cerrada con su promedio y su saldo final', () => {
    const cerrada = DATOS_MOCK.quincenasCerradas[0];
    const v = servicio.vistaCerrada(cerrada);
    expect(v.cerrada).toBe(true);
    expect(v.columnas.length).toBe(15);
    const gasto = cerrada.gastoDiario.reduce((a, b) => a + b, 0);
    expect(v.valorLinea).toBeCloseTo(gasto / 15);
  });

  it('getResumen entrega la quincena actual y las cerradas', async () => {
    const base = await firstValueFrom(servicio.getResumen());
    expect(base.actual.id).toBe('2026-10-a');
    expect(base.cerradas.length).toBe(2);
  });
});
