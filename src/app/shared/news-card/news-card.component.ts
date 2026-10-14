import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia, claseCategoria, imagenRespaldo } from '../../models/noticia.model';
import { FavoritosService } from '../../services/favoritos.service';
import { FechaLargaPipe, InicialesPipe } from '../../pipes/fecha-larga.pipe';

/**
 * Componente reutilizable de tarjeta de noticia.
 * Es la evolución de la función crearCard() de la Entrega 2:
 * recibe la noticia por @Input (input signal) y la pinta con data binding.
 */
@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [RouterLink, FechaLargaPipe, InicialesPipe],
  templateUrl: './news-card.component.html',
})
export class NewsCardComponent {
  private favs = inject(FavoritosService);

  /** Noticia a mostrar (obligatoria). */
  noticia = input.required<Noticia>();

  catClass = computed(() => claseCategoria(this.noticia().categoria));
  esFavorito = computed(() => this.favs.ids().includes(this.noticia().id));

  toggleFavorito(evento: Event): void {
    evento.preventDefault();
    evento.stopPropagation();
    this.favs.toggle(this.noticia().id);
  }

  /** Si la imagen remota falla, se usa una imagen local por categoría. */
  onErrorImagen(evento: Event): void {
    const img = evento.target as HTMLImageElement;
    const respaldo = imagenRespaldo(this.noticia().categoria);
    if (!img.src.endsWith(respaldo)) img.src = respaldo;
  }
}
