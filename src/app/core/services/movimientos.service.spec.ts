import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { MovimientoDto } from '../models/movimiento.model';
import { MovimientosService } from './movimientos.service';

const gasto: MovimientoDto = {
  categoria_id: 'cat-comida',
  monto: 25000,
  descripcion: 'Almuerzo',
  fecha: '2026-10-10',
};

describe('MovimientosService (forma REST)', () => {
  let servicio: MovimientosService;

  beforeEach(() => {
    servicio = TestBed.inject(MovimientosService);
  });

  it('getAll devuelve una copia de los movimientos', async () => {
    const lista = await firstValueFrom(servicio.getAll());
    expect(lista.length).toBe(16);
    expect(lista[0].categoria_id).toBeDefined();
    expect(lista[0].fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('getById encuentra un movimiento y falla si no existe', async () => {
    expect((await firstValueFrom(servicio.getById('m2'))).descripcion).toBe('Taxi');
    await expect(firstValueFrom(servicio.getById('nada'))).rejects.toThrow('no existe');
  });

  it('create agrega al inicio sin mutar la lista anterior', async () => {
    const antes = await firstValueFrom(servicio.getAll());
    const nuevo = await firstValueFrom(servicio.create(gasto));
    const despues = await firstValueFrom(servicio.getAll());

    expect(nuevo.tipo).toBe('expense');
    expect(nuevo.creado_en).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    expect(despues[0].id).toBe(nuevo.id);
    expect(despues.length).toBe(antes.length + 1);
    expect(antes.length).toBe(16);
  });

  it('update cambia solo el movimiento indicado y conserva creado_en', async () => {
    const antes = await firstValueFrom(servicio.getAll());
    const original = antes.find((m) => m.id === 'm2')!;
    const editado = await firstValueFrom(servicio.update('m2', { ...gasto, monto: 12000 }));
    const despues = await firstValueFrom(servicio.getAll());

    expect(editado.monto).toBe(12000);
    expect(editado.creado_en).toBe(original.creado_en);
    expect(antes.find((m) => m.id === 'm2')?.monto).toBe(10000); // la copia anterior no cambió
    expect(despues.length).toBe(antes.length);
  });

  it('delete quita el movimiento y falla si no existe', async () => {
    await firstValueFrom(servicio.delete('m3'));
    const lista = await firstValueFrom(servicio.getAll());
    expect(lista.some((m) => m.id === 'm3')).toBe(false);
    await expect(firstValueFrom(servicio.delete('nada'))).rejects.toThrow('no existe');
  });

  it('getAll falla cuando se simula un error', async () => {
    servicio.setSimularError(true);
    await expect(firstValueFrom(servicio.getAll())).rejects.toThrow('Error de conexión');
  });
});
