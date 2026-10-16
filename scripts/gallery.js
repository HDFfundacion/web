/**
 * Gallery Filter & Lightbox Viewer
 * Fundación Huellas del Futuro
 */

export function initGallery() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let currentIndex = 0;
  const visibleItems = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');

  // 1. Filtering
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 2. Open Lightbox
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(item);
    });
  });

  function openLightbox(item) {
    if (!lightbox) return;
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-title')?.textContent || '';
    const tag = item.querySelector('.gallery-tag')?.textContent || '';

    const currentVisible = visibleItems();
    currentIndex = currentVisible.indexOf(item);

    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
    if (lightboxCaption) {
      lightboxCaption.innerHTML = `<strong>${tag}</strong> — ${title}`;
    }

    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function showNext() {
    const currentVisible = visibleItems();
    if (currentVisible.length === 0) return;
    currentIndex = (currentIndex + 1) % currentVisible.length;
    openLightbox(currentVisible[currentIndex]);
  }

  function showPrev() {
    const currentVisible = visibleItems();
    if (currentVisible.length === 0) return;
    currentIndex = (currentIndex - 1 + currentVisible.length) % currentVisible.length;
    openLightbox(currentVisible[currentIndex]);
  }

  closeBtn?.addEventListener('click', closeLightbox);
  nextBtn?.addEventListener('click', showNext);
  prevBtn?.addEventListener('click', showPrev);

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}
