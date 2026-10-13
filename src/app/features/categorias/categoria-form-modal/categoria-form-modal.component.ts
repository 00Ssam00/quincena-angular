import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { CategoriaDto } from '../../../core/models/categoria.model';

// Colores sugeridos para elegir con un clic (sin escribir códigos hexadecimales).
export const PALETA_COLORES = [
  '#22c55e', '#f97316', '#3b82f6', '#8b5cf6',
  '#dc2626', '#eab308', '#0d9488', '#db2777',
];

// Componente de presentación: recibe los nombres existentes para validar duplicados al instante
// y devuelve la categoría nueva con output().
@Component({
  selector: 'app-categoria-form-modal',
  standalone: false,
  templateUrl: './categoria-form-modal.component.html',
  styleUrl: './categoria-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'cerrar.emit()' },
})
export class CategoriaFormModalComponent implements AfterViewInit, OnDestroy {
  nombresExistentes = input<string[]>([]);
  guardando = input(false);

  guardar = output<CategoriaDto>();
  cerrar = output<void>();

  protected readonly colores = PALETA_COLORES;
  protected readonly intentoEnviar = signal(false);

  protected readonly formulario;

  private readonly campoNombre = viewChild.required<ElementRef<HTMLInputElement>>('campoNombre');
  private enfocadoAntes: HTMLElement | null = null;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      nombre: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        (control: AbstractControl): ValidationErrors | null => this.validarDuplicado(control),
      ]),
      color: this.fb.nonNullable.control(PALETA_COLORES[0], Validators.required),
    });
  }

  ngAfterViewInit(): void {
    this.enfocadoAntes = document.activeElement as HTMLElement | null;
    this.campoNombre().nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.enfocadoAntes?.focus?.();
  }

  protected mostrarError(): boolean {
    const control = this.formulario.controls.nombre;
    return control.invalid && (control.touched || this.intentoEnviar());
  }

  protected mensajeError(): string {
    const errores = this.formulario.controls.nombre.errors;
    if (errores?.['required']) return 'El nombre es obligatorio.';
    if (errores?.['minlength']) return 'Escribe al menos 2 caracteres.';
    if (errores?.['maxlength']) return 'Máximo 30 caracteres.';
    if (errores?.['duplicado']) return 'Ya existe una categoría con ese nombre.';
    return '';
  }

  protected elegirColor(color: string): void {
    this.formulario.controls.color.setValue(color);
  }

  protected enviar(): void {
    this.intentoEnviar.set(true);
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const v = this.formulario.getRawValue();
    this.guardar.emit({ nombre: v.nombre.trim(), color: v.color });
  }

  protected alClicOverlay(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) this.cerrar.emit();
  }

  private validarDuplicado(control: AbstractControl): ValidationErrors | null {
    const valor = String(control.value ?? '').trim().toLowerCase();
    if (!valor) return null;
    return this.nombresExistentes().some((n) => n.toLowerCase() === valor)
      ? { duplicado: true }
      : null;
  }
}
