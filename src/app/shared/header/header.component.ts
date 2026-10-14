import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiasService } from '../../services/noticias.service';

/**
 * Componente Header: topbar, logotipo, menú de navegación (6 secciones),
 * contador de favoritos y ticker de titulares.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private favs = inject(FavoritosService);
  private noticiasSrv = inject(NoticiasService);

  /** Contador de favoritos (binding reactivo con el servicio). */
  totalFavoritos = this.favs.total;

  /** Titulares para el ticker animado (se duplican para el bucle continuo). */
  titulares = computed(() => {
    const t = this.noticiasSrv.recientes().slice(0, 8).map(n => n.titulo);
    return [...t, ...t];
  });

  /** Estado del menú hamburguesa en móvil. */
  menuAbierto = signal(false);

  /** Fecha actual en español para la topbar. */
  fechaHoy = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).replace(/^./, c => c.toUpperCase());

  /** Enlaces del menú principal. */
  enlaces = [
    { ruta: '/',          icono: 'fa-home',      texto: 'Inicio',    exacto: true },
    { ruta: '/noticias',  icono: 'fa-newspaper', texto: 'Noticias',  exacto: false },
    { ruta: '/favoritos', icono: 'fa-heart',     texto: 'Favoritos', exacto: false },
    { ruta: '/contacto',  icono: 'fa-envelope',  texto: 'Contacto',  exacto: false },
    { ruta: '/redaccion', icono: 'fa-edit',      texto: 'Redacción', exacto: false },
  ];

  constructor() {
    // Cierra el menú móvil cada vez que cambia la ruta (incluye botón "atrás").
    inject(Router).events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.cerrarMenu());
  }

  alternarMenu(): void { this.menuAbierto.update(v => !v); }
  cerrarMenu(): void { this.menuAbierto.set(false); }
}
