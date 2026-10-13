import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Página de relleno para secciones del menú que todavía no tienen diseño.
@Component({
  selector: 'app-proximamente',
  standalone: false,
  templateUrl: './proximamente.component.html',
  styleUrl: './proximamente.component.scss',
})
export class ProximamenteComponent {
  protected readonly titulo: string;

  constructor(private route: ActivatedRoute) {
    this.titulo = this.route.snapshot.data['titulo'] ?? 'Esta sección';
  }
}
