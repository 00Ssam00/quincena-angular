// Fórmulas de negocio como funciones puras (sin Angular): fáciles de probar y de explicar.

export function calcularSaldo(ingreso: number, arrastre: number, gastado: number): number {
  return ingreso + arrastre - gastado;
}

// Cuánto se puede gastar por día para llegar al final cubriendo los pagos pendientes.
export function calcularRitmoSugerido(
  saldo: number,
  pagosPendientes: number,
  diasRestantes: number,
): number {
  if (diasRestantes <= 0) return 0;
  return (saldo - pagosPendientes) / diasRestantes;
}

export function calcularPresupuestoDiario(
  ingreso: number,
  arrastre: number,
  totalPagosFijos: number,
  dias: number,
): number {
  return (ingreso + arrastre - totalPagosFijos) / dias;
}

export interface VistaPreviaGasto {
  saldoDespues: number;
  ritmo: number;
  superaSaldo: boolean;
  noCubreFijos: boolean;
}

export function calcularVistaPrevia(
  saldo: number,
  pagosPendientes: number,
  diasRestantes: number,
  monto: number,
): VistaPreviaGasto {
  const saldoDespues = saldo - monto;
  const ritmo = calcularRitmoSugerido(saldoDespues, pagosPendientes, diasRestantes);
  return {
    saldoDespues,
    ritmo,
    superaSaldo: saldoDespues < 0,
    noCubreFijos: saldoDespues >= 0 && saldoDespues - pagosPendientes < 0,
  };
}

export function arrastreFirmado(tipo: 'sobrante' | 'deficit', monto: number): number {
  return tipo === 'sobrante' ? monto : -monto;
}

export function sumar(valores: number[]): number {
  return valores.reduce((total, v) => total + v, 0);
}
