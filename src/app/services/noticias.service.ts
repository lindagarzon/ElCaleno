import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Noticia } from '../models/noticia.model';

/** Claves de localStorage (las mismas de la Entrega 2 para mantener compatibilidad). */
const STORAGE_KEY_NEWS = 'elcaleno_noticias';
const JSON_PATH = 'data/noticias.json';

/**
 * Servicio central de noticias.
 * - Carga el catálogo desde localStorage o, la primera vez, desde el JSON local.
 * - Expone el catálogo como una "signal" para que todos los componentes
 *   se actualicen automáticamente cuando se crea o elimina una noticia (mini CRUD).
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private http = inject(HttpClient);

  /** Estado interno: lista de noticias. */
  private readonly _noticias = signal<Noticia[]>([]);
  /** Indica si los datos se están cargando (para mostrar skeletons). */
  readonly cargando = signal(true);

  /** Lista pública de solo lectura. */
  readonly noticias = this._noticias.asReadonly();

  /** Noticias ordenadas de la más reciente a la más antigua. */
  readonly recientes = computed(() =>
    [...this._noticias()].sort((a, b) => b.fecha.localeCompare(a.fecha))
  );

  /** Noticias marcadas como destacadas (o las 3 más recientes si no hay suficientes). */
  readonly destacadas = computed(() => {
    const d = this.recientes().filter(n => n.destacada);
    return (d.length >= 3 ? d : this.recientes()).slice(0, 3);
  });

  constructor() {
    this.cargar();
  }

  /** Carga inicial: localStorage primero; si no existe, se lee el JSON. */
  async cargar(): Promise<void> {
    this.cargando.set(true);
    const guardadas = this.leerStorage();
    if (guardadas) {
      this._noticias.set(guardadas);
    } else {
      await this.cargarDesdeJson();
    }
    this.cargando.set(false);
  }

  /** Lee el archivo JSON con HttpClient y lo guarda en localStorage. */
  private async cargarDesdeJson(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<Noticia[]>(JSON_PATH));
      this._noticias.set(data);
      this.persistir();
    } catch (e) {
      console.error('Error cargando noticias:', e);
      this._noticias.set([]);
    }
  }

  /** Busca una noticia por id. */
  obtenerPorId(id: number): Noticia | undefined {
    return this._noticias().find(n => n.id === id);
  }

  /** CREATE: agrega una noticia al inicio del catálogo. */
  crear(datos: Omit<Noticia, 'id' | 'fecha' | 'destacada' | 'tags'>): Noticia {
    const nueva: Noticia = {
      ...datos,
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      destacada: false,
      tags: [datos.categoria.toLowerCase()],
    };
    this._noticias.update(lista => [nueva, ...lista]);
    this.persistir();
    return nueva;
  }

  /** DELETE: elimina una noticia por id. */
  eliminar(id: number): void {
    this._noticias.update(lista => lista.filter(n => n.id !== id));
    this.persistir();
  }

  /** Restablece el catálogo original del JSON. */
  async restablecer(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY_NEWS);
    this.cargando.set(true);
    await this.cargarDesdeJson();
    this.cargando.set(false);
  }

  private persistir(): void {
    try {
      localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(this._noticias()));
    } catch (e) {
      console.warn('No se pudo guardar en localStorage', e);
    }
  }

  private leerStorage(): Noticia[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_NEWS);
      const data = raw ? JSON.parse(raw) : null;
      return Array.isArray(data) && data.length ? data : null;
    } catch {
      return null;
    }
  }
}
