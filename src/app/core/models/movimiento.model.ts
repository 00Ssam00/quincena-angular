// Tabla transactions del esquema. El día y la hora NO se guardan: se calculan desde
// `fecha` y `creado_en` con el pipe diaHora (SharedModule).
export interface Movimiento {
  id: string;
  periodo_id: string;
  categoria_id: string;
  metodo_pago_id: string;
  tarjeta_id: string | null;
  tipo: 'income' | 'expense';
  monto: number;
  descripcion: string;
  nota: string | null;
  fecha: string; // yyyy-MM-dd
  creado_en: string; // yyyy-MM-ddTHH:mm:ss (created_at)
}

// Datos que envía el formulario al servicio (el servicio completa el resto).
export interface MovimientoDto {
  categoria_id: string;
  monto: number;
  descripcion: string; // el formulario ya la completa con el nombre de la categoría si queda vacía
  fecha: string;
}
