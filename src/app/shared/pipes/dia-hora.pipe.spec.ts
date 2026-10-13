import { DiaHoraPipe } from './dia-hora.pipe';

describe('DiaHoraPipe', () => {
  const pipe = new DiaHoraPipe();
  const movimiento = { fecha: '2026-10-10', creado_en: '2026-10-10T18:40:00' };

  it('calcula el día del mes desde fecha', () => {
    expect(pipe.transform(movimiento, 'dia')).toBe(10);
  });

  it('calcula la hora desde creado_en', () => {
    expect(pipe.transform(movimiento, 'hora')).toBe('6:40 p. m.');
    expect(pipe.transform({ ...movimiento, creado_en: '2026-10-10T08:15:00' }, 'hora')).toBe('8:15 a. m.');
  });
});
