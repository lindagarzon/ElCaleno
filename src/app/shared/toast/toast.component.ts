import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

/** Contenedor de notificaciones emergentes (esquina inferior derecha). */
@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container" aria-live="polite">
      @for (t of toastSrv.toasts(); track t.id) {
        <div class="toast" [class]="'toast toast-' + t.tipo" (click)="toastSrv.cerrar(t.id)">
          {{ t.mensaje }}
        </div>
      }
    </div>`,
})
export class ToastComponent {
  toastSrv = inject(ToastService);
}
