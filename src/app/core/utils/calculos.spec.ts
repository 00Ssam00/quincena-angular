import { calcularRitmoSugerido, calcularVistaPrevia } from './calculos';

describe('calculos', () => {
  it('el ritmo sugerido es 0 cuando no quedan días', () => {
    expect(calcularRitmoSugerido(100000, 0, 0)).toBe(0);
  });

  it('la vista previa avisa cuando el gasto supera el saldo', () => {
    const v = calcularVistaPrevia(657600, 324900, 5, 700000);
    expect(v.superaSaldo).toBe(true);
    expect(v.saldoDespues).toBe(-42400);
  });

  it('avisa cuando no alcanza para los pagos fijos pero sí queda saldo', () => {
    const v = calcularVistaPrevia(657600, 324900, 5, 400000);
    expect(v.superaSaldo).toBe(false);
    expect(v.noCubreFijos).toBe(true);
  });
});
