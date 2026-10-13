import { Categoria } from './categoria';

export interface PagoFijo {
  id: string;
  nombre: string;
  categoria: Categoria;
  fecha: string; // yyyy-MM-dd
  monto: number;
  pagado: boolean;
}
