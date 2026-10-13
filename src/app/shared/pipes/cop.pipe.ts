import { Pipe, PipeTransform } from '@angular/core';

// 1312400 -> "$1.312.400"   |   -180000 -> "−$180.000" (signo menos U+2212)
@Pipe({ name: 'cop', standalone: false })
export class CopPipe implements PipeTransform {
  transform(valor: number | null | undefined): string {
    const n = Math.round(valor ?? 0);
    const digitos = Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${n < 0 ? '−' : ''}$${digitos}`;
  }
}
