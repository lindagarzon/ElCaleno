import { Injectable, computed, inject, signal } from '@angular/core';
import { ToastService } from './toast.service';

const STORAGE_KEY_FAV = 'elcaleno_favoritos';

/**
 * Servicio de favoritos.
 * Guarda únicamente los IDs de las noticias en localStorage y expone
 * un contador reactivo que el header muestra en el menú.
 */
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private toast = inject(ToastService);

  private readonly _ids = signal<number[]>(this.leer());
  readonly ids = this._ids.asReadonly();
  readonly total = computed(() => this._ids().length);

  esFavorito(id: number): boolean {
    return this._ids().includes(id);
  }

  /** Agrega o quita una noticia de favoritos. Devuelve true si quedó agregada. */
  toggle(id: number): boolean {
    const agregar = !this.esFavorito(id);
    this._ids.update(ids => agregar ? [...ids, id] : ids.filter(x => x !== id));
    this.guardar();
    this.toast.mostrar(
      agregar ? '❤️ Noticia agregada a favoritos' : '💔 Noticia eliminada de favoritos',
      agregar ? 'success' : 'info'
    );
    return agregar;
  }

  /** Quita un id sin notificación (cuando se elimina una noticia del catálogo). */
  quitar(id: number): void {
    this._ids.update(ids => ids.filter(x => x !== id));
    this.guardar();
  }

  limpiar(): void {
    this._ids.set([]);
    this.guardar();
    this.toast.mostrar('🗑️ Se eliminaron todos los favoritos', 'info');
  }

  private guardar(): void {
    try { localStorage.setItem(STORAGE_KEY_FAV, JSON.stringify(this._ids())); } catch {}
  }

  private leer(): number[] {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_FAV) || '[]'); }
    catch { return []; }
  }
}
