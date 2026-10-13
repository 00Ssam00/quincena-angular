import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { MovimientosService } from './movimientos.service';

describe('MovimientosService', () => {
  let servicio: MovimientosService;

  beforeEach(() => {
    servicio = TestBed.inject(MovimientosService);
  });

  it('registrarGasto agrega el movimiento al inicio sin mutar la lista anterior', async () => {
    const antes = await firstValueFrom(servicio.getMovimientos());
    const nuevo = await firstValueFrom(
      servicio.registrarGasto({ monto: 25000, descripcion: '', categoria: 'Comida', dia: 'hoy' }),
    );
    const despues = await firstValueFrom(servicio.getMovimientos());

    expect(nuevo.descripcion).toBe('Comida'); // sin descripción usa la categoría
    expect(despues[0].id).toBe(nuevo.id);
    expect(despues.length).toBe(antes.length + 1);
    expect(antes.length).toBe(16);
  });

  it('deshacerGasto revierte el estado', async () => {
    const nuevo = await firstValueFrom(
      servicio.registrarGasto({ monto: 1000, descripcion: 'Prueba', categoria: 'Otros', dia: 'ayer' }),
    );
    expect(nuevo.dia).toBe(9);
    await firstValueFrom(servicio.deshacerGasto(nuevo.id));
    const lista = await firstValueFrom(servicio.getMovimientos());
    expect(lista.some((m) => m.id === nuevo.id)).toBe(false);
  });

  it('getMovimientos falla cuando se simula un error', async () => {
    servicio.setSimularError(true);
    await expect(firstValueFrom(servicio.getMovimientos())).rejects.toThrow('Error de conexión');
  });
});
