# Optimizaciones Pendientes — INACONS Web

Estado actual de performance y acciones concretas para mejorar Core Web Vitals.

---

## Estado Lighthouse (Mayo 2026)

| Métrica | Valor | Objetivo | Estado |
|---------|-------|----------|--------|
| Performance | 65 | ≥ 80 | ❌ |
| LCP | 3.2s | < 2.5s | ❌ |
| CLS | 0.474 | < 0.1 | ❌ Crítico |
| FCP | 3.0s | < 1.8s | ❌ |
| TBT | 130ms | < 200ms | ✅ |
| Accessibility | 90 | — | ✅ |
| Best Practices | 100 | — | ✅ |
| SEO | 100 | — | ✅ |

---

## 1. CLS — Cumulative Layout Shift (Crítico: 0.474)

El CLS crítico viene de dos fuentes en el hero:

### Causa A: Typewriter en el H1

El texto del `<h1>` cambia de tamaño mientras escribe, causando reflow. Fijar la altura mínima:

```css
/* En design-system.css o en el <style> del hero */
.hero-title {
  min-height: 4.5rem;   /* Ajustar al tamaño del texto final */
  display: block;
}
```

### Causa B: Contador animado (KPIs)

Los números que cuentan desde 0 empujan el layout. Reservar espacio con `min-width`:

```css
.kpi-number {
  min-width: 4ch;     /* 4 dígitos de ancho mínimo */
  display: inline-block;
}
```

### Causa C: Video hero sin dimensiones explícitas

Si el `<video>` no tiene `width`/`height`, el browser no puede calcular el aspect ratio antes de cargar:

```html
<!-- src/pages/index.astro -->
<video width="1920" height="1080" autoplay muted loop playsinline>
  <source src="/assets/videos/hero.mp4" type="video/mp4" />
</video>
```

---

## 2. LCP — Largest Contentful Paint (3.2s → objetivo < 2.5s)

### A: Comprimir imagen heroprincipal

El LCP es `image_heroprincipal.webp`. Si pesa más de 200 KB, comprimir:

```bash
# Con squoosh CLI
npx @squoosh/cli --webp '{"quality":75,"method":4}' \
  public/assets/imagenes/image_heroprincipal.webp
```

Tamaño objetivo: **< 150 KB** (la imagen se muestra a ~600px en móvil y ~1200px en desktop).

### B: Preload ya activo — verificar que siga presente

En `src/pages/index.astro`, debe existir este preload en el head:

```html
<link rel="preload" as="image"
  href="/assets/imagenes/image_heroprincipal.webp"
  fetchpriority="high" />
```

### C: HTTP/2 en cPanel

Sin HTTP/2, el browser abre conexiones TCP seriales. Habilitarlo en cPanel:
`cPanel → Apache SpeedyON / MultiPHP Manager → habilitar HTTP/2`

Impacto estimado: **−300–400ms en FCP/LCP**.

---

## 3. Imágenes grandes (peso → compresión)

| Imagen | Peso actual | Objetivo | Dimensión de render |
|--------|-------------|----------|---------------------|
| `image_nosotros.webp` | 637 KB | < 200 KB | ~600px ancho |
| `image_paisajismo.webp` | 519 KB | < 200 KB | ~400px ancho |
| `image_mineria.webp` | 591 KB | < 200 KB | ~400px ancho |
| `image_obra_civiles.webp` | 346 KB | < 150 KB | ~400px ancho |

Comprimir con squoosh (calidad 75, método 4):

```bash
npx @squoosh/cli --webp '{"quality":75,"method":4}' \
  public/assets/imagenes/image_nosotros.webp \
  public/assets/imagenes/image_paisajismo.webp \
  public/assets/imagenes/image_mineria.webp \
  public/assets/imagenes/image_obra_civiles.webp
```

---

## 4. Cache de assets en .htaccess

Agregar headers de cache agresivos para assets estáticos. En `public/.htaccess`:

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType video/mp4 "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
</IfModule>
```

---

## 5. SVG del mapa sin dimensiones

`peru-depts.svg` y `peru2.svg` no tienen `width`/`height` explícitos → posible CLS.

En el HTML donde se embeben, agregar:

```html
<img src="/assets/imagenes/peru-depts.svg"
     width="480" height="694"
     alt="Mapa de cobertura INACONS en el Perú" />
```

El viewBox original de `peru-depts.svg` es `0 0 15306.62 22149.86` (ratio ~0.69 — ancho/alto).

---

## 6. Accesibilidad menor

- **Swiper pagination**: Los bullets tienen `width: 8px` — demasiado pequeños para táctil (mínimo recomendado: 44×44px). Aumentar con CSS:

```css
.swiper-pagination-bullet {
  width: 12px;
  height: 12px;
  touch-action: manipulation;
}
```

- **Contraste bajo**: `.indicator-text` y `.sh-desc` tienen contraste < 4.5:1 con el fondo. Oscurecer el texto o aclarar el fondo.

---

## Historial de optimizaciones aplicadas

Referencia de lo que ya se hizo (no repetir):

| Fecha | Optimización |
|-------|-------------|
| Jun 2026 | Menú móvil rediseñado: iconos SVG, botones CTA, brochure, RRSS |
| Jun 2026 | Fix móvil: hero 100vh, título sin corte, CTA en columna |
| Jun 2026 | Video hero comprimido 10.6 MB → 4.6 MB (HandBrake, H.264, RF 32) |
| May 2026 | PNG → WebP en todas las imágenes (~90% reducción) |
| May 2026 | AOS eliminado, reemplazado por IntersectionObserver + scroll-animations.css |
| May 2026 | Lucide UMD y Font Awesome eliminados, reemplazados por SVG inline |
| May 2026 | Swiper CSS movido de global a solo index.astro |
| May 2026 | Preload de imagen LCP en index.astro |
| May 2026 | Google Fonts con carga asíncrona (no bloqueante) |
