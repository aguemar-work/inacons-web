/*
  main.js — INACONS v4.0
  ─────────────────────────────────────────────────────────────────
  · Sin Lucide UMD (iconos SVG inline en HTML)
  · Animaciones scroll: IntersectionObserver (data-aos)
  · Menú móvil + acordeón Operaciones, Swiper si existe
  · Cargado con defer
*/

document.addEventListener('DOMContentLoaded', function () {

  /* ─── 1. ANIMACIONES DE SCROLL (reemplaza AOS) ─── */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-aos]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            // Leer duración y delay desde atributos data-aos-*
            const duration = el.getAttribute('data-aos-duration');
            const delay    = el.getAttribute('data-aos-delay');
            if (duration) el.style.setProperty('--aos-duration', duration + 'ms');
            if (delay)    el.style.setProperty('--aos-delay',    delay    + 'ms');
            el.classList.add('aos-animate');
            observer.unobserve(el); // animar una sola vez (equivale a once:true de AOS)
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* ─── 2. TYPEWRITER HERO ─── */
  function initTypewriter() {
    const words = document.querySelectorAll('.word.typewriter');
    if (!words.length) return;

    let idx = 0;

    function typeWord(word, text, cb) {
      word.classList.add('active', 'typing');
      let chars = '';
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          chars += text[i++];
          word.textContent = chars;
        } else {
          clearInterval(interval);
          word.classList.remove('typing');
          word.classList.add('completed');
          if (cb) setTimeout(cb, 300);
        }
      }, 60);
    }

    function next() {
      if (idx >= words.length) return;
      const word = words[idx];
      const text = word.getAttribute('data-text') || '';
      typeWord(word, text, () => { idx++; next(); });
    }

    setTimeout(next, 800);
  }

  /* ─── 3. CONTADORES ANIMADOS ─── */
  function initCounters() {
    const counters = document.querySelectorAll('.indicator-number, [data-counter]');
    if (!counters.length) return;

    let done = false;

    function animateCounter(el) {
      // Soporta data-target (hero) y data-counter (nosotros)
      const target = parseInt(el.getAttribute('data-target') || el.getAttribute('data-counter'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      if (!Number.isFinite(target)) return;
      const duration = 1800;
      let start = null;

      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        // Easing out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    }

    const wrap = document.querySelector('.hero-indicators') || document.querySelector('.about-stat-row');
    if (!wrap) return;

    const obs = new IntersectionObserver((entries) => {
      if (done) return;
      if (entries[0].isIntersecting) {
        done = true;
        counters.forEach((c, i) => setTimeout(() => animateCounter(c), i * 150));
        obs.disconnect();
      }
    }, { threshold: 0.3 });

    obs.observe(wrap);
  }

  /* ─── 4. MENÚ MÓVIL (+ acordeón Operaciones) ─── */
  function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu   = document.getElementById('mobileMenu');
    const close  = document.getElementById('mobileMenuClose');
    if (!toggle || !menu) return;

    function resetDropdowns() {
      menu.querySelectorAll('.mobile-dropdown').forEach((drop) => {
        drop.classList.remove('open');
        drop.querySelector('.mobile-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
    }

    function open() {
      menu.classList.add('active');
      document.body.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      resetDropdowns();
    }

    function shut() {
      menu.classList.remove('active');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      resetDropdowns();
    }

    toggle.addEventListener('click', open);
    close?.addEventListener('click', shut);
    menu.querySelector('.mobile-menu-overlay')?.addEventListener('click', shut);
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', shut));

    menu.querySelectorAll('.mobile-dropdown').forEach((drop) => {
      const btn = drop.querySelector('.mobile-dropdown-toggle');
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = drop.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) shut();
    });
  }

  /* ─── 5. HEADER SCROLL (hide/show + scrolled) ─── */
  function initHeaderScroll() {
    const header = document.getElementById('header');
    const topBar = document.querySelector('.top-bar');
    if (!header) return;

    let lastY = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          // Topbar: solo visible cuando está en el tope
          if (topBar && window.innerWidth >= 768) {
            topBar.classList.toggle('hidden', y > 0);
          }
          // Header: ocultar al bajar, mostrar al subir
          if (y > 80) {
            header.classList.toggle('hidden', y > lastY);
            header.classList.add('scrolled');
          } else {
            header.classList.remove('hidden', 'scrolled');
          }
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─── 6. BACK TO TOP ─── */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── 7. SMOOTH SCROLL para anclas #hash ─── */
  function initSmoothScroll() {
    const header = document.getElementById('header');
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = (header?.offsetHeight ?? 80) + 20;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      });
    });
  }

  /* ─── 8. AJUSTE RESPONSIVE topbar/main ─── */
  function initResponsive() {
    const header = document.getElementById('header');
    const main   = document.querySelector('.main');
    if (!header) return;

    function adjust() {
      const desktop = window.innerWidth >= 768;
      header.classList.toggle('with-topbar', desktop);
      main?.classList.toggle('with-topbar', desktop);
    }

    window.addEventListener('resize', adjust, { passive: true });
    adjust();
  }

  /* ─── 9. CLIENTES CAROUSEL (infinite CSS scroll) ─── */
  function initClientsCarousel() {
    const track = document.querySelector('.clients-track');
    if (!track) return;
    // El CSS ya maneja la animación vía @keyframes clientsScroll.
    // Aquí solo pausamos/reanudamos en hover (touch también).
    const pause  = () => track.style.animationPlayState = 'paused';
    const resume = () => track.style.animationPlayState = 'running';

    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);
    track.addEventListener('touchstart', pause,  { passive: true });
    track.addEventListener('touchend',   () => setTimeout(resume, 500), { passive: true });
  }

  /* ─── INIT ─── */
  initScrollAnimations();
  initTypewriter();
  initCounters();
  initMobileMenu();
  initHeaderScroll();
  initBackToTop();
  initSmoothScroll();
  initResponsive();
  initClientsCarousel();

});

/* ─── SWIPER (info carousel — solo si existe en la página) ─── */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof Swiper === 'undefined') return;

  // Info carousel — home
  const infoEl = document.querySelector('.info-carousel-swiper');
  if (infoEl) {
    new Swiper('.info-carousel-swiper', {
      loop: true,
      speed: 700,
      autoplay: { delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true },
      slidesPerView: 1,
      grabCursor: true,
      pagination: { el: '.swiper-pagination', clickable: true, dynamicBullets: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });
  }
});