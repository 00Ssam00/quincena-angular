import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastData {
  mensaje: string;
  accionTexto?: string;
  accion?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly estado = new BehaviorSubject<ToastData | null>(null);
  readonly toast$ = this.estado.asObservable();

  private temporizador: ReturnType<typeof setTimeout> | null = null;

  mostrar(toast: ToastData): void {
    this.cancelarTemporizador();
    this.estado.next({ ...toast });
    this.temporizador = setTimeout(() => this.ocultar(), 5000);
  }

  ocultar(): void {
    this.cancelarTemporizador();
    this.estado.next(null);
  }

  private cancelarTemporizador(): void {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
      this.temporizador = null;
    }
  }
}
