/**
 * Scroll Animations & Number Counters
 * Fundación Huellas del Futuro
 */

export function initAnimations() {
  // 1. Reveal on scroll
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // 2. Animated Number Counters
  const counterElements = document.querySelectorAll('[data-counter-target]');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-counter-target'), 10);
  const duration = 1800; // ms
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;

  const timer = setInterval(() => {
    frame++;
    // Ease out quad
    const progress = frame / totalFrames;
    const current = Math.round(target * (1 - (1 - progress) * (1 - progress)));
    el.textContent = current.toLocaleString('es-CO');

    if (frame === totalFrames) {
      clearInterval(timer);
      el.textContent = target.toLocaleString('es-CO');
    }
  }, frameRate);
}
