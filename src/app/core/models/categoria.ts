export const CATEGORIAS = ['Mercado', 'Comida', 'Transporte', 'Hogar', 'Salud', 'Ocio', 'Otros'] as const;

export type Categoria = (typeof CATEGORIAS)[number];
