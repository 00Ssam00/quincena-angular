import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ToastData } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  toast = input<ToastData | null>(null);
  accionar = output<void>();
}
