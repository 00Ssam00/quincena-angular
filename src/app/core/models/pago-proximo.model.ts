// Tabla upcoming_payments del esquema. En la interfaz se muestran como "pagos fijos".
export interface PagoProximo {
  id: string;
  periodo_id: string | null;
  categoria_id: string;
  nombre: string;
  monto: number;
  fecha_vencimiento: string; // yyyy-MM-dd
  estado: 'pending' | 'paid' | 'overdue';
  es_recurrente: boolean;
  intervalo_recurrencia: 'weekly' | 'biweekly' | 'monthly' | null;
}
