// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize Lucide icons
  lucide.createIcons();

  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      delay: 0,
    });
  }

  // Typewriter animation for hero text
  function initTypewriterAnimation() {
    const typewriterWords = document.querySelectorAll(".word.typewriter");
    let currentIndex = 0;

    function typeWord(word, text, callback) {
      word.classList.add("active", "typing");
      let currentText = "";
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (charIndex < text.length) {
          currentText += text[charIndex];
          word.textContent = currentText;
          charIndex++;
        } else {
          clearInterval(typeInterval);
          word.classList.remove("typing");
          word.classList.add("completed");

          if (callback) {
            setTimeout(callback, 300);
          }
        }
      }, 60); // 60ms per character (Optimizado para fluidez)
    }

    function typeNextWord() {
      if (currentIndex >= typewriterWords.length) return;

      const word = typewriterWords[currentIndex];
      const text = word.getAttribute("data-text");

      typeWord(word, text, () => {
        currentIndex++;
        if (currentIndex < typewriterWords.length) {
          typeNextWord();
        }
      });
    }

    // Start animation after a short delay
    setTimeout(typeNextWord, 1000);
  }

  // Initialize typewriter animation when page loads
  window.addEventListener("load", initTypewriterAnimation);

  // Counter animation for hero indicators
  function animateCounters() {
    const counters = document.querySelectorAll(".indicator-number");
    let hasAnimated = false;

    function animateCounter(counter) {
      const target = parseInt(counter.getAttribute("data-target"));
      const duration = 2000;
      let startTime = null;

      // Evita mostrar "0" en HTML: si ya viene con el valor final, no animamos.
      const initialRaw = (counter.textContent || "").replace(/[^\d]/g, "");
      const initialValue = initialRaw ? parseInt(initialRaw, 10) : 0;
      if (!Number.isFinite(target)) return;
      if (initialValue >= target) {
        counter.textContent = target.toLocaleString();
        return;
      }
      const startValue = initialValue;
      const delta = target - startValue;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(startValue + progress * delta);

        counter.textContent = value.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(step);
    }

    function startCountAnimation() {
      if (hasAnimated) return;
      hasAnimated = true;

      counters.forEach((counter, index) => {
        setTimeout(() => {
          animateCounter(counter);
        }, index * 200); // Stagger animation by 200ms
      });
    }

    // Check if hero indicators are in viewport
    function checkViewport() {
      const heroIndicators = document.querySelector(".hero-indicators");
      if (!heroIndicators) return;

      const rect = heroIndicators.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        startCountAnimation();
        window.removeEventListener("scroll", checkViewport);
      }
    }

    // Start animation when page loads (if indicators are visible)
    setTimeout(() => {
      checkViewport();
      window.addEventListener("scroll", checkViewport);
    }, 3000); // Wait for typewriter animation to complete
  }

  // Initialize counter animation
  window.addEventListener("load", animateCounters);

  // Mobile menu functionality
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });
  }

  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  }

  if (mobileMenu) {
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    // Close mobile menu when clicking on a link
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }

  // Header and topbar scroll behavior
  const header = document.getElementById('header');
  const topBar = document.querySelector('.top-bar');
  let lastScrollTop = 0;
  let scrollTimeout;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Topbar logic: only show when at the very top
      if (topBar && window.innerWidth >= 768) {
        if (scrollTop === 0) {
          topBar.classList.remove('hidden');
        } else {
          topBar.classList.add('hidden');
        }
      }

      // Header logic: hide/show based on scroll direction after 50px
      if (scrollTop > 50) {
        if (scrollTop > lastScrollTop) {
          // Scrolling down
          header.classList.add('hidden');
        } else {
          // Scrolling up
          header.classList.remove('hidden');
        }
      } else {
        header.classList.remove('hidden');
      }
      lastScrollTop = scrollTop;
    }, 10);
  });

  // Back to top button
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });



  // Responsive adjustments
  function handleResize() {
    const header = document.getElementById('header');
    const topBar = document.querySelector('.top-bar');
    const main = document.querySelector('.main');

    if (window.innerWidth >= 768) {
      if (header && header.classList) header.classList.add('with-topbar');
      if (main && main.classList) main.classList.add('with-topbar');
    } else {
      if (header && header.classList) header.classList.remove('with-topbar');
      if (main && main.classList) main.classList.remove('with-topbar');
    }
  }

  window.addEventListener('resize', handleResize);
  handleResize(); // Call on initial load

  // Header scroll effect for logo change
  function initHeaderScrollEffect() {
    const header = document.getElementById('header');

    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Initialize header scroll effect
  initHeaderScrollEffect();

  // Initialize clients carousel
  initializeClientsCarousel();

  // ===== GATED BROCHURE FUNCTIONALITY =====
  function initGatedBrochure() {
    const BROCHURE_URL = '/brochure_inacons.pdf';
    
    // Inject Modal HTML if it doesn't exist
    if (!document.getElementById('brochure-modal')) {
      const modalHTML = `
        <div id="brochure-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center; backdrop-filter: blur(4px);">
          <div style="background:#fff; border-radius:12px; padding:40px; max-width:440px; width:90%; position:relative; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
            <button id="brochure-modal-close" style="position:absolute;top:16px;right:16px;background:none;border:none;font-size:24px;cursor:pointer;color:#999;">&times;</button>
            <h3 style="margin:0 0 10px; font-size:24px; color:var(--color-primary, #003366);">Descarga el Brochure</h3>
            <p style="margin:0 0 24px; font-size:15px; color:#666; line-height:1.5;">Completa tus datos para recibir nuestro portafolio técnico actualizado.</p>
            <form id="brochure-form" action="https://formspree.io/f/mdapkgog" method="POST">
              <input type="hidden" name="_subject" value="Nueva descarga de Brochure - INACONS">
              <div style="margin-bottom:12px;">
                <input type="text" name="nombre" placeholder="Nombre completo" required style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:15px;">
              </div>
              <div style="margin-bottom:20px;">
                <input type="email" name="email" placeholder="Correo corporativo" required style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:15px;">
              </div>
              <button type="submit" style="width:100%;padding:14px;background:#f26500;color:#fff;border:none;border-radius:6px;font-size:16px;cursor:pointer;font-weight:600;transition:opacity 0.2s;">Descargar Ahora</button>
            </form>
            <div id="brochure-success" style="display:none; color:var(--color-success, #198754); text-align:center; margin-top:16px; font-weight:500;">
              ¡Gracias! Tu descarga comenzará en breve.
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById('brochure-modal');
    const form = document.getElementById('brochure-form');
    const closeBtn = document.getElementById('brochure-modal-close');
    const successMsg = document.getElementById('brochure-success');

    // Attach to any button with data-brochure-trigger or link to brochure
    document.querySelectorAll('[data-brochure-trigger="true"], a[href$="brochure_inacons.pdf"]').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'flex';
      });
    });

    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const submitBtn = form.querySelector('button');
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.textContent = 'Procesando...';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(res => {
        if (res.ok) {
          successMsg.style.display = 'block';
          form.style.display = 'none';
          setTimeout(() => {
            window.open(BROCHURE_URL, '_blank');
            modal.style.display = 'none';
            // Reset for next time
            setTimeout(() => {
              form.style.display = 'block';
              successMsg.style.display = 'none';
              form.reset();
              submitBtn.disabled = false;
              submitBtn.style.opacity = '1';
              submitBtn.textContent = 'Descargar Ahora';
            }, 500);
          }, 1500);
        }
      }).catch(() => {
        alert("Error de conexión. Inténtalo de nuevo.");
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.textContent = 'Descargar Ahora';
      });
    });
  }

  // Initialize gated brochure
  initGatedBrochure();

});

// ===== CLIENTS CAROUSEL FUNCTIONALITY =====
function initializeClientsCarousel() {
  // Inicializar carrusel infinito para home-clients (index.html)
  initializeClientsHome();

  // Inicializar carrusel estático para about-clients (nosotros.html)
  initializeClientsAbout();
}

// Carrusel infinito para home-clients
function initializeClientsHome() {
  const carouselTrack = document.getElementById('clientsCarouselTrack');

  if (!carouselTrack) return;

  let isUserInteracting = false;

  // Función para pausar/reanudar animación
  function pauseAnimation() {
    carouselTrack.style.animationPlayState = 'paused';
  }

  function resumeAnimation() {
    if (!isUserInteracting) {
      carouselTrack.style.animationPlayState = 'running';
    }
  }

  // Event listeners para hover (desktop)
  carouselTrack.addEventListener('mouseenter', () => {
    isUserInteracting = true;
    pauseAnimation();
  });

  carouselTrack.addEventListener('mouseleave', () => {
    isUserInteracting = false;
    resumeAnimation();
  });

  // Event listeners para touch (mobile)
  carouselTrack.addEventListener('touchstart', (e) => {
    isUserInteracting = true;
    pauseAnimation();
  }, { passive: true });

  carouselTrack.addEventListener('touchmove', () => {
    // No hacemos preventDefault para no romper el scroll/gestos.
    // Solo mantenemos la animación pausada mientras el usuario interactúa.
    pauseAnimation();
  }, { passive: true });

  carouselTrack.addEventListener('touchend', () => {
    // Pequeño delay antes de reanudar para mejor UX
    setTimeout(() => {
      isUserInteracting = false;
      resumeAnimation();
    }, 500);
  }, { passive: true });
}

// Carrusel estático con controles para about-clients
function initializeClientsAbout() {
  const clientsGrid = document.getElementById('clientsGrid');
  const prevBtn = document.getElementById('clientsPrev');
  const nextBtn = document.getElementById('clientsNext');

  if (!clientsGrid || !prevBtn || !nextBtn) return;

  const logos = clientsGrid.querySelectorAll('.client-logo');
  const itemsPerPage = 10; // 5 columnas x 2 filas
  let currentPage = 0;
  const totalPages = Math.ceil(logos.length / itemsPerPage);

  // Función para mostrar página específica
  function showPage(pageIndex) {
    logos.forEach((logo, index) => {
      const startIndex = pageIndex * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      if (index >= startIndex && index < endIndex) {
        logo.style.display = 'flex';
      } else {
        logo.style.display = 'none';
      }
    });

    // Actualizar estado de botones
    prevBtn.disabled = pageIndex === 0;
    nextBtn.disabled = pageIndex === totalPages - 1;
  }

  // Event listeners para botones
  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      showPage(currentPage);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      showPage(currentPage);
    }
  });

  // Mostrar primera página inicialmente
  showPage(0);
}

// ===== INFO CAROUSEL FUNCTIONALITY =====
function initializeInfoCarousel() {
  // Check if Swiper is available and the container exists
  if (typeof Swiper === 'undefined' || !document.querySelector('.info-carousel-swiper')) {
    // Only warn if the old carousel structure is also missing (avoid false positives on other pages)
    if (document.querySelector('.info-carousel')) {
        console.warn('Swiper not loaded or carousel container not found');
    }
    return;
  }

  const infoSwiper = new Swiper('.info-carousel-swiper', {
    loop: true,
    speed: 700,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    effect: 'slide',
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 0,
    watchOverflow: true,
    resistanceRatio: 0,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      init: function() {
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    }
  });
}

// ===== PROJECTS FILTER FUNCTIONALITY =====
function initializeProjectsFilter() {
  const filterBtns = document.querySelectorAll('.projects-filter-btn');
  const projectCards = document.querySelectorAll('.projects-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter projects
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || filter === category) {
          card.classList.remove('hidden');
          // Restart AOS animation for visible item
          if (card.classList.contains('aos-init')) {
            card.classList.remove('aos-animate');
            setTimeout(() => {
              card.classList.add('aos-animate');
            }, 50);
          }
        } else {
          card.classList.add('hidden');
        }
      });

      // Refresh AOS
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    });
  });
}

// Initialize info carousel when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  initializeInfoCarousel();
});