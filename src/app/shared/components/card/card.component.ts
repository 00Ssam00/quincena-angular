import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: false,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.grande]': 'grande()' },
})
export class CardComponent {
  // La tarjeta de saldo usa un relleno un poco mayor.
  grande = input(false);
}
