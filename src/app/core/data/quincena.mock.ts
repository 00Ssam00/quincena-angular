import { Categoria } from '../models/categoria.model';
import { MetodoPago } from '../models/metodo-pago.model';
import { Movimiento } from '../models/movimiento.model';
import { PagoProximo } from '../models/pago-proximo.model';
import { Periodo } from '../models/periodo.model';
import { QuincenaCerrada } from '../models/quincena.model';

// Datos simulados (inventados) del handoff de diseño. Los servicios los exponen como Observable.
// Los nombres de campo siguen el esquema de la base de datos (en español, como el JSON de la API).

// Fecha "de hoy" simulada: el diseño está pensado para el sábado 10 de octubre de 2026.
export const HOY_SIMULADO = '2026-10-10';

// Para probar el escenario con déficit (arrastre negativo de la quincena anterior).
export const ARRASTRE_DEFICIT = -180000;

// Método de pago que usa el modal "Registrar gasto" (no tiene selector todavía).
export const METODO_PAGO_POR_DEFECTO = 'mp-efectivo';

export const CATEGORIAS_MOCK: Categoria[] = [
  {
    id: 'cat-mercado',
    nombre: 'Mercado',
    color: '#22c55e',
    icono: null,
    esta_activo: true,
    orden: 1
  },
  {
    id: 'cat-comida',
    nombre: 'Comida',
    color: '#f97316',
    icono: null,
    esta_activo: true,
    orden: 2
  },
  {
    id: 'cat-transporte',
    nombre: 'Transporte',
    color: '#3b82f6',
    icono: null,
    esta_activo: true,
    orden: 3
  },
  {
    id: 'cat-hogar',
    nombre: 'Hogar',
    color: '#8b5cf6',
    icono: null,
    esta_activo: true,
    orden: 4
  },
  {
    id: 'cat-salud',
    nombre: 'Salud',
    color: '#dc2626',
    icono: null,
    esta_activo: true,
    orden: 5
  },
  {
    id: 'cat-ocio',
    nombre: 'Ocio',
    color: '#eab308',
    icono: null,
    esta_activo: true,
    orden: 6
  },
  {
    id: 'cat-otros',
    nombre: 'Otros',
    color: '#7a7974',
    icono: null,
    esta_activo: true,
    orden: 7
  }
];

export const METODOS_PAGO_MOCK: MetodoPago[] = [
  {
    id: 'mp-efectivo',
    nombre: 'Efectivo',
    requiere_tarjeta: false,
    esta_activo: true
  },
  {
    id: 'mp-debito',
    nombre: 'Tarjeta débito',
    requiere_tarjeta: false,
    esta_activo: true
  },
  {
    id: 'mp-credito',
    nombre: 'Tarjeta crédito',
    requiere_tarjeta: true,
    esta_activo: true
  },
  {
    id: 'mp-transferencia',
    nombre: 'Transferencia',
    requiere_tarjeta: false,
    esta_activo: true
  }
];

export const PERIODO_ACTUAL_MOCK: Periodo = {
  id: '2026-10-a',
  etiqueta: 'Quincena del 1 al 15 de octubre',
  fecha_inicio: '2026-10-01',
  fecha_fin: '2026-10-15',
  ingreso_base: 1850000,
  arrastre: 120000,
  esta_cerrado: false
};

export const PAGOS_PROXIMOS_MOCK: PagoProximo[] = [
  {
    id: 'pf-arriendo',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-hogar',
    nombre: 'Arriendo',
    monto: 950000,
    fecha_vencimiento: '2026-10-01',
    estado: 'paid',
    es_recurrente: true,
    intervalo_recurrencia: 'monthly'
  },
  {
    id: 'pf-internet',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-hogar',
    nombre: 'Internet hogar',
    monto: 89900,
    fecha_vencimiento: '2026-10-12',
    estado: 'pending',
    es_recurrente: true,
    intervalo_recurrencia: 'monthly'
  },
  {
    id: 'pf-celular',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-otros',
    nombre: 'Plan celular',
    monto: 55000,
    fecha_vencimiento: '2026-10-14',
    estado: 'pending',
    es_recurrente: true,
    intervalo_recurrencia: 'monthly'
  },
  {
    id: 'pf-tarjeta',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-otros',
    nombre: 'Cuota tarjeta',
    monto: 180000,
    fecha_vencimiento: '2026-10-15',
    estado: 'pending',
    es_recurrente: true,
    intervalo_recurrencia: 'monthly'
  }
];

