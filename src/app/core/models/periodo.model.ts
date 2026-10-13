// Tabla periods del esquema: una quincena.
export interface Periodo {
  id: string;
  etiqueta: string; // "Quincena del 1 al 15 de octubre"
  fecha_inicio: string; // yyyy-MM-dd
  fecha_fin: string;
  ingreso_base: number;
  arrastre: number; // + sobrante, − déficit de la quincena anterior
  esta_cerrado: boolean;
}
