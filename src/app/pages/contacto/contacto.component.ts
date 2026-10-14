import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';

/**
 * Página de contacto con formulario reactivo (ReactiveFormsModule).
 * Reemplaza las validaciones manuales con regex de la Entrega 2 por
 * los validadores integrados de Angular, conservando las mismas reglas.
 */
@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contacto.component.html',
})
export class ContactoComponent {
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  enviado = signal(false);
  enviando = signal(false);

  /** Definición del formulario y sus reglas de validación. */
  form = this.fb.nonNullable.group({
    nombre:   ['', [Validators.required, Validators.minLength(3)]],
    email:    ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
    telefono: ['', [Validators.pattern(/^(\+?[0-9\s\-]{7,15})?$/)]],
    tipo:     ['', Validators.required],
    asunto:   ['', [Validators.required, Validators.minLength(5)]],
    mensaje:  ['', [Validators.required, Validators.minLength(20)]],
    terminos: [false, Validators.requiredTrue],
  });

  /** Mensajes de error por campo. */
  private mensajes: Record<string, string> = {
    nombre: 'El nombre debe tener al menos 3 caracteres.',
    email: 'Ingresa un correo electrónico válido.',
    telefono: 'Ingresa un número de teléfono válido.',
    tipo: 'Selecciona el tipo de mensaje.',
    asunto: 'El asunto debe tener al menos 5 caracteres.',
    mensaje: 'El mensaje debe tener al menos 20 caracteres.',
    terminos: 'Debes aceptar los términos y condiciones.',
  };

  control(nombre: string): AbstractControl { return this.form.get(nombre)!; }

  /** Un campo muestra error si es inválido y el usuario ya lo tocó. */
  invalido(nombre: string): boolean {
    const c = this.control(nombre);
    return c.invalid && (c.touched || c.dirty);
  }
  valido(nombre: string): boolean {
    const c = this.control(nombre);
    return c.valid && (c.touched || c.dirty) && !!c.value;
  }
  error(nombre: string): string { return this.mensajes[nombre]; }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.mostrar('⚠️ Revisa los campos marcados en rojo', 'warning');
      return;
    }
    // Simulación de envío (no hay backend en esta fase)
    this.enviando.set(true);
    setTimeout(() => {
      this.enviando.set(false);
      this.enviado.set(true);
      this.toast.mostrar('✅ Mensaje enviado correctamente', 'success');
      this.form.reset();
      setTimeout(() => this.enviado.set(false), 6000);
    }, 900);
  }

  faqs = [
    { p: '¿Cómo puedo enviar una noticia para publicación?', r: 'Puedes usar este formulario seleccionando "Enviar una noticia" o ir directamente a la sección de Redacción y publicarla en la plataforma.' },
    { p: '¿Cuánto tiempo tardan en responder?', r: 'Respondemos todos los mensajes en un plazo máximo de 24 horas hábiles. Para asuntos urgentes puedes llamarnos al +57 (602) 880-5000.' },
    { p: '¿Puedo pautar publicidad en El Caleño?', r: 'Sí. Escríbenos a publicidad@elcaleno.co o usa este formulario seleccionando "Publicidad".' },
    { p: '¿Cómo funciona la sección de favoritos?', r: 'Al tocar el corazón de una noticia, esta se guarda en tu navegador con localStorage. No necesitas crear cuenta y la lista persiste entre visitas en el mismo dispositivo.' },
  ];
}
