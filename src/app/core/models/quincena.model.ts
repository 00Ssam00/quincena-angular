import { Periodo } from './periodo.model';
import { PagoProximo } from './pago-proximo.model';

export interface Arrastre {
  tipo: 'sobrante' | 'deficit';
  monto: number;
}

export interface PagoFijoCerrado {
  nombre: string;
  fecha: string; // texto ya formateado: "domingo 20 de septiembre"
  monto: number;
}

export interface MovimientoCerrado {
  descripcion: string;
  categoria: string;
  fecha: string; // "30 sep"
  monto: number;
}

export interface QuincenaCerrada {
  id: string;
  titulo: string;
  diaInicio: number;
  mes: string;
  ingreso: number;
  arrastreEntrada: number; // positivo = sobrante, negativo = déficit
  gastoDiario: number[];
  pagosFijos: PagoFijoCerrado[];
  ultimosMovimientos: MovimientoCerrado[];
}

// Datos que devuelve getResumen() (todavía sin calcular nada).
export interface ResumenBase {
  hoy: string; // fecha "de hoy" simulada, yyyy-MM-dd
  periodo: Periodo;
  pagos: PagoProximo[];
  cerradas: QuincenaCerrada[];
}

// ---- Modelos de vista: ya calculados, listos para los componentes de presentación ----

export interface PagoFijoVista {
  id: string;
  nombre: string;
  fechaTexto: string; // "Lunes 12 de octubre" o "Pagado el …"
  monto: number;
}

export interface MovimientoVista {
  id: string;
  nombre: string;
  subtitulo: string; // "Mercado · Hoy"
  monto: number;
}

export interface ColumnaGrafico {
  dia: number;
  estado: 'pasado' | 'hoy' | 'futuro';
  valor: number; // gasto del día (o ritmo sugerido si es futuro)
  excedido: boolean;
  exceso: number; // cuánto supera el presupuesto diario
  etiqueta: string; // "8 oct", "Hoy", "12 oct – sugerido"
}

export interface VistaQuincena {
  cerrada: boolean;
  titulo: string;
  diaActual: number; // 0 si está cerrada
  dias: number;
  saldo: number;
  arrastre: Arrastre;
  gastado: number;
  disponibleTotal: number; // ingreso + arrastre
  diasRestantes: number;
  pagosFijos: PagoFijoVista[];
  totalPagosPendientes: number;
  columnas: ColumnaGrafico[];
  maximoGrafico: number;
  valorLinea: number; // ritmo sugerido (actual) o promedio (cerrada)
  presupuestoDiario: number;
  diasExcedidos: number;
  ultimos: MovimientoVista[];
}
