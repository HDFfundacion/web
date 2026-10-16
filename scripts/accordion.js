/**
 * Accordion Component (FAQ)
 * Fundación Huellas del Futuro
 */

export function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');

    header?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other items for a clean single-open accordion feel
      accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          const otherBody = otherItem.querySelector('.accordion-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      if (!isOpen) {
        item.classList.add('is-open');
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        item.classList.remove('is-open');
        body.style.maxHeight = null;
      }
    });
  });
}
