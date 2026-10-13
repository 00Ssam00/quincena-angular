import { Directive, ElementRef, HostListener } from '@angular/core';

// Mantiene el foco del teclado dentro de un diálogo: Tab y Shift+Tab dan la vuelta
// entre el primer y el último elemento enfocable (sin usar el CDK).
@Directive({
  selector: '[appFocusTrap]',
  standalone: false,
})
export class FocusTrapDirective {
  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('keydown', ['$event'])
  protected alTeclear(evento: KeyboardEvent): void {
    if (evento.key !== 'Tab') return;
    const enfocables = this.el.nativeElement.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (enfocables.length === 0) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    const activo = document.activeElement;
    if (evento.shiftKey && activo === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && activo === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }
}
