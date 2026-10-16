/**
 * Contact & Newsletter Form Handling
 * Fundación Huellas del Futuro
 */

import { showToast } from './modals.js';

export function initForms() {
  const contactForm = document.getElementById('contactForm');
  const newsletterForm = document.getElementById('newsletterForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('#contactName')?.value.trim();
      const email = contactForm.querySelector('#contactEmail')?.value.trim();
      const phone = contactForm.querySelector('#contactPhone')?.value.trim();
      const subject = contactForm.querySelector('#contactSubject')?.value;
      const message = contactForm.querySelector('#contactMessage')?.value.trim();

      if (!name || !email || !message) {
        showToast('Por favor completa todos los campos requeridos (*)', 'error');
        return;
      }

      // Simulate sending and trigger WhatsApp option
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando mensaje...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast('¡Mensaje enviado con éxito! Nos comunicaremos a la brevedad.');

        // Also offer direct WhatsApp chat
        const encodedText = encodeURIComponent(
          `Hola Fundación Huellas del Futuro, mi nombre es ${name}. Asunto: ${subject}. Mensaje: ${message}`
        );
        const confirmWa = confirm('¿Deseas enviar también este mensaje por WhatsApp a nuestro equipo oficial?');
        if (confirmWa) {
          window.open(`https://wa.me/573215663104?text=${encodedText}`, '_blank');
        }
      }, 900);
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        showToast('¡Gracias por suscribirte a nuestro boletín comunitario!');
        emailInput.value = '';
      }
    });
  }
}
