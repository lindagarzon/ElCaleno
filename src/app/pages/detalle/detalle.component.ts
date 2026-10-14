import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NoticiasService } from '../../services/noticias.service';
import { FavoritosService } from '../../services/favoritos.service';
import { ToastService } from '../../services/toast.service';
import { claseCategoria, imagenRespaldo } from '../../models/noticia.model';
import { FechaLargaPipe } from '../../pipes/fecha-larga.pipe';

/**
 * Vista de detalle de una noticia.
 * El parámetro :id de la ruta llega directamente como input del componente
 * gracias a withComponentInputBinding() (ver app.config.ts).
 */
@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [RouterLink, FormsModule, FechaLargaPipe],
  templateUrl: './detalle.component.html',
})
export class DetalleComponent {
  private srv = inject(NoticiasService);
  private favs = inject(FavoritosService);
  private toast = inject(ToastService);
  private router = inject(Router);

  /** Parámetro de ruta /noticia/:id */
  id = input<string>();

  cargando = this.srv.cargando;
  noticia = computed(() => this.srv.obtenerPorId(Number(this.id())));
  parrafos = computed(() => (this.noticia()?.contenido ?? '').split(/\n+/).filter(p => p.trim()));
  esFavorito = computed(() => this.favs.ids().includes(Number(this.id())));
  catClass = computed(() => claseCategoria(this.noticia()?.categoria ?? ''));

  /** Otras noticias para la barra lateral (misma categoría primero). */
  otras = computed(() => {
    const actual = this.noticia();
    return this.srv.recientes()
      .filter(n => n.id !== actual?.id)
      .sort((a, b) => Number(b.categoria === actual?.categoria) - Number(a.categoria === actual?.categoria))
      .slice(0, 4);
  });

  emailNewsletter = signal('');

  toggleFavorito(): void {
    const n = this.noticia();
    if (n) this.favs.toggle(n.id);
  }

  volver(): void { this.router.navigate(['/noticias']); }

  compartirRed(red: 'facebook' | 'twitter' | 'whatsapp'): void {
    const url = encodeURIComponent(window.location.href);
    const titulo = encodeURIComponent(this.noticia()?.titulo ?? 'El Caleño');
    const redes = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${titulo}`,
      whatsapp: `https://api.whatsapp.com/send?text=${titulo}%20${url}`,
    };
    window.open(redes[red], '_blank', 'width=600,height=400');
  }

  async compartir(): Promise<void> {
    const n = this.noticia();
    if (navigator.share && n) {
      try { await navigator.share({ title: n.titulo, text: n.descripcion, url: window.location.href }); } catch {}
    } else {
      this.copiarEnlace();
    }
  }

  copiarEnlace(): void {
    navigator.clipboard?.writeText(window.location.href)
      .then(() => this.toast.mostrar('🔗 Enlace copiado al portapapeles', 'success'))
      .catch(() => this.toast.mostrar('No se pudo copiar el enlace', 'error'));
  }

  suscribirNewsletter(): void {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(this.emailNewsletter().trim())) {
      this.toast.mostrar('⚠️ Ingresa un correo válido', 'warning');
      return;
    }
    this.toast.mostrar('✅ ¡Suscripción exitosa! Gracias por unirte.', 'success');
    this.emailNewsletter.set('');
  }

  respaldo(evento: Event, cat: string): void {
    (evento.target as HTMLImageElement).src = imagenRespaldo(cat);
  }
}
