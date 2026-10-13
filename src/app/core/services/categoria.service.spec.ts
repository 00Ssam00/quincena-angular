import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CategoriaService } from './categoria.service';

describe('CategoriaService (forma REST)', () => {
  let servicio: CategoriaService;

  beforeEach(() => {
    servicio = TestBed.inject(CategoriaService);
  });

  it('getAll devuelve las 7 categorías del mock con campos del esquema', async () => {
    const lista = await firstValueFrom(servicio.getAll());
    expect(lista.length).toBe(7);
    expect(lista[0]).toEqual(
      jasmineLike({ id: 'cat-mercado', nombre: 'Mercado', esta_activo: true, orden: 1 }),
    );
  });

  it('create agrega la categoría al final sin mutar la lista anterior', async () => {
    const antes = await firstValueFrom(servicio.getAll());
    const nueva = await firstValueFrom(servicio.create({ nombre: ' Mascotas ', color: '#db2777' }));
    const despues = await firstValueFrom(servicio.getAll());

    expect(nueva.nombre).toBe('Mascotas'); // se recorta el espacio sobrante
    expect(nueva.orden).toBe(8);
    expect(despues.length).toBe(antes.length + 1);
    expect(antes.length).toBe(7);
  });

  it('create rechaza un nombre repetido sin distinguir mayúsculas', async () => {
    await expect(
      firstValueFrom(servicio.create({ nombre: 'mercado', color: '#000000' })),
    ).rejects.toThrow('Ya existe');
  });

  it('getById encuentra o falla', async () => {
    expect((await firstValueFrom(servicio.getById('cat-ocio'))).nombre).toBe('Ocio');
    await expect(firstValueFrom(servicio.getById('nada'))).rejects.toThrow('no existe');
  });

  it('delete no permite borrar una categoría con movimientos', async () => {
    await expect(firstValueFrom(servicio.delete('cat-mercado'))).rejects.toThrow('movimientos');
    await firstValueFrom(servicio.delete('cat-otros')); // "Otros" no tiene movimientos
    const lista = await firstValueFrom(servicio.getAll());
    expect(lista.some((c) => c.id === 'cat-otros')).toBe(false);
  });
});

// Comprueba solo los campos indicados (el objeto real trae más).
function jasmineLike(parcial: Record<string, unknown>) {
  return expect.objectContaining(parcial);
}
