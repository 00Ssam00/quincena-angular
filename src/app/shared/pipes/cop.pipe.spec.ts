import { CopPipe } from './cop.pipe';

describe('CopPipe', () => {
  const pipe = new CopPipe();

  it('formatea con puntos de miles y prefijo $', () => {
    expect(pipe.transform(1312400)).toBe('$1.312.400');
  });

  it('usa el signo menos (U+2212) en negativos', () => {
    expect(pipe.transform(-180000)).toBe('−$180.000');
  });

  it('redondea y trata null como 0', () => {
    expect(pipe.transform(66540.4)).toBe('$66.540');
    expect(pipe.transform(null)).toBe('$0');
  });
});
