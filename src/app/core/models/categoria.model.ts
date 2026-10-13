// Tabla categories del esquema.
export interface Categoria {
  id: string;
  nombre: string;
  color: string;
  icono: string | null;
  esta_activo: boolean;
  orden: number;
}

// Datos que envía el formulario de categorías.
export interface CategoriaDto {
  nombre: string;
  color: string;
}
