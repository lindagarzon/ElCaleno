import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIAS } from '../../models/noticia.model';

/** Componente Footer: marca, redes, mapa de secciones, categorías y contacto. */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  categorias = CATEGORIAS;
  anio = new Date().getFullYear();
  secciones = [
    { ruta: '/', texto: 'Inicio' },
    { ruta: '/noticias', texto: 'Noticias' },
    { ruta: '/favoritos', texto: 'Favoritos' },
    { ruta: '/contacto', texto: 'Contacto' },
    { ruta: '/redaccion', texto: 'Redacción' },
  ];
  redes = [
    { icono: 'fa-facebook-f', nombre: 'Facebook' },
    { icono: 'fa-x-twitter', nombre: 'Twitter/X' },
    { icono: 'fa-instagram', nombre: 'Instagram' },
    { icono: 'fa-youtube', nombre: 'YouTube' },
    { icono: 'fa-whatsapp', nombre: 'WhatsApp' },
  ];
}