export const MOVIMIENTOS_MOCK: Movimiento[] = [
  {
    id: 'm1',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-mercado',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 18400,
    descripcion: 'Tienda de barrio',
    nota: null,
    fecha: '2026-10-10',
    creado_en: '2026-10-10T18:40:00'
  },
  {
    id: 'm2',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-transporte',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 10000,
    descripcion: 'Taxi',
    nota: null,
    fecha: '2026-10-10',
    creado_en: '2026-10-10T08:15:00'
  },
  {
    id: 'm3',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-comida',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 42500,
    descripcion: 'Domicilio almuerzo',
    nota: null,
    fecha: '2026-10-09',
    creado_en: '2026-10-09T13:05:00'
  },
  {
    id: 'm4',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-comida',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 4500,
    descripcion: 'Café',
    nota: null,
    fecha: '2026-10-09',
    creado_en: '2026-10-09T09:30:00'
  },
  {
    id: 'm5',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-transporte',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 22000,
    descripcion: 'Recarga transporte',
    nota: null,
    fecha: '2026-10-07',
    creado_en: '2026-10-07T07:20:00'
  },
  {
    id: 'm6',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-salud',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 19000,
    descripcion: 'Farmacia',
    nota: null,
    fecha: '2026-10-06',
    creado_en: '2026-10-06T19:45:00'
  },
  {
    id: 'm7',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-mercado',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 12000,
    descripcion: 'Pan y leche',
    nota: null,
    fecha: '2026-10-06',
    creado_en: '2026-10-06T07:10:00'
  },
  {
    id: 'm8',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-mercado',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 68000,
    descripcion: 'Mercado quincenal',
    nota: null,
    fecha: '2026-10-05',
    creado_en: '2026-10-05T11:30:00'
  },
  {
    id: 'm9',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-transporte',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 16000,
    descripcion: 'Taxi',
    nota: null,
    fecha: '2026-10-05',
    creado_en: '2026-10-05T12:40:00'
  },
  {
    id: 'm10',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-ocio',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 15000,
    descripcion: 'Helado',
    nota: null,
    fecha: '2026-10-04',
    creado_en: '2026-10-04T16:15:00'
  },
  {
    id: 'm11',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-ocio',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 38000,
    descripcion: 'Cine',
    nota: null,
    fecha: '2026-10-03',
    creado_en: '2026-10-03T20:00:00'
  },
  {
    id: 'm12',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-comida',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 24000,
    descripcion: 'Cena',
    nota: null,
    fecha: '2026-10-03',
    creado_en: '2026-10-03T21:50:00'
  },
  {
    id: 'm13',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-transporte',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 22000,
    descripcion: 'Recarga transporte',
    nota: null,
    fecha: '2026-10-02',
    creado_en: '2026-10-02T07:05:00'
  },
  {
    id: 'm14',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-comida',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 6000,
    descripcion: 'Café',
    nota: null,
    fecha: '2026-10-02',
    creado_en: '2026-10-02T15:20:00'
  },
  {
    id: 'm15',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-hogar',
    metodo_pago_id: 'mp-transferencia',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 950000,
    descripcion: 'Arriendo',
    nota: null,
    fecha: '2026-10-01',
    creado_en: '2026-10-01T08:00:00'
  },
  {
    id: 'm16',
    periodo_id: '2026-10-a',
    categoria_id: 'cat-hogar',
    metodo_pago_id: 'mp-efectivo',
    tarjeta_id: null,
    tipo: 'expense',
    monto: 45000,
    descripcion: 'Útiles de aseo',
    nota: null,
    fecha: '2026-10-01',
    creado_en: '2026-10-01T17:30:00'
  }
];

// Quincenas cerradas: datos agregados de solo lectura para la navegación de periodos.
export const QUINCENAS_CERRADAS_MOCK: QuincenaCerrada[] = [
  {
    id: '2026-09-b',
    titulo: 'Quincena del 16 al 30 de septiembre',
    diaInicio: 16,
    mes: 'sep',
    ingreso: 1850000,
    arrastreEntrada: 40000,
    gastoDiario: [
      62000,
      38000,
      121000,
      24000,
      45000,
      0,
      88000,
      52000,
      31000,
      47000,
      96000,
      28000,
      73000,
      41000,
      87000
    ],
    pagosFijos: [
      {
        nombre: 'Servicios públicos',
        fecha: 'domingo 20 de septiembre',
        monto: 168000
      },
      {
        nombre: 'Aporte a ahorro',
        fecha: 'martes 22 de septiembre',
        monto: 500000
      },
      {
        nombre: 'Cuota tarjeta',
        fecha: 'miércoles 30 de septiembre',
        monto: 269000
      }
    ],
    ultimosMovimientos: [
      {
        descripcion: 'Mercado quincenal',
        categoria: 'Mercado',
        fecha: '30 sep',
        monto: 87000
      },
      {
        descripcion: 'Cine',
        categoria: 'Ocio',
        fecha: '29 sep',
        monto: 41000
      },
      {
        descripcion: 'Domicilio cena',
        categoria: 'Comida',
        fecha: '28 sep',
        monto: 38500
      },
      {
        descripcion: 'Gasolina',
        categoria: 'Transporte',
        fecha: '27 sep',
        monto: 60000
      },
      {
        descripcion: 'Farmacia',
        categoria: 'Salud',
        fecha: '26 sep',
        monto: 28000
      }
    ]
  },
  {
    id: '2026-09-a',
    titulo: 'Quincena del 1 al 15 de septiembre',
    diaInicio: 1,
    mes: 'sep',
    ingreso: 1850000,
    arrastreEntrada: -60000,
    gastoDiario: [
      41000,
      55000,
      38000,
      72000,
      0,
      46000,
      33000,
      51000,
      64000,
      29000,
      47000,
      39000,
      58100,
      44000,
      38000
    ],
    pagosFijos: [
      {
        nombre: 'Arriendo',
        fecha: 'martes 1 de septiembre',
        monto: 950000
      },
      {
        nombre: 'Internet hogar',
        fecha: 'sábado 12 de septiembre',
        monto: 89900
      },
      {
        nombre: 'Plan celular',
        fecha: 'lunes 14 de septiembre',
        monto: 55000
      }
    ],
    ultimosMovimientos: [
      {
        descripcion: 'Mercado quincenal',
        categoria: 'Mercado',
        fecha: '15 sep',
        monto: 38000
      },
      {
        descripcion: 'Taxi',
        categoria: 'Transporte',
        fecha: '14 sep',
        monto: 22000
      },
      {
        descripcion: 'Almuerzo',
        categoria: 'Comida',
        fecha: '13 sep',
        monto: 25100
      },
      {
        descripcion: 'Droguería',
        categoria: 'Salud',
        fecha: '13 sep',
        monto: 18000
      },
      {
        descripcion: 'Café',
        categoria: 'Comida',
        fecha: '12 sep',
        monto: 6500
      }
    ]
  }
];
