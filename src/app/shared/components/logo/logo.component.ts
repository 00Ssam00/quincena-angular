import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// Logo de Quincena. Su tamaño sale del font-size del contenedor: el símbolo mide 1em.
@Component({
  selector: 'app-logo',
  standalone: false,
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  variant = input<'full' | 'mark'>('full');
}
