import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Tema = 'light' | 'dark';

const CLAVE = 'quincena-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly estado: BehaviorSubject<Tema>;
  readonly tema$;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.estado = new BehaviorSubject<Tema>(this.leerInicial());
    this.tema$ = this.estado.asObservable();
    this.aplicar(this.estado.value);
  }

  establecer(tema: Tema): void {
    this.estado.next(tema);
    this.aplicar(tema);
    try {
      localStorage.setItem(CLAVE, tema);
    } catch {
      // Si el almacenamiento no está disponible, el tema simplemente no persiste.
    }
  }

  private aplicar(tema: Tema): void {
    this.document.documentElement.setAttribute('data-theme', tema);
  }

  private leerInicial(): Tema {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado === 'light' || guardado === 'dark') return guardado;
    } catch {
      // sin acceso a localStorage
    }
    const oscuro = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return oscuro ? 'dark' : 'light';
  }
}
