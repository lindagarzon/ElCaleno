import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ToastComponent } from './shared/toast/toast.component';

/** Componente raíz: estructura común (header, contenido enrutado, footer). */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent],
  template: `
    <app-header />
    <div class="page-content"><router-outlet /></div>
    <app-footer />
    <app-toast />
    <button class="back-to-top" [class.visible]="mostrarSubir()" (click)="subir()" aria-label="Volver arriba">
      <i class="fas fa-chevron-up"></i>
    </button>`,
})
export class AppComponent {
  mostrarSubir = signal(false);

  /** Muestra el botón "volver arriba" después de 400 px de scroll. */
  @HostListener('window:scroll')
  onScroll(): void { this.mostrarSubir.set(window.scrollY > 400); }

  subir(): void { window.scrollTo({ top: 0, behavior: 'smooth' }); }
}
