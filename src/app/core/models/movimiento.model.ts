import { Categoria } from './categoria';

export interface Movimiento {
  id: string;
  dia: number; // día del mes dentro de la quincena
  descripcion: string;
  categoria: Categoria;
  hora: string; // "6:40 p. m." o "Pago fijo"
  monto: number;
  pagoFijoId?: string; // presente si el movimiento es un pago fijo ya pagado
}

// Lo que produce el modal (al registrar o al editar un gasto).
export interface NuevoGasto {
  monto: number;
  descripcion: string; // puede venir vacía: se usa el nombre de la categoría
  categoria: Categoria;
  dia: number; // día del mes
}
