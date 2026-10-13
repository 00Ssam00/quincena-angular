import { Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, fromEvent, map, startWith } from 'rxjs';
import { ThemeService, Tema } from '../../core/services/theme.service';
import { ToastService } from '../../core/services/toast.service';
import { ItemNav } from '../sidebar/sidebar.component';

const ANCHO_ESCRITORIO = 1000;

export const ITEMS_NAV: ItemNav[] = [
  { ruta: 'resumen', etiqueta: 'Resumen' },
  { ruta: 'movimientos', etiqueta: 'Movimientos' },
  { ruta: 'categorias', etiqueta: 'Categorías' },
  { ruta: 'metas', etiqueta: 'Metas' },
  { ruta: 'historial', etiqueta: 'Historial' },
  { ruta: 'ajustes', etiqueta: 'Ajustes' },
];

// Contenedor del layout: sabe del tamaño de la ventana, del tema y del toast global.
@Component({
  selector: 'app-shell',
  standalone: false,
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  protected readonly items = ITEMS_NAV;
  protected readonly menuAbierto = signal(false);

  protected readonly esMovil = toSignal(
    fromEvent(window, 'resize').pipe(
      map(() => window.innerWidth < ANCHO_ESCRITORIO),
      startWith(window.innerWidth < ANCHO_ESCRITORIO),
      distinctUntilChanged(),
    ),
    { initialValue: window.innerWidth < ANCHO_ESCRITORIO },
  );

  protected readonly indiceActivo;
  protected readonly tema;
  protected readonly toast;

  private readonly contenido = viewChild<ElementRef<HTMLElement>>('contenido');

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private toastService: ToastService,
  ) {
    this.indiceActivo = toSignal(
      this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((e) => this.indiceDe(e.urlAfterRedirects)),
        startWith(this.indiceDe(this.router.url)),
      ),
      { initialValue: 0 },
    );
    this.tema = toSignal(this.themeService.tema$, { initialValue: 'light' as Tema });
    this.toast = toSignal(this.toastService.toast$, { initialValue: null });

    // Al volver a pantalla ancha, el cajón se cierra solo.
    effect(() => {
      if (!this.esMovil()) this.menuAbierto.set(false);
    });
  }

  protected alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  protected cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  protected cambiarTema(tema: Tema): void {
    this.themeService.establecer(tema);
  }

  protected accionarToast(): void {
    this.toast()?.accion?.();
    this.toastService.ocultar();
  }

  // Cada vez que se activa una página, reinicia la animación de entrada del contenido.
  protected alActivarPagina(): void {
    const el = this.contenido()?.nativeElement;
    if (!el) return;
    el.classList.remove('entrando');
    void el.offsetWidth; // fuerza el reflujo para poder repetir la animación
    el.classList.add('entrando');
  }

  private indiceDe(url: string): number {
    const i = ITEMS_NAV.findIndex((item) => url.split('?')[0].startsWith(`/${item.ruta}`));
    return i < 0 ? 0 : i;
  }
}
