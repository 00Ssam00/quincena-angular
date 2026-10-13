import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { CATEGORIAS, Categoria } from '../../../core/models/categoria';
import { NuevoGasto } from '../../../core/models/movimiento.model';
import { calcularVistaPrevia } from '../../../core/utils/calculos';
import { ChipOpcion } from '../category-chips/category-chips.component';
import { OpcionToggle } from '../segmented-toggle/segmented-toggle.component';

// Componente de presentación: no inyecta servicios de datos. Recibe el contexto por input()
// y devuelve el resultado con output() (guardar / cerrar).
@Component({
  selector: 'app-registrar-gasto-modal',
  standalone: false,
  templateUrl: './registrar-gasto-modal.component.html',
  styleUrl: './registrar-gasto-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'cerrar.emit()' },
})
export class RegistrarGastoModalComponent implements AfterViewInit, OnDestroy {
  saldo = input.required<number>();
  pagosPendientes = input.required<number>();
  diasRestantes = input.required<number>();
  diaHoy = input.required<number>();
  mes = input.required<string>(); // "oct"

  guardar = output<NuevoGasto>();
  cerrar = output<void>();

  protected readonly formulario;
  protected readonly montoTexto = signal('');
  protected readonly intentoEnviar = signal(false);

  protected readonly opcionesCategoria: ChipOpcion[] = CATEGORIAS.map((c) => ({
    valor: c,
    etiqueta: c,
  }));

  protected readonly opcionesFecha = computed<OpcionToggle[]>(() => [
    { valor: 'ayer', etiqueta: `Ayer – ${this.diaHoy() - 1} ${this.mes()}` },
    { valor: 'hoy', etiqueta: `Hoy – ${this.diaHoy()} ${this.mes()}` },
  ]);

  private readonly valores;
  protected readonly vistaPrevia = computed(() => {
    const monto = this.valores()?.monto ?? 0;
    return calcularVistaPrevia(this.saldo(), this.pagosPendientes(), this.diasRestantes(), monto);
  });

  private readonly campoMonto = viewChild.required<ElementRef<HTMLInputElement>>('campoMonto');
  private readonly dialogo = viewChild.required<ElementRef<HTMLElement>>('dialogo');
  private enfocadoAntes: HTMLElement | null = null;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      monto: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
      descripcion: this.fb.nonNullable.control('', Validators.maxLength(40)),
      categoria: this.fb.control<Categoria | null>(null, Validators.required),
      dia: this.fb.nonNullable.control<'ayer' | 'hoy'>('hoy'),
    });
    this.valores = toSignal(this.formulario.valueChanges);
  }

  ngAfterViewInit(): void {
    this.enfocadoAntes = document.activeElement as HTMLElement | null;
    this.campoMonto().nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.enfocadoAntes?.focus?.();
  }

  protected mostrarError(campo: 'monto' | 'categoria'): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && (control.touched || this.intentoEnviar());
  }

  // Solo dígitos, máximo 9, con puntos de miles mientras se escribe.
  protected alEscribirMonto(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    const digitos = campo.value.replace(/\D/g, '').slice(0, 9);
    const texto = digitos.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    campo.value = texto;
    this.montoTexto.set(texto);
    this.formulario.controls.monto.setValue(digitos ? Number(digitos) : null);
    this.formulario.controls.monto.markAsDirty();
  }

  protected elegirCategoria(valor: string): void {
    this.formulario.controls.categoria.setValue(valor as Categoria);
    this.formulario.controls.categoria.markAsTouched();
  }

  protected elegirDia(valor: string): void {
    this.formulario.controls.dia.setValue(valor as 'ayer' | 'hoy');
  }

  protected enviar(): void {
    this.intentoEnviar.set(true);
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const v = this.formulario.getRawValue();
    this.guardar.emit({
      monto: v.monto as number,
      descripcion: v.descripcion,
      categoria: v.categoria as Categoria,
      dia: v.dia,
    });
  }

  protected alClicOverlay(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) this.cerrar.emit();
  }

  // Atrapa el foco dentro del diálogo (sin CDK).
  protected alTeclear(evento: KeyboardEvent): void {
    if (evento.key !== 'Tab') return;
    const enfocables = this.dialogo().nativeElement.querySelectorAll<HTMLElement>(
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
