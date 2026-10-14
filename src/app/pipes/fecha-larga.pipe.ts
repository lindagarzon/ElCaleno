import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe personalizado: convierte "2026-09-25" en "25 de septiembre de 2026".
 * Uso en plantilla: {{ noticia.fecha | fechaLarga }}
 */
@Pipe({ name: 'fechaLarga', standalone: true })
export class FechaLargaPipe implements PipeTransform {
  transform(valor: string | null | undefined): string {
    if (!valor) return '';
    const fecha = new Date(valor + 'T00:00:00');
    if (isNaN(fecha.getTime())) return valor;
    return fecha.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}

/** Pipe que devuelve las iniciales de un nombre: "Carlos Arbeláez" → "CA". */
@Pipe({ name: 'iniciales', standalone: true })
export class InicialesPipe implements PipeTransform {
  transform(nombre: string | null | undefined): string {
    return (nombre || '').split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }
}
