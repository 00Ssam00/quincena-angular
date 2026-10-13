import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { CATEGORIAS, Categoria } from '../../../core/models/categoria';
import { Movimiento, NuevoGasto } from '../../../core/models/movimiento.model';
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
export class RegistrarGastoModalComponent implements OnInit, AfterViewInit, OnDestroy {
  saldo = input.required<number>();
  pagosPendientes = input.required<number>();
  diasRestantes = input.required<number>();
  diaHoy = input.required<number>();
  mes = input.required<string>(); // "oct"
  // null = registrar uno nuevo; con valor = editar ese movimiento (misma pantalla, mismo formulario)
  movimiento = input<Movimiento | null>(null);

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

  // Bandera nuevo / edición, y textos que dependen de ella.
  protected readonly esNuevo = computed(() => this.movimiento() === null);
  protected readonly titulo = computed(() => (this.esNuevo() ? 'Registrar gasto' : 'Editar gasto'));
  protected readonly textoBoton = computed(() => (this.esNuevo() ? 'Registrar gasto' : 'Guardar cambios'));

  // Solo se puede mover entre Ayer y Hoy; un movimiento de otro día conserva su fecha.
  protected readonly fechaEditable = computed(() => {
    const m = this.movimiento();
    return !m || m.dia === this.diaHoy() || m.dia === this.diaHoy() - 1;
  });

  private readonly valores;
  protected readonly vistaPrevia = computed(() => {
    const monto = this.valores()?.monto ?? 0;
    // Al editar, el saldo ya descontó el monto anterior: se devuelve antes de calcular.
    const saldoBase = this.saldo() + (this.movimiento()?.monto ?? 0);
    return calcularVistaPrevia(saldoBase, this.pagosPendientes(), this.diasRestantes(), monto);
  });

  private readonly campoMonto = viewChild.required<ElementRef<HTMLInputElement>>('campoMonto');
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

  ngOnInit(): void {
    const m = this.movimiento();
    if (!m) return;
    // El formulario se llena con una COPIA de los valores: el movimiento original no se toca.
    this.formulario.setValue({
      monto: m.monto,
      descripcion: m.descripcion,
      categoria: m.categoria,
      dia: m.dia === this.diaHoy() - 1 ? 'ayer' : 'hoy',
    });
    this.montoTexto.set(String(m.monto).replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
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
      dia: this.diaElegido(v.dia),
    });
  }

  protected alClicOverlay(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) this.cerrar.emit();
  }

  private diaElegido(opcion: 'ayer' | 'hoy'): number {
    if (!this.fechaEditable()) return this.movimiento()!.dia;
    return opcion === 'hoy' ? this.diaHoy() : this.diaHoy() - 1;
  }
}
