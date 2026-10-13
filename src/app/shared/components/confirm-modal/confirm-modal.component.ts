import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';

// Modal de confirmación reutilizable (por ejemplo, antes de eliminar). Presentación pura:
// el padre lo muestra con @if y escucha confirmar / cancelar.
@Component({
  selector: 'app-confirm-modal',
  standalone: false,
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'cancelar.emit()' },
})
export class ConfirmModalComponent implements AfterViewInit, OnDestroy {
  titulo = input('Confirmar acción');
  mensaje = input('¿Seguro que quieres continuar?');
  textoConfirmar = input('Eliminar');
  procesando = input(false);

  confirmar = output<void>();
  cancelar = output<void>();

  private readonly botonCancelar = viewChild.required<ElementRef<HTMLButtonElement>>('botonCancelar');
  private enfocadoAntes: HTMLElement | null = null;

  ngAfterViewInit(): void {
    this.enfocadoAntes = document.activeElement as HTMLElement | null;
    // El foco empieza en "Cancelar": es la opción segura en una acción destructiva.
    this.botonCancelar().nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.enfocadoAntes?.focus?.();
  }

  protected alClicOverlay(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) this.cancelar.emit();
  }
}
