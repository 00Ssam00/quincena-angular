// Formatos de fecha en español armados a mano (así no dependen de la versión del ICU del navegador).
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function mayuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function partes(iso: string): { anio: number; mes: number; dia: number } {
  const [anio, mes, dia] = iso.split('-').map(Number);
  return { anio, mes, dia };
}

export function nombreMes(iso: string): string {
  return MESES[partes(iso).mes - 1];
}

export function abreviaturaMes(iso: string): string {
  return nombreMes(iso).slice(0, 3);
}

// "2026-10-12" -> "lunes 12 de octubre"
export function fechaLarga(iso: string): string {
  const { anio, mes, dia } = partes(iso);
  const nombreDia = DIAS[new Date(anio, mes - 1, dia).getDay()];
  return `${nombreDia} ${dia} de ${MESES[mes - 1]}`;
}

// Fecha ISO de un día del mes de una quincena: ("2026-10-01", 10) -> "2026-10-10"
export function fechaDelDia(inicioIso: string, dia: number): string {
  const { anio, mes } = partes(inicioIso);
  return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

// Hora actual como "6:40 p. m."
export function horaActual(ahora: Date = new Date()): string {
  return new Intl.DateTimeFormat('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true })
    .format(ahora)
    .replace(/ | /g, ' ')
    .toLowerCase();
}

// Quita tildes y pasa a minúsculas, para buscar sin distinguirlas.
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
