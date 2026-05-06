# Quick Wins de Performance — INACONS
## Instrucciones de aplicación

---

## ¿Qué cambia y por qué?

| Archivo | Cambio | Impacto |
|---|---|---|
| `BaseLayout.astro` | Elimina Lucide UMD, AOS, Font Awesome externos | -3 requests bloqueantes |
| `BaseLayout.astro` | Scripts con `defer` en vez de `is:inline` | No bloquean el parse HTML |
| `main.js` | IntersectionObserver reemplaza AOS | -14KB de JS externo |
| `main.js` | SVG inline reemplaza Font Awesome | -30KB de CSS externo |
| `scroll-animations.css` | CSS nativo para animaciones de scroll | <1KB vs 14KB de AOS |
| `index.astro` | `poster=` en el video hero | Elimina flash negro en carga |
| `index.astro` | `loading="eager"` en imagen above-the-fold | Mejora LCP |
| `index.astro` | SVG inline en lugar de `data-lucide=` | Sin runtime de Lucide |
| `index.astro` | Título SEO corregido (< 60 chars) | Mejor CTR en Google |

---

## Paso 1 — Reemplazar BaseLayout

```bash
# Desde la raíz de tu proyecto web-astro/
cp ESTA_CARPETA/src/layouts/BaseLayout.astro src/layouts/BaseLayout.astro
```

**Nota importante:** El nuevo BaseLayout usa `title` y `description` 
(no `titulo`/`descripcion`). Debes actualizar todas tus páginas:

```bash
# Busca todos los usos del prop antiguo
grep -r "titulo=" src/pages/
grep -r "descripcion=" src/pages/

# Reemplaza manualmente en cada página:
# titulo="..."     →  title="..."
# descripcion="..."  →  description="..."
```

Las páginas afectadas son:
- `src/pages/nosotros.astro`
- `src/pages/contacto.astro`
- `src/pages/documentos.astro`
- `src/pages/canal-etico.astro`
- `src/pages/sostenibilidad.astro`
- `src/pages/proyectos/index.astro`
- `src/pages/servicios/index.astro`
- `src/pages/servicios/[slug].astro`
- `src/pages/proyectos/[slug].astro`

Ejemplo de cambio en cada página:
```astro
<!-- ANTES -->
<BaseLayout titulo="Nosotros" descripcion="Conoce más sobre INACONS...">

<!-- DESPUÉS -->
<BaseLayout title="Nosotros | INACONS" description="Conoce más sobre INACONS...">
```

---

## Paso 2 — Reemplazar main.js

```bash
cp ESTA_CARPETA/public/assets/js/main.js public/assets/js/main.js
```

**Eliminar archivos obsoletos:**
```bash
# Este archivo duplica lógica de main.js y no hace nada útil
rm public/assets/js/swiper-init.js

# Este archivo usa EmailJS que ya no se necesita (usar Formspree)
rm public/assets/js/email.js

# Si existe este archivo (código muerto, no se usa en ninguna página)
rm public/assets/js/projects-filter.js
```

---

## Paso 3 — Añadir scroll-animations.css

```bash
cp ESTA_CARPETA/public/assets/css/scroll-animations.css public/assets/css/scroll-animations.css
```

Este archivo ya está referenciado en el nuevo `BaseLayout.astro`.  
Si usas el BaseLayout antiguo, agrégalo manualmente en `<head>`:

```html
<link rel="stylesheet" href="/assets/css/scroll-animations.css" />
```

---

## Paso 4 — Reemplazar index.astro

```bash
cp ESTA_CARPETA/src/pages/index.astro src/pages/index.astro
```

---

## Paso 5 — Verificar que el build funciona

```bash
npm run build
```

Si hay errores de TypeScript relacionados con `titulo`/`title`, 
es porque alguna página aún usa el prop antiguo. El error te dirá
exactamente cuál archivo y línea corregir.

---

## Paso 6 (Opcional pero recomendado) — Comprimir imágenes PNG

Las imágenes más pesadas del sitio están en `public/assets/imagenes/`.
Puedes convertirlas a WebP/AVIF con este comando:

```bash
# Instalar squoosh CLI (una sola vez)
npm install -g @squoosh/cli

# Convertir los PNG pesados a WebP
npx squoosh-cli --webp '{"quality":82}' \
  public/assets/imagenes/equipo_humano.png \
  public/assets/imagenes/equipo_humano2.png \
  public/assets/imagenes/equipo_humano3.png \
  public/assets/imagenes/sostenibilidad.png \
  public/assets/imagenes/hero_project.png

# Los archivos .webp generados pesarán ~90% menos
# Actualiza las referencias en tus páginas de .png a .webp
```

---

## Resultado esperado (Lighthouse)

| Métrica | Antes | Después |
|---|---|---|
| Performance score | ~55-65 | ~75-85 |
| LCP | ~4-6s | ~2-3s |
| Requests bloqueantes | 5 | 1 (solo Google Fonts) |
| JS en `<head>` | ~180KB | 0KB |
| CSS en `<head>` externo | ~50KB | 0KB |

---

## Dudas frecuentes

**¿Los iconos se verán igual?**  
Sí. Se reemplazaron con SVG inline exactamente iguales a los originales 
de Lucide y Font Awesome, pero sin cargar ninguna librería externa.

**¿Las animaciones de scroll se verán igual?**  
Sí, con la misma easing y duraciones. Además ahora respetan la 
preferencia del sistema `prefers-reduced-motion` para usuarios 
con sensibilidad al movimiento.

**¿El Swiper del carrusel sigue funcionando?**  
Sí. El CSS de Swiper se carga en `<head>` y el JS se carga con `defer`.
La inicialización ahora está en `main.js` en vez del inline script.

**¿Qué pasa con las páginas que aún tienen `data-lucide=`?**  
Seguirán funcionando pero mostrarán el elemento vacío porque Lucide UMD 
ya no se carga. Debes reemplazar los iconos en las demás páginas 
(nosotros, servicios, etc.) con SVG inline. 

La forma más rápida es copiar los SVG de https://lucide.dev/ 
buscando el nombre del icono.
