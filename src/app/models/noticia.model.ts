/**
 * Modelo de datos de una noticia.
 * Refleja la estructura de cada objeto en public/data/noticias.json.
 */
export interface Noticia {
  id: number;
  categoria: Categoria;
  titulo: string;
  descripcion: string;
  contenido: string;
  imagen: string;
  imagenDetalle?: string;
  autor: string;
  fecha: string;        // Formato ISO AAAA-MM-DD
  destacada: boolean;
  tags: string[];
}

/** Categorías editoriales permitidas en El Caleño. */
export type Categoria = 'Tecnología' | 'Turismo' | 'Educación' | 'Comercio';

export const CATEGORIAS: { nombre: Categoria; icono: string }[] = [
  { nombre: 'Tecnología', icono: 'fa-microchip' },
  { nombre: 'Turismo',    icono: 'fa-map-marked-alt' },
  { nombre: 'Educación',  icono: 'fa-graduation-cap' },
  { nombre: 'Comercio',   icono: 'fa-store' },
];

/** Devuelve la clase CSS asociada a una categoría (color del badge). */
export function claseCategoria(cat: string): string {
  const mapa: Record<string, string> = {
    'Tecnología': 'cat-tecnologia', 'Turismo': 'cat-turismo',
    'Educación': 'cat-educacion',   'Comercio': 'cat-comercio',
  };
  return mapa[cat] ?? 'cat-tecnologia';
}

/** Imagen local de respaldo cuando la imagen remota no carga. */
export function imagenRespaldo(cat: string): string {
  const mapa: Record<string, string> = {
    'Tecnología': 'tecnologia', 'Turismo': 'turismo',
    'Educación': 'educacion',   'Comercio': 'comercio',
  };
  return `img/${mapa[cat] ?? 'default'}.svg`;
}
