import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoticiasService } from '../../services/noticias.service';
import { FavoritosService } from '../../services/favoritos.service';
import { ToastService } from '../../services/toast.service';
import { CATEGORIAS, Categoria, claseCategoria, imagenRespaldo } from '../../models/noticia.model';
import { FechaLargaPipe } from '../../pipes/fecha-larga.pipe';

/** Modelo del formulario de redacción (enlazado con [(ngModel)]). */
interface FormNoticia {
  titulo: string; categoria: Categoria | ''; autor: string;
  imagen: string; descripcion: string; contenido: string;
}

/**
 * Panel de Redacción — Mini CRUD (crear y eliminar noticias).
 * Usa formularios por plantilla (template-driven) con two-way binding.
 */
@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [FormsModule, RouterLink, FechaLargaPipe],
  templateUrl: './crud.component.html',
})
export class CrudComponent {
  private srv = inject(NoticiasService);
  private favs = inject(FavoritosService);
  private toast = inject(ToastService);

  categorias = CATEGORIAS;
  cargando = this.srv.cargando;
  busqueda = signal('');
  previewOk = signal(false);

  modelo: FormNoticia = this.vacio();

  /** Lista filtrada por el buscador interno. */
  lista = computed(() => {
    const t = this.busqueda().toLowerCase().trim();
    return this.srv.noticias().filter(n => !t || n.titulo.toLowerCase().includes(t));
  });
  total = computed(() => this.srv.noticias().length);

  private vacio(): FormNoticia {
    return { titulo: '', categoria: '', autor: '', imagen: '', descripcion: '', contenido: '' };
  }

  /** CREATE */
  publicar(f: NgForm): void {
    if (f.invalid || !this.modelo.categoria) {
      f.control.markAllAsTouched();
      this.toast.mostrar('⚠️ Completa todos los campos obligatorios', 'warning');
      return;
    }
    const cat = this.modelo.categoria as Categoria;
    this.srv.crear({
      titulo: this.modelo.titulo.trim(),
      categoria: cat,
      autor: this.modelo.autor.trim(),
      descripcion: this.modelo.descripcion.trim(),
      contenido: this.modelo.contenido.trim(),
      imagen: this.modelo.imagen.trim() || imagenRespaldo(cat),
    });
    this.limpiar(f);
    this.toast.mostrar('✅ Noticia creada correctamente', 'success');
  }

  /** DELETE */
  eliminar(id: number, titulo: string): void {
    if (!confirm(`¿Eliminar la noticia "${titulo}"?`)) return;
    this.srv.eliminar(id);
    this.favs.quitar(id);
    this.toast.mostrar('🗑️ Noticia eliminada correctamente', 'info');
  }

  async restablecer(): Promise<void> {
    if (!confirm('¿Restablecer el catálogo original? Se perderán las noticias creadas.')) return;
    await this.srv.restablecer();
    this.toast.mostrar('🔄 Catálogo restablecido', 'success');
  }

  limpiar(f: NgForm): void {
    this.modelo = this.vacio();
    f.resetForm(this.modelo);
    this.previewOk.set(false);
  }

  claseCat(c: string): string { return claseCategoria(c); }
  respaldo(e: Event, cat: string): void { (e.target as HTMLImageElement).src = imagenRespaldo(cat); }
}
