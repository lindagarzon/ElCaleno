import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoticiasService } from '../../services/noticias.service';
import { NewsCardComponent } from '../../shared/news-card/news-card.component';
import { CATEGORIAS, claseCategoria, imagenRespaldo, Noticia } from '../../models/noticia.model';

/**
 * Página de inicio (Home): bienvenida, estadísticas, noticias destacadas,
 * últimas noticias con filtro por categoría, testimonios y llamados a la acción.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NewsCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private srv = inject(NoticiasService);

  cargando = this.srv.cargando;
  destacadas = this.srv.destacadas;
  categorias = CATEGORIAS;

  /** Categoría seleccionada en las píldoras ('' = todas). */
  categoriaActiva = signal<string>('');

  /** Últimas 6 noticias filtradas por la categoría activa. */
  ultimas = computed(() => {
    const cat = this.categoriaActiva();
    return this.srv.recientes().filter(n => !cat || n.categoria === cat).slice(0, 6);
  });

  /** Estadísticas del hero calculadas a partir de los datos. */
  stats = computed(() => {
    const lista = this.srv.noticias();
    return [
      { num: lista.length, label: 'Noticias publicadas' },
      { num: CATEGORIAS.length, label: 'Categorías' },
      { num: new Set(lista.map(n => n.autor)).size, label: 'Periodistas' },
      { num: '100%', label: 'Noticias locales' },
    ];
  });

  testimonios = [
    { texto: 'El Caleño es mi fuente favorita para conocer lo que pasa en mi ciudad. Las noticias son siempre relevantes, bien escritas y con perspectiva local.',
      nombre: 'Laura Martínez', cargo: 'Docente universitaria · Cali', ini: 'LM', estrellas: 5 },
    { texto: 'Me encanta la sección de tecnología. Siempre encuentro noticias sobre el ecosistema emprendedor de Cali que no veo en ningún otro medio.',
      nombre: 'Juan Pablo Ríos', cargo: 'Emprendedor digital · Cali', ini: 'JP', estrellas: 5 },
    { texto: 'Como turista que visita Cali regularmente, El Caleño me ha ayudado a descubrir lugares increíbles. Las notas de turismo son muy completas.',
      nombre: 'Sandra Morales', cargo: 'Consultora de viajes · Bogotá', ini: 'SM', estrellas: 4 },
  ];

  seleccionarCategoria(cat: string): void { this.categoriaActiva.set(cat); }
  claseCat(cat: string): string { return claseCategoria(cat); }
  respaldo(evento: Event, n: Noticia): void {
    (evento.target as HTMLImageElement).src = imagenRespaldo(n.categoria);
  }
}
