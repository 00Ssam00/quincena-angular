import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

// Bloque de carga con pulso. Las medidas llegan como inputs porque dependen del contenido final.
@Component({
  selector: 'app-skeleton',
  standalone: false,
  template: '',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.width]': 'anchoCss()',
    '[style.height]': 'altoCss()',
    '[style.border-radius]': 'radioCss()',
    'aria-hidden': 'true',
  },
})
export class SkeletonComponent {
  width = input<number | string>('100%');
  height = input<number | string>(16);
  radius = input<number | string>(8);

  protected readonly anchoCss = computed(() => this.aCss(this.width()));
  protected readonly altoCss = computed(() => this.aCss(this.height()));
  protected readonly radioCss = computed(() => this.aCss(this.radius()));

  private aCss(valor: number | string): string {
    return typeof valor === 'number' ? `${valor}px` : valor;
  }
}
