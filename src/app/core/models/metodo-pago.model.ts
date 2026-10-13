// Tabla payment_methods del esquema.
export interface MetodoPago {
  id: string;
  nombre: string;
  requiere_tarjeta: boolean;
  esta_activo: boolean;
}
