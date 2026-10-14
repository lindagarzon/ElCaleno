import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

/**
 * Configuración global de la aplicación.
 * - withHashLocation(): URLs tipo /#/noticias, necesarias para que las rutas
 *   funcionen en GitHub Pages / Netlify sin configurar el servidor.
 * - withComponentInputBinding(): los parámetros de ruta llegan como inputs.
 * - withInMemoryScrolling(): al navegar se vuelve al inicio de la página.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation(), withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(),
  ],
};
