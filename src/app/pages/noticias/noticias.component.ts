import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NoticiasService } from '../../services/noticias.service';
import { NewsCardComponent } from '../../shared/news-card/news-card.component';
import { CATEGORIAS } from '../../models/noticia.model';

type Orden = 'reciente' | 'antiguo' | 'az';

/**
 * Listado de noticias con búsqueda, filtro por categoría y ordenamiento.
 * Usa two-way binding [(ngModel)] en los controles del filtro.
 */
@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [FormsModule, RouterLink, NewsCardComponent],
  templateUrl: './noticias.component.html',
})
export class NoticiasComponent {
  private srv = inject(NoticiasService);
  private route = inject(ActivatedRoute);

  categorias = CATEGORIAS;
  cargando = this.srv.cargando;

  // Estado de los filtros (signals enlazadas con ngModel)
  termino = signal('');
  categoria = signal('');
  orden = signal<Orden>('reciente');

  constructor() {
    // Permite llegar filtrado desde el footer: #/noticias?cat=Turismo
    this.route.queryParamMap.subscribe(p => this.categoria.set(p.get('cat') ?? ''));
  }

  /** Equivalente a aplicarFiltros() de la Entrega 2, ahora como computed. */
  filtradas = computed(() => {
    const t = this.termino().toLowerCase().trim();
    const cat = this.categoria();
    const lista = this.srv.noticias().filter(n =>
      (!cat || n.categoria === cat) &&
      (!t || n.titulo.toLowerCase().includes(t) ||
             n.descripcion.toLowerCase().includes(t) ||
             n.autor.toLowerCase().includes(t))
    );
    switch (this.orden()) {
      case 'antiguo': return lista.sort((a, b) => a.fecha.localeCompare(b.fecha));
      case 'az':      return lista.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'));
      default:        return lista.sort((a, b) => b.fecha.localeCompare(a.fecha));
    }
  });

  limpiarFiltros(): void {
    this.termino.set(''); this.categoria.set(''); this.orden.set('reciente');
  }
}
