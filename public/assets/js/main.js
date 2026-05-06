/*
  main.js — INACONS v4.0
  ─────────────────────────────────────────────────────────────────
  Cambios respecto a la versión anterior:
  · Eliminado: Lucide UMD (reemplazado por SVG inline en HTML)
  · Eliminado: AOS init (reemplazado por IntersectionObserver nativo)
  · Eliminado: initializeClientsAbout (no existe ese elemento en el HTML)
  · Eliminado: email.js / EmailJS (usar Formspree como el resto del sitio)
  · Mantenido: mobile menu, header scroll, back-to-top, typewriter,
               counter animation, gated brochure, clients carousel
  · Cargado con defer — nunca bloquea el parser HTML
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

  /* ─── 4. MENÚ MÓVIL ─── */
  function initMobileMenu() {
    const toggle  = document.getElementById('menuToggle');
    const menu    = document.getElementById('mobileMenu');
    const close   = document.getElementById('mobileMenuClose');
    if (!toggle || !menu) return;

    function open()  { menu.classList.add('active');    toggle.setAttribute('aria-expanded', 'true'); }
    function shut()  { menu.classList.remove('active'); toggle.setAttribute('aria-expanded', 'false'); }

    toggle.addEventListener('click', open);
    close?.addEventListener('click', shut);
    menu.querySelector('.mobile-menu-overlay')?.addEventListener('click', shut);
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', shut));

    // Cierra con Escape
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') shut(); });
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

    function adjust() {
      const desktop = window.innerWidth >= 768;
      header?.classList.toggle('with-topbar', desktop);
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

  /* ─── 10. GATED BROCHURE MODAL ─── */
  function initGatedBrochure() {
    const BROCHURE_URL = '/assets/documentos/brochure_inacons.pdf';
    const triggers = document.querySelectorAll('a[href$="brochure_inacons.pdf"], [data-brochure-trigger]');
    if (!triggers.length) return;

    // Crear modal solo si hay triggers en la página
    if (!document.getElementById('brochure-modal')) {
      document.body.insertAdjacentHTML('beforeend', `
        <div id="brochure-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;align-items:center;justify-content:center;backdrop-filter:blur(4px);">
          <div style="background:#fff;border-radius:12px;padding:40px;max-width:440px;width:90%;position:relative;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);">
            <button id="brochure-close" style="position:absolute;top:16px;right:16px;background:none;border:none;font-size:24px;cursor:pointer;color:#999;" aria-label="Cerrar">&times;</button>
            <h3 style="margin:0 0 10px;font-size:22px;color:var(--c-primary);">Descarga el Brochure</h3>
            <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.5;">Completa tus datos para recibir nuestro portafolio técnico actualizado.</p>
            <form id="brochure-form" action="https://formspree.io/f/mdapkgog" method="POST">
              <input type="hidden" name="_subject" value="Nueva descarga de Brochure — INACONS" />
              <div style="margin-bottom:12px;">
                <input type="text" name="nombre" placeholder="Nombre completo" required style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:14px;box-sizing:border-box;" />
              </div>
              <div style="margin-bottom:20px;">
                <input type="email" name="email" placeholder="Correo corporativo" required style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:14px;box-sizing:border-box;" />
              </div>
              <button type="submit" id="brochure-submit" style="width:100%;padding:14px;background:#f26500;color:#fff;border:none;border-radius:6px;font-size:15px;cursor:pointer;font-weight:600;">Descargar Ahora</button>
            </form>
            <p id="brochure-success" style="display:none;color:green;text-align:center;margin-top:16px;font-weight:500;">¡Gracias! Tu descarga comenzará en breve.</p>
          </div>
        </div>
      `);
    }

    const modal   = document.getElementById('brochure-modal');
    const form    = document.getElementById('brochure-form');
    const closeBtn = document.getElementById('brochure-close');
    const success  = document.getElementById('brochure-success');
    const submitBtn = document.getElementById('brochure-submit');

    const openModal  = (e) => { e.preventDefault(); modal.style.display = 'flex'; };
    const closeModal = () => { modal.style.display = 'none'; };

    triggers.forEach((t) => t.addEventListener('click', openModal));
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          success.style.display = 'block';
          form.style.display = 'none';
          setTimeout(() => {
            window.open(BROCHURE_URL, '_blank');
            setTimeout(() => {
              closeModal();
              form.style.display = 'block';
              success.style.display = 'none';
              form.reset();
              submitBtn.disabled = false;
              submitBtn.textContent = 'Descargar Ahora';
            }, 500);
          }, 1400);
        }
      } catch {
        alert('Error de conexión. Inténtalo de nuevo.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Descargar Ahora';
      }
    });
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
  initGatedBrochure();

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
