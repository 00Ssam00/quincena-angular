import { Pipe, PipeTransform } from '@angular/core';
import { Movimiento } from '../../core/models/movimiento.model';
import { diaDeFecha, horaDeTimestamp } from '../../core/utils/fechas';

// El movimiento guarda solo `fecha` (DATE) y `creado_en` (timestamp), como el esquema.
// Este pipe calcula lo que la pantalla necesita:
//   {{ mov | diaHora: 'dia' }}   ->  10
//   {{ mov | diaHora: 'hora' }}  ->  "6:40 p. m."
@Pipe({ name: 'diaHora', standalone: false })
export class DiaHoraPipe implements PipeTransform {
  transform(movimiento: Pick<Movimiento, 'fecha' | 'creado_en'>, parte: 'dia'): number;
  transform(movimiento: Pick<Movimiento, 'fecha' | 'creado_en'>, parte: 'hora'): string;
  transform(movimiento: Pick<Movimiento, 'fecha' | 'creado_en'>, parte: 'dia' | 'hora'): number | string {
    return parte === 'dia' ? diaDeFecha(movimiento.fecha) : horaDeTimestamp(movimiento.creado_en);
  }
}
