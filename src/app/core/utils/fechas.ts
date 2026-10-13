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

// Día del mes de una fecha ISO: "2026-10-10" -> 10
export function diaDeFecha(iso: string): number {
  return Number(iso.slice(8, 10));
}

// "2026-10-10" y -1 -> "2026-10-09"
export function sumarDias(iso: string, dias: number): string {
  const { anio, mes, dia } = partes(iso);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia + dias));
  return fecha.toISOString().slice(0, 10);
}

// Cantidad de días de un periodo, contando el primero y el último.
export function diasDelPeriodo(inicio: string, fin: string): number {
  const a = partes(inicio);
  const b = partes(fin);
  const ms = Date.UTC(b.anio, b.mes - 1, b.dia) - Date.UTC(a.anio, a.mes - 1, a.dia);
  return Math.round(ms / 86400000) + 1;
}

// Hora de un timestamp local "2026-10-10T18:40:00" -> "6:40 p. m."
export function horaDeTimestamp(iso: string): string {
  return horaActual(new Date(iso));
}

// Fecha y hora local actual como "yyyy-MM-ddTHH:mm:ss" (sin zona horaria).
export function timestampLocal(ahora: Date = new Date()): string {
  const dos = (n: number) => String(n).padStart(2, '0');
  return (
    `${ahora.getFullYear()}-${dos(ahora.getMonth() + 1)}-${dos(ahora.getDate())}` +
    `T${dos(ahora.getHours())}:${dos(ahora.getMinutes())}:${dos(ahora.getSeconds())}`
  );
}

// Hora actual como "6:40 p. m."
export function horaActual(ahora: Date = new Date()): string {
  return new Intl.DateTimeFormat('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true })
    .format(ahora)
    .replace(/\u202f|\u00a0/g, ' ')
    .toLowerCase();
}

// Quita tildes y pasa a minúsculas, para buscar sin distinguirlas.
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
