import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoticiasService } from '../../services/noticias.service';
import { FavoritosService } from '../../services/favoritos.service';
import { NewsCardComponent } from '../../shared/news-card/news-card.component';
import { CATEGORIAS } from '../../models/noticia.model';

/** Lista personalizada de noticias guardadas en localStorage. */
@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [RouterLink, NewsCardComponent],
  templateUrl: './favoritos.component.html',
})
export class FavoritosComponent {
  private srv = inject(NoticiasService);
  private favs = inject(FavoritosService);

  categorias = CATEGORIAS;
  cargando = this.srv.cargando;

  /** Cruza los IDs guardados con el catálogo actual. */
  favoritas = computed(() => {
    const ids = this.favs.ids();
    return this.srv.noticias().filter(n => ids.includes(n.id));
  });

  limpiarTodo(): void {
    if (this.favoritas().length && confirm('¿Eliminar todas las noticias de favoritos?')) {
      this.favs.limpiar();
    }
  }

  descripciones: Record<string, string> = {
    'Tecnología': 'Innovación, startups y transformación digital en el Valle del Cauca.',
    'Turismo': 'Descubre los mejores destinos y eventos turísticos de la región.',
    'Educación': 'Becas, programas académicos y avances educativos en Cali.',
    'Comercio': 'Economía, exportaciones y negocios del suroccidente colombiano.',
  };
}
