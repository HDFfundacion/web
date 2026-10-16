/**
 * Fundación Huellas del Futuro (HDF) - Portal Web Oficial (fundacionhdf.org)
 * Main Unified Scripts Bundle (Zero-dependency, Vanilla JS, Works both via file:// and http://)
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Toast Notifications System
     ========================================================================== */
  function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /* ==========================================================================
     2. Theme Switcher (Dark / Light Mode)
     ========================================================================== */
  function initTheme() {
    const toggleBtn = document.getElementById('themeToggleBtn');
    if (!toggleBtn) return;

    const savedTheme = localStorage.getItem('hdf-theme') || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    applyTheme(savedTheme);

    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      try {
        localStorage.setItem('hdf-theme', newTheme);
      } catch (e) {
        /* ignore localStorage quota/privacy exception */
      }
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggleBtn = document.getElementById('themeToggleBtn');
    if (!toggleBtn) return;

    const sunIcon = toggleBtn.querySelector('.icon-sun');
    const moonIcon = toggleBtn.querySelector('.icon-moon');

    if (theme === 'dark') {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
      toggleBtn.setAttribute('aria-label', 'Cambiar a modo claro');
    } else {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
      toggleBtn.setAttribute('aria-label', 'Cambiar a modo oscuro');
    }
  }

  /* ==========================================================================
     3. Navigation & Scrollspy
     ========================================================================== */
  function initNavigation() {
    const header = document.getElementById('siteHeader');
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky header detection
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header?.classList.add('is-scrolled');
      } else {
        header?.classList.remove('is-scrolled');
      }
    }, { passive: true });

    // Mobile menu toggle
    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', isOpen);
      });

      // Close menu when clicking links
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('is-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
          navMenu.classList.remove('is-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Scrollspy navigation
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');
        const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink?.classList.add('is-active');
        } else {
          targetLink?.classList.remove('is-active');
        }
      });
    }, { passive: true });
  }

  /* ==========================================================================
     4. Scroll Reveal Animations & Number Counters
     ========================================================================== */
  function initAnimations() {
    // Reveal on scroll
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

      reveals.forEach(el => revealObserver.observe(el));
    } else {
      reveals.forEach(el => el.classList.add('is-revealed'));
    }

    // Animated number counters
    const counterElements = document.querySelectorAll('[data-counter-target]');
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      counterElements.forEach(counter => counterObserver.observe(counter));
    } else {
      counterElements.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-counter-target'), 10);
        counter.textContent = target.toLocaleString('es-CO');
      });
    }
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter-target'), 10);
    const duration = 1600;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(target * (1 - (1 - progress) * (1 - progress)));
      el.textContent = current.toLocaleString('es-CO');

      if (frame === totalFrames) {
        clearInterval(timer);
        el.textContent = target.toLocaleString('es-CO');
      }
    }, frameRate);
  }

  /* ==========================================================================
     5. Tabs Component (Agro Showcase & Modals)
     ========================================================================== */
  function initTabs() {
    const tabGroups = document.querySelectorAll('[data-tabs-group]');

    tabGroups.forEach(group => {
      const tabButtons = group.querySelectorAll('.tab-btn');
      const tabPanels = group.querySelectorAll('.tab-panel');

      tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = btn.getAttribute('data-tab-target');

          tabButtons.forEach(b => b.classList.remove('is-active'));
          tabPanels.forEach(p => p.classList.remove('is-active'));

          btn.classList.add('is-active');
          const targetPanel = group.querySelector(`#${targetId}`);
          if (targetPanel) {
            targetPanel.classList.add('is-active');
          }
        });
      });
    });
  }

  /* ==========================================================================
     6. Accordion Component (FAQ)
     ========================================================================== */
  function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      const body = item.querySelector('.accordion-body');

      header?.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close other items
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

  /* ==========================================================================
     7. Gallery Filter & Fullscreen Lightbox
     ========================================================================== */
  function initGallery() {
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

    // Filtering
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

    // Open Lightbox
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

    document.addEventListener('keydown', (e) => {
      if (!lightbox?.classList.contains('is-active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }

  /* ==========================================================================
     8. Modals & Clipboard Copying
     ========================================================================== */
  function initModals() {
    const modalTriggers = document.querySelectorAll('[data-open-modal]');
    const modalCloses = document.querySelectorAll('[data-close-modal]');
    const allModals = document.querySelectorAll('.modal-overlay');

    modalTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetModalId = btn.getAttribute('data-open-modal');
        const targetModal = document.getElementById(targetModalId);
        if (targetModal) {
          targetModal.classList.add('is-active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    modalCloses.forEach(btn => {
      btn.addEventListener('click', () => {
        allModals.forEach(modal => modal.classList.remove('is-active'));
        document.body.style.overflow = '';
      });
    });

    allModals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('is-active');
          document.body.style.overflow = '';
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        allModals.forEach(modal => modal.classList.remove('is-active'));
        document.body.style.overflow = '';
      }
    });

    // Copy to clipboard
    const copyButtons = document.querySelectorAll('[data-copy-text]');
    copyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.getAttribute('data-copy-text');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            showToast(`¡Copiado al portapapeles: ${textToCopy}!`);
          }).catch(() => {
            fallbackCopy(textToCopy);
          });
        } else {
          fallbackCopy(textToCopy);
        }
      });
    });
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`¡Copiado al portapapeles: ${text}!`);
    } catch (err) {
      showToast('No se pudo copiar automáticamente', 'error');
    }
    document.body.removeChild(textArea);
  }

  /* ==========================================================================
     9. Interactive Donation Impact Calculator
     ========================================================================== */
  function initCalculator() {
    const chips = document.querySelectorAll('.amount-chip');
    const outcomeText = document.getElementById('impactOutcomeText');
    const customInput = document.getElementById('customAmountInput');
    const donateModalAmount = document.getElementById('modalDonationAmount');

    const impacts = {
      '30000': 'Aporta materiales pedagógicos y lúdicos para 1 niño en los programas de Miranda, Cauca.',
      '50000': 'Financia 1 taller de formación comunitaria y aprovechamiento del tiempo libre.',
      '100000': 'Cubre 1 jornada de asistencia técnica agronómica en campo para una familia campesina.',
      '250000': 'Impulsa insumos orgánicos y adecuación de vivero para parcelas de Cacao y Cítricos.',
      '500000': 'Apoya el encadenamiento productivo y certificación exportadora para asociaciones campesinas.'
    };

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');

        const amount = chip.getAttribute('data-amount');
        if (customInput) customInput.value = '';

        updateImpact(amount);
      });
    });

    if (customInput) {
      customInput.addEventListener('input', () => {
        chips.forEach(c => c.classList.remove('is-selected'));
        const val = parseInt(customInput.value.replace(/\D/g, ''), 10) || 0;
        updateCustomImpact(val);
      });
    }

    function updateImpact(val) {
      if (outcomeText && impacts[val]) {
        outcomeText.innerHTML = `<strong>Impacto tangible:</strong> ${impacts[val]}`;
      }
      if (donateModalAmount) {
        const num = parseInt(val, 10);
        donateModalAmount.textContent = `$${num.toLocaleString('es-CO')} COP`;
      }
    }

    function updateCustomImpact(num) {
      let msg = 'Cada aporte siembra futuro en el campo colombiano y fortalece a nuestras comunidades.';
      if (num >= 500000) {
        msg = impacts['500000'];
      } else if (num >= 250000) {
        msg = impacts['250000'];
      } else if (num >= 100000) {
        msg = impacts['100000'];
      } else if (num >= 50000) {
        msg = impacts['50000'];
      } else if (num >= 30000) {
        msg = impacts['30000'];
      }

      if (outcomeText) {
        outcomeText.innerHTML = `<strong>Impacto tangible:</strong> ${msg}`;
      }
      if (donateModalAmount) {
        donateModalAmount.textContent = num > 0 ? `$${num.toLocaleString('es-CO')} COP` : 'Aporte voluntario';
      }
    }
  }

  /* ==========================================================================
     10. Contact & Newsletter Forms
     ========================================================================== */
  function initForms() {
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

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Enviando mensaje...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          contactForm.reset();
          showToast('¡Mensaje enviado con éxito! Nos comunicaremos a la brevedad.');

          const encodedText = encodeURIComponent(
            `Hola Fundación Huellas del Futuro, mi nombre es ${name}. Asunto: ${subject}. Mensaje: ${message}`
          );
          const confirmWa = confirm('¿Deseas enviar también este mensaje por WhatsApp a nuestro equipo oficial?');
          if (confirmWa) {
            window.open(`https://wa.me/573215663104?text=${encodedText}`, '_blank');
          }
        }, 800);
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

  /* ==========================================================================
     Initialization
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initAnimations();
    initTabs();
    initAccordion();
    initGallery();
    initModals();
    initCalculator();
    initForms();

    console.log('🌱 Fundación Huellas del Futuro (HDF) - Portal web inicializado.');
  });
})();
