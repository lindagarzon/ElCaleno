# El Caleño Noticias

Proyecto académico de Front End inspirado en la ciudad de Cali. Es un prototipo de periódico digital con publicaciones ficticias sobre educación, tecnología, turismo y comercio.

## Funcionalidades

- Página de inicio con noticias destacadas.
- Catálogo de noticias cargado desde un archivo JSON.
- Búsqueda y filtro por categoría.
- Vista de detalle de cada noticia.
- Favoritos guardados en el navegador.
- Formulario de contacto con validaciones. No envía correos.
- Creación y eliminación de noticias de ejemplo en el navegador.

## Tecnologías

HTML, CSS y JavaScript. El proyecto utiliza `localStorage` para conservar noticias y favoritos; no requiere base de datos ni servidor de aplicaciones.

## Estructura

- `index.html`: página de inicio.
- `noticias.html`: catálogo de noticias.
- `detalle.html`: detalle de una noticia.
- `favoritos.html`: noticias guardadas.
- `contacto.html`: formulario de contacto.
- `gestion.html`: gestión local de noticias.
- `css/`: estilos.
- `js/`: lógica de la aplicación.

## Cómo ejecutarlo

Desde la carpeta del proyecto, inicia un servidor local:

```bash
python -m http.server 8000
