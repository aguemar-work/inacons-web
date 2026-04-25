document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper === 'undefined') return;

    // ===== Carrusel de clientes (nosotros.html) =====
    const clientsEl = document.querySelector('.clients-swiper');
    let clientsSwiper = null;

    if (clientsEl) {
        clientsSwiper = new Swiper('.clients-swiper', { 
            loop: true,
            slidesPerView: 1,
            spaceBetween: 0,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            navigation: { 
                nextEl: '.clients-btn-next', 
                prevEl: '.clients-btn-prev', 
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 0
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 0
                },
                1024: {
                    slidesPerView: 1,
                    spaceBetween: 0
                }
            },
            on: {
                init: function () {
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            }
        });

        // Pause autoplay en hover de items
        const logoItems = document.querySelectorAll('.client-logo-item');
        logoItems.forEach((item) => {
            item.addEventListener('mouseenter', () => {
                if (clientsSwiper?.autoplay) clientsSwiper.autoplay.stop();
            });

            item.addEventListener('mouseleave', () => {
                if (clientsSwiper?.autoplay) clientsSwiper.autoplay.start();
            });
        });

        // Touch/swipe support for mobile
        if (window.innerWidth <= 767) {
            clientsSwiper.allowTouchMove = true;
        }
    }

    // ===== Otros carruseles (si existen) =====
    const generalEl = document.querySelector('.swiper-container');
    if (generalEl) {
        new Swiper('.swiper-container', { 
            loop: true,
            slidesPerView: 3,
            spaceBetween: 30,
            pagination: { 
                el: '.swiper-pagination', 
                clickable: true, 
            },
            navigation: { 
                nextEl: '.swiper-button-next', 
                prevEl: '.swiper-button-prev', 
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 25
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    }
});