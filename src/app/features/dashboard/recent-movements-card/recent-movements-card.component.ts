import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { VistaQuincena } from '../../../core/models/quincena.model';

@Component({
  selector: 'app-recent-movements-card',
  standalone: false,
  templateUrl: './recent-movements-card.component.html',
  styleUrl: './recent-movements-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentMovementsCardComponent {
  vista = input.required<VistaQuincena>();
  nuevoId = input<string | null>(null); // movimiento recién creado, para resaltarlo
}
