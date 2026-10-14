# El Caleño - Plataforma web de noticias(Angular)

Periódico digital del Valle del Cauca desarrollado para el módulo **Front End** del Politécnico Grancolombiano (Entrega 3 — Entrega final).
Es la migración a **Angular 19** del prototipo en HTML, CSS y JavaScript de la Entrega 2.

- **Repositorio:** `https://github.com/lindagarzon/ElCaleno-Angular` *(actualizar)*
- **Aplicación desplegada:** `https://lindagarzon.github.io/ElCaleno-Angular/` *(actualizar)*

## Funcionalidades

| Página | Ruta | Qué hace |
|---|---|---|
| Inicio | `#/` | Bienvenida, estadísticas, noticias destacadas, últimas noticias con filtro, testimonios y llamados a la acción |
| Noticias | `#/noticias` | Catálogo en tarjetas con búsqueda, filtro por categoría y ordenamiento |
| Detalle | `#/noticia/:id` | Información completa, imagen, favoritos, compartir y newsletter |
| Favoritos | `#/favoritos` | Lista personalizada guardada en `localStorage` |
| Contacto | `#/contacto` | Formulario reactivo con validaciones y mensaje de confirmación |
| Redacción | `#/redaccion` | Mini CRUD: crear y eliminar noticias |

## Estructura

```
src/
├── index.html
├── main.ts                     # Arranque de la aplicación
├── styles.css                  # Sistema de diseño global (variables CSS, responsive)
└── app/
    ├── app.component.ts        # Raíz: header + router-outlet + footer
    ├── app.config.ts           # Router (hash), HttpClient
    ├── app.routes.ts           # Rutas de las 6 páginas
    ├── models/noticia.model.ts # Interfaz Noticia y utilidades
    ├── services/
    │   ├── noticias.service.ts # Carga JSON + localStorage, crear/eliminar
    │   ├── favoritos.service.ts
    │   └── toast.service.ts
    ├── pipes/fecha-larga.pipe.ts
    ├── shared/                 # Componentes reutilizables
    │   ├── header/  footer/  news-card/  toast/
    └── pages/                  # Un componente por página
        ├── home/ noticias/ detalle/ favoritos/ contacto/ crud/
public/
├── data/noticias.json          # Catálogo inicial (12 noticias)
└── img/                        # Imágenes de respaldo por categoría
```

## Ejecutar en local

Requisitos: Node.js 20 o superior.

```bash
npm install
npm start            # http://localhost:4200
npm run build        # genera dist/elcaleno-angular/browser
```

## Despliegue

**GitHub Pages (automático):** el flujo `.github/workflows/deploy.yml` compila y publica en cada `push` a `main`.
En GitHub: *Settings → Pages → Source: GitHub Actions*.

**Netlify (manual):** ejecutar `npm run build` y arrastrar la carpeta `dist/elcaleno-angular/browser` a https://app.netlify.com/drop.

La aplicación usa rutas con `#` y `<base href="./">`, por lo que funciona en cualquier subcarpeta sin configuración adicional.

## Tecnologías

Angular 19 (componentes standalone, signals, control flow `@if/@for`), TypeScript, RxJS, HttpClient, Reactive Forms y Template-driven Forms, CSS3, Web Storage API, Font Awesome 6 y Google Fonts (Playfair Display, Lato) empaquetadas localmente.

---
Linda Estefany Garzón Collazos · Politécnico Grancolombiano · 2026
