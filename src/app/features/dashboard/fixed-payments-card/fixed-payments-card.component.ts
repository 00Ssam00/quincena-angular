import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { VistaQuincena } from '../../../core/models/quincena.model';

@Component({
  selector: 'app-fixed-payments-card',
  standalone: false,
  templateUrl: './fixed-payments-card.component.html',
  styleUrl: './fixed-payments-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FixedPaymentsCardComponent {
  vista = input.required<VistaQuincena>();
}
