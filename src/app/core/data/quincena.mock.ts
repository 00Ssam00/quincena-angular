import { DatosMock } from '../models/quincena.model';

// Datos simulados (inventados) del handoff de diseño. Los servicios los exponen como Observable.
export const DATOS_MOCK: DatosMock = {
  quincenaActual: {
    id: '2026-10-a',
    titulo: 'Quincena del 1 al 15 de octubre',
    inicio: '2026-10-01',
    fin: '2026-10-15',
    diaActual: 10,
    dias: 15,
    ingreso: 1850000,
    arrastre: {
      tipo: 'sobrante',
      monto: 120000
    },
    escenarioDeficit: {
      tipo: 'deficit',
      monto: 180000
    },
    pagosFijos: [
      {
        id: 'pf-arriendo',
        nombre: 'Arriendo',
        categoria: 'Hogar',
        fecha: '2026-10-01',
        monto: 950000,
        pagado: true
      },
      {
        id: 'pf-internet',
        nombre: 'Internet hogar',
        categoria: 'Hogar',
        fecha: '2026-10-12',
        monto: 89900,
        pagado: false
      },
      {
        id: 'pf-celular',
        nombre: 'Plan celular',
        categoria: 'Otros',
        fecha: '2026-10-14',
        monto: 55000,
        pagado: false
      },
      {
        id: 'pf-tarjeta',
        nombre: 'Cuota tarjeta',
        categoria: 'Otros',
        fecha: '2026-10-15',
        monto: 180000,
        pagado: false
      }
    ]
  },
  movimientos: [
    {
      id: 'm1',
      dia: 10,
      descripcion: 'Tienda de barrio',
      categoria: 'Mercado',
      hora: '6:40 p. m.',
      monto: 18400
    },
    {
      id: 'm2',
      dia: 10,
      descripcion: 'Taxi',
      categoria: 'Transporte',
      hora: '8:15 a. m.',
      monto: 10000
    },
    {
      id: 'm3',
      dia: 9,
      descripcion: 'Domicilio almuerzo',
      categoria: 'Comida',
      hora: '1:05 p. m.',
      monto: 42500
    },
    {
      id: 'm4',
      dia: 9,
      descripcion: 'Café',
      categoria: 'Comida',
      hora: '9:30 a. m.',
      monto: 4500
    },
    {
      id: 'm5',
      dia: 7,
      descripcion: 'Recarga transporte',
      categoria: 'Transporte',
      hora: '7:20 a. m.',
      monto: 22000
    },
    {
      id: 'm6',
      dia: 6,
      descripcion: 'Farmacia',
      categoria: 'Salud',
      hora: '7:45 p. m.',
      monto: 19000
    },
    {
      id: 'm7',
      dia: 6,
      descripcion: 'Pan y leche',
      categoria: 'Mercado',
      hora: '7:10 a. m.',
      monto: 12000
    },
    {
      id: 'm8',
      dia: 5,
      descripcion: 'Mercado quincenal',
      categoria: 'Mercado',
      hora: '11:30 a. m.',
      monto: 68000
    },
    {
      id: 'm9',
      dia: 5,
      descripcion: 'Taxi',
      categoria: 'Transporte',
      hora: '12:40 p. m.',
      monto: 16000
    },
    {
      id: 'm10',
      dia: 4,
      descripcion: 'Helado',
      categoria: 'Ocio',
      hora: '4:15 p. m.',
      monto: 15000
    },
    {
      id: 'm11',
      dia: 3,
      descripcion: 'Cine',
      categoria: 'Ocio',
      hora: '8:00 p. m.',
      monto: 38000
    },
    {
      id: 'm12',
      dia: 3,
      descripcion: 'Cena',
      categoria: 'Comida',
      hora: '9:50 p. m.',
      monto: 24000
    },
    {
      id: 'm13',
      dia: 2,
      descripcion: 'Recarga transporte',
      categoria: 'Transporte',
      hora: '7:05 a. m.',
      monto: 22000
    },
    {
      id: 'm14',
      dia: 2,
      descripcion: 'Café',
      categoria: 'Comida',
      hora: '3:20 p. m.',
      monto: 6000
    },
    {
      id: 'm15',
      dia: 1,
      descripcion: 'Arriendo',
      categoria: 'Hogar',
      hora: 'Pago fijo',
      monto: 950000,
      pagoFijoId: 'pf-arriendo'
    },
    {
      id: 'm16',
      dia: 1,
      descripcion: 'Útiles de aseo',
      categoria: 'Hogar',
      hora: '5:30 p. m.',
      monto: 45000
    }
  ],
  categorias: [
    'Mercado',
    'Comida',
    'Transporte',
    'Hogar',
    'Salud',
    'Ocio',
    'Otros'
  ],
  quincenasCerradas: [
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
  ]
};
