# inacons.com.pe — Sitio Web Corporativo

Sitio web corporativo de **INACONS S.R.L.**, empresa peruana de ingeniería y construcción con más de 15 años de experiencia.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 5 (Static Site Generation) |
| Estilos | CSS personalizado (`design-system.css`) |
| Animaciones | AOS (Animate On Scroll) + CSS custom |
| Slider | Swiper 11 (CDN) |
| Fuentes | Google Fonts — Montserrat |
| Iconos | SVG inline (migrado desde Lucide) |
| Deploy | cPanel + GitHub Actions (CI/CD) |
| Dominio producción | `home.inacons.com.pe` |

---

## Estructura del Proyecto

```
web-astro/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD → cPanel vía FTP
├── public/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── design-system.css     # Sistema de diseño principal
│   │   │   └── scroll-animations.css # Animaciones de scroll
│   │   ├── js/
│   │   │   └── main.js               # JS global
│   │   ├── imagenes/
│   │   │   ├── logos/
│   │   │   │   ├── logo_inacons.svg
│   │   │   │   └── logo_inacons_white.svg
│   │   │   ├── image_heroprincipal.webp  # LCP image (816 KB)
│   │   │   ├── image_obra_civiles.webp   # (833 KB — candidata a optimizar)
│   │   │   ├── home_about.webp
│   │   │   ├── peru2.svg
│   │   │   └── ...
│   │   └── videos/
│   │       └── hero.mp4              # Video hero (4.6 MB — comprimido)
│   ├── favicon.ico
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── content/
│   │   ├── proyectos/            # Markdown por proyecto
│   │   ├── servicios/            # Markdown por servicio
│   │   └── recursos/             # Markdown de recursos
│   ├── layouts/
│   │   └── BaseLayout.astro      # Layout base (head, nav, footer)
│   └── pages/
│       ├── index.astro           # Home
│       ├── nosotros.astro
│       ├── servicios/
│       │   └── index.astro
│       ├── proyectos/
│       │   └── index.astro
│       ├── sostenibilidad.astro
│       ├── contacto.astro
│       ├── canal-etico.astro
│       └── documentos.astro
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## CI/CD

El deploy se realiza automáticamente al hacer push a `main`:

1. GitHub Actions ejecuta `npm run build`
2. Los archivos de `dist/` se suben a cPanel vía FTP/SFTP
3. El sitio queda disponible en `home.inacons.com.pe`

Variables de entorno requeridas en GitHub Secrets:
- `FTP_HOST`
- `FTP_USER`
- `FTP_PASSWORD`

---

## Content Collections

Los contenidos dinámicos se gestionan con **Astro Content Collections**:

### Proyectos (`src/content/proyectos/`)
```yaml
# Frontmatter requerido
title: string
descripcion: string
categoria: "Obras Civiles" | "Infraestructura" | "Electromecánica" | "Paisajismo" | "Minería" | "Consultoría"
ubicacion: string
anio: number
imagen: string
destacado: boolean
```

### Servicios (`src/content/servicios/`)
```yaml
title: string
descripcion: string
icono: string
orden: number
```

---

## Lighthouse Scores (Producción — Mayo 2026)

| Categoría | Score |
|-----------|-------|
| Performance | 65 |
| Accessibility | 90 |
| Best Practices | 100 |
| SEO | 100 |

### Core Web Vitals
| Métrica | Valor | Estado |
|---------|-------|--------|
| FCP | 3.0s | ⚠️ Mejorable |
| LCP | 3.2s | ⚠️ Mejorable |
| TBT | 130ms | ✅ Bueno |
| CLS | 0.474 | ❌ Crítico |
| Speed Index | 3.3s | ⚠️ Mejorable |

---

## Optimizaciones Aplicadas

- ✅ SVG inline (reemplazó Lucide JS)
- ✅ Google Fonts carga asíncrona
- ✅ Swiper CSS movido solo a `index.astro`
- ✅ Preload de imagen LCP (`image_heroprincipal.webp`)
- ✅ Imágenes convertidas de PNG → WebP (~93% reducción)
- ✅ `width`/`height` en logos del nav
- ✅ Contraste mejorado en footer y CTAs
- ✅ Video hero comprimido: 10.6 MB → 4.6 MB (H.264, RF 32)
- ✅ Animación AOS eliminada del `hero-content` (above-the-fold)

## Optimizaciones Pendientes

- ⏳ HTTP/2 en cPanel (est. ahorro 350ms en FCP/LCP)
- ⏳ CLS del hero — typewriter y contador JS causan shifts (0.474)
- ⏳ `image_obra_civiles.webp` redimensionar a ~462px de ancho (ahorro ~822 KB)
- ⏳ `image_heroprincipal.webp` redimensionar/comprimir (ahorro ~620 KB)
- ⏳ Cache lifetime extendido en `.htaccess`
- ⏳ `peru2.svg` — añadir `width`/`height` explícitos
- ⏳ `<li>` del submenú móvil sin `role="list"` en `<ul>` padre
- ⏳ Swiper pagination bullets — tamaño táctil insuficiente en móvil
- ⏳ Contraste insuficiente en `.indicator-text` y `.sh-desc`

---

## Notas de Desarrollo

### Añadir un nuevo proyecto
1. Crear archivo `.md` en `src/content/proyectos/`
2. Completar el frontmatter según el schema de Zod
3. La `categoria` debe coincidir exactamente con el enum

### Actualizar imágenes
- Formato preferido: **WebP** (calidad 82 con squoosh.app)
- Imágenes del hero: preferiblemente < 200 KB
- Siempre incluir `width` y `height` en los `<img>`

### Videos
- Comprimir con HandBrake: H.264, RF 32, sin audio, "Optimizar para Web"
- El video hero se carga con `autoplay muted loop playsinline`

---

## Contacto del Proyecto

**Cliente:** INACONS S.R.L.
**Dominio:** [home.inacons.com.pe](https://home.inacons.com.pe)
**Repositorio:** GitHub (privado)