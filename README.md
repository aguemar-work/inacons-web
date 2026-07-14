# inacons.com.pe — Sitio Web Corporativo

Sitio web corporativo de **INACONS S.R.L.**, empresa peruana de ingeniería y construcción con más de 15 años de experiencia.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 6.1.9 (Static Site Generation) |
| Estilos | CSS personalizado (`design-system.css`) |
| Animaciones | CSS nativo + IntersectionObserver (sin AOS) |
| Slider | Swiper 11 (CDN, solo en `index.astro`) |
| Fuentes | Google Fonts — Montserrat (carga asíncrona) |
| Iconos | SVG inline (sin librerías externas) |
| Deploy | cPanel + GitHub Actions (CI/CD) |
| Dominio canónico | `inacons.com.pe` |
| Servidor de staging | `home.inacons.com.pe` |

---

## Estructura del Proyecto

```
web-astro/
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD → cPanel vía FTP
├── public/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── design-system.css     # Sistema de diseño principal (tokens, clases globales)
│   │   │   └── scroll-animations.css # Animaciones de scroll (IntersectionObserver)
│   │   ├── js/
│   │   │   └── main.js               # JS global (menú, hero, typewriter, mapa, etc.)
│   │   ├── imagenes/
│   │   │   ├── logos/
│   │   │   │   ├── logo_inacons.svg
│   │   │   │   └── logo_inacons_white.svg
│   │   │   ├── clientes/             # SVG de logos de clientes (scroll infinito)
│   │   │   ├── peru-depts.svg        # Mapa SVG interactivo del Perú
│   │   │   ├── peru2.svg
│   │   │   ├── image_heroprincipal.webp  # LCP image
│   │   │   ├── image_nosotros.webp
│   │   │   ├── image_obra_civiles.webp
│   │   │   └── ...                   # Imágenes de servicios y secciones (WebP)
│   │   ├── videos/
│   │   │   └── hero.mp4              # Video hero (4.6 MB — H.264, RF 32)
│   │   ├── recursos/                 # Flyers y materiales descargables
│   │   └── documentos/               # Documentos públicos
│   ├── empresa/                      # Panel PHP de administración (config.php en .gitignore)
│   ├── admin/                        # Admin interno
│   ├── favicon.ico / favicon.svg
│   ├── apple-touch-icon.png
│   ├── icon-192.png / icon-512.png
│   ├── robots.txt
│   └── .htaccess
├── src/
│   ├── appscripts/
│   │   └── amonestacion.js           # Validación del formulario de amonestaciones
│   ├── components/
│   │   ├── CtaBand.astro             # Banda CTA reutilizable (dark + 2 botones)
│   │   └── PageHero.astro            # Header de página interior (título + breadcrumb)
│   ├── content/
│   │   ├── proyectos/                # Markdown por proyecto
│   │   ├── servicios/                # Markdown por servicio
│   │   └── recursos/                 # Markdown de recursos descargables
│   ├── layouts/
│   │   └── BaseLayout.astro          # Layout base (head, nav, footer, meta OG)
│   └── pages/
│       ├── index.astro               # Home
│       ├── nosotros.astro
│       ├── sostenibilidad.astro
│       ├── contacto.astro
│       ├── canal-etico.astro
│       ├── documentos.astro
│       ├── 404.astro
│       ├── servicios/
│       │   ├── index.astro
│       │   └── [slug].astro          # Página dinámica por servicio
│       ├── proyectos/
│       │   ├── index.astro
│       │   └── [slug].astro          # Página dinámica por proyecto
│       ├── recursos/
│       │   └── index.astro           # Hub interno (noindex)
│       └── formulario/
│           └── amonestaciones.astro  # Formulario interno (noindex)
├── astro.config.mjs
├── package.json                      # Solo 2 deps: astro + @astrojs/sitemap
├── tsconfig.json
└── src/content.config.ts             # Schemas Zod de colecciones
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

**Requiere Node ≥ 22.12.0**

---

## CI/CD

El deploy se realiza automáticamente al hacer push a `main`:

1. GitHub Actions ejecuta `npm run build`
2. Los archivos de `dist/` se suben a cPanel vía FTP
3. El sitio queda disponible en `home.inacons.com.pe`

Variables de entorno requeridas en **GitHub Secrets**:
- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`

---

## Content Collections

Los contenidos dinámicos se gestionan con **Astro Content Collections** (schema validado con Zod).

### Proyectos (`src/content/proyectos/`)
```yaml
# Frontmatter requerido
titulo:    string
ubicacion: string
categoria: "Obras Civiles" | "Infraestructura" | "Electromecánica" | "Paisajismo" | "Minería" | "Consultoría"
año:       number
imagen:    string              # ruta pública, ej: /assets/imagenes/projects/foo.webp
destacado: boolean             # true = aparece en el home

# Frontmatter opcional
galeria:   string[]            # fotos adicionales para el detalle
orden:     number              # orden dentro del listado
```

### Servicios (`src/content/servicios/`)
```yaml
# Frontmatter requerido
titulo:      string
descripcion: string
imagen:      string

# Frontmatter opcional
orden:          number
especialidades: string[]
```

### Recursos (`src/content/recursos/`)
```yaml
# Frontmatter requerido
titulo:   string
categoria: "logo" | "flyer-impreso" | "flyer-digital" | "documento"
imagen:    string

# Frontmatter opcional
formato:     string     # default: "PNG"
dimensiones: string
qr:          string
orden:       number
```

---

## Páginas del sitio

| Ruta | Archivo | Indexada |
|------|---------|----------|
| `/` | `index.astro` | ✅ |
| `/nosotros` | `nosotros.astro` | ✅ |
| `/servicios` | `servicios/index.astro` | ✅ |
| `/servicios/[slug]` | `servicios/[slug].astro` | ✅ |
| `/proyectos` | `proyectos/index.astro` | ✅ |
| `/proyectos/[slug]` | `proyectos/[slug].astro` | ✅ |
| `/contacto` | `contacto.astro` | ✅ |
| `/sostenibilidad` | `sostenibilidad.astro` | ✅ |
| `/canal-etico` | `canal-etico.astro` | ✅ |
| `/documentos` | `documentos.astro` | ✅ |
| `/recursos` | `recursos/index.astro` | ❌ noindex |
| `/formulario/amonestaciones` | `formulario/amonestaciones.astro` | ❌ noindex |

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

- ✅ SVG inline — sin librerías de iconos externas (Lucide, Font Awesome eliminados)
- ✅ Google Fonts carga asíncrona
- ✅ Swiper CSS cargado solo en `index.astro` (no global)
- ✅ Preload de imagen LCP (`image_heroprincipal.webp`)
- ✅ Imágenes convertidas de PNG → WebP (~90% reducción de peso)
- ✅ `width`/`height` en logos del nav
- ✅ Video hero comprimido: 10.6 MB → 4.6 MB (H.264, RF 32, sin audio)
- ✅ AOS eliminado del `hero-content` (above-the-fold no debe animar)
- ✅ AOS reemplazado por IntersectionObserver nativo + `scroll-animations.css`
- ✅ Menú móvil rediseñado: iconos SVG, botones de acción, brochure, RRSS
- ✅ Sitemap excluye `/recursos` y `/formulario` (rutas noindex)

## Optimizaciones Pendientes

- ⏳ HTTP/2 en cPanel (est. ahorro 350ms en FCP/LCP)
- ⏳ CLS del hero — typewriter y contador JS causan layout shifts (0.474 → objetivo < 0.1)
- ⏳ `image_nosotros.webp` redimensionar (637 KB actual → objetivo < 200 KB)
- ⏳ `image_paisajismo.webp` redimensionar (519 KB actual → objetivo < 200 KB)
- ⏳ `image_obra_civiles.webp` redimensionar (346 KB actual → objetivo < 200 KB)
- ⏳ Cache lifetime extendido en `.htaccess` (assets → 1 mes)
- ⏳ `peru-depts.svg` / `peru2.svg` — añadir `width`/`height` explícitos
- ⏳ Swiper pagination bullets — tamaño táctil insuficiente en móvil
- ⏳ Contraste insuficiente en `.indicator-text` y `.sh-desc`

---

## Notas de Desarrollo

### Añadir un nuevo proyecto
1. Crear archivo `.md` en `src/content/proyectos/`
2. Completar el frontmatter según el schema (campo `titulo`, no `title`)
3. La `categoria` debe coincidir exactamente con el enum
4. Para que aparezca en el home: `destacado: true`

### Actualizar imágenes
- Formato preferido: **WebP** (calidad 82 con squoosh.app o squoosh CLI)
- Imágenes de sección: objetivo < 200 KB
- Siempre incluir `width` y `height` en los `<img>`

### Videos
- Comprimir con HandBrake: H.264, RF 32, sin audio, "Optimizar para Web"
- El video hero se carga con `autoplay muted loop playsinline`

### Mapa SVG (`peru-depts.svg`)
- IDs de departamentos: `dept-lima`, `dept-arequipa`, etc.
- Pines de ciudades: animados con SMIL (elemento `<animate>`)
- Ver `main.js` → función `initCoverageMap()` para la lógica de interacción

### CSS scoped en Astro
Los estilos para elementos inyectados por JS **deben ir en el propio JS** (no en `<style>` del `.astro`), porque Astro no puede hashear clases que no conoce en tiempo de compilación.

---

## Contacto del Proyecto

**Cliente:** INACONS S.R.L.
**Dominio canónico:** [inacons.com.pe](https://inacons.com.pe)
**Staging:** [home.inacons.com.pe](https://home.inacons.com.pe)
**Repositorio:** GitHub (privado)
