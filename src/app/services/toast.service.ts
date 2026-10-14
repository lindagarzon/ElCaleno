import { Injectable, signal } from '@angular/core';

export type TipoToast = 'success' | 'warning' | 'error' | 'info';
export interface Toast { id: number; mensaje: string; tipo: TipoToast; }

/** Servicio de notificaciones emergentes (toasts). */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  mostrar(mensaje: string, tipo: TipoToast = 'info', duracion = 3000): void {
    const toast: Toast = { id: Date.now() + Math.random(), mensaje, tipo };
    this.toasts.update(t => [...t, toast]);
    setTimeout(() => this.cerrar(toast.id), duracion);
  }

  cerrar(id: number): void {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}
