# INACONS — Sitio Web Corporativo

Sitio web institucional de INACONS S.R.L., empresa peruana de ingeniería y construcción.

## Stack

- **Framework:** Astro 5
- **CMS:** Decap CMS con backend GitHub
- **CSS:** Design System propio (design-system.css)
- **Deploy:** GitHub Actions → FTP → cPanel
- **Dominio:** home.inacons.com.pe

## Estructura

```
src/
  content/
    proyectos/     ← archivos .md de cada proyecto (editables desde el CMS)
    servicios/     ← archivos .md de cada servicio
  layouts/
    BaseLayout.astro   ← layout global (nav, footer, scripts)
  pages/
    index.astro
    nosotros.astro
    servicios/
    proyectos/
    documentos.astro
    canal-etico.astro
    contacto.astro
public/
  admin/
    config.yml     ← configuración del CMS
  assets/
    css/design-system.css
    js/main.js, email.js
    imagenes/
```

## Desarrollo local

```bash
npm install
npm run dev
# http://localhost:4321
```

## Deploy

Automático en cada push a `main` vía GitHub Actions → FTP → cPanel.

Secrets requeridos en el repo:

| Secret | Descripción |
|--------|-------------|
| `FTP_SERVER` | Host FTP del cPanel |
| `FTP_USERNAME` | Usuario FTP |
| `FTP_PASSWORD` | Contraseña FTP |

## CMS

Panel en `/admin`. Autenticación con GitHub.
Gestiona: Proyectos y Servicios.

## Pendientes

- [ ] Subir video hero a `public/assets/videos/hero.mp4`
- [ ] Subir brochure a `public/brochure_inacons.pdf` y descomentar en `servicios/[slug].astro`
- [ ] Imágenes de proyectos en `public/assets/imagenes/proyectos/`
- [ ] Configurar allowlist de dominio en EmailJS
- [ ] Activar 2FA en la cuenta de GitHub de INACONS