# Sitio — Refacciones Automotrices (vista Stitch)

## 1. Proposito

Landing y flujos publicos de un catálogo de refacciones: busqueda, detalle, cotizacion. Stitch sirve para **disenar y refinar vistas**; la implementacion real vive en **Next.js 16** (`src/app/`).

## 2. Proyecto Stitch

- **projectId** (referencia): `12594010196170838033` (ver `.stitch/metadata.json`)
- Si el ID cambia, usa el MCP `list_projects` / `get_project` y actualiza `metadata.json`.

## 3. Mapa de landings / pantallas (objetivo diseno)

| Pagina | Ruta Next.js | Notas |
|--------|----------------|-------|
| Home / landing | `src/app/page.tsx` | Hero oscuro, categorias, vista previa catalogo, CTA WhatsApp |
| Busqueda | `src/app/buscar/page.tsx` | Grid + filtros |
| Detalle producto | `src/app/producto/[slug]/page.tsx` | Ficha, compatibilidad |
| Cotizacion | `src/app/cotizacion/page.tsx` | Carrito + formulario |

## 4. Flujo de trabajo (diseno → codigo)

1. Generar o editar en Stitch siguiendo `.stitch/DESIGN.md`.
2. Guardar artefactos en `.stitch/designs/{nombre}.html` y `.png` cuando el usuario quiera archivo local de referencia.
3. **No** pegar HTML de Stitch como produccion: traducir a componentes React + Tailwind + shadcn ya usados en el repo.
4. Documentar decisiones breves en PR o en `docs/stitch-evaluation.md` si es evaluacion formal.

## 5. Pantalla Stitch reciente (referencia)

| Nombre local | Screen ID | Archivos |
|--------------|-----------|----------|
| Landing Precision 2026 | `a3f16aab5a3b4c48aa9ec6f1438724ca` | `.stitch/designs/landing-precision-2026.html` + `.png` |

Design system generado en Stitch: **Precision Core** (tokens semanticos + guia *Precision Engineering Hub* en salida del agente). Ver tambien `metadata.json`.

**Previsualizar HTML local:** `npx serve .stitch/designs` y abrir `/landing-precision-2026.html`.

## 6. Roadmap diseno (editable)

- [x] Variante landing premium industrial (Stitch, abr 2026)
- [ ] Traducir a `src/app/page.tsx` (hero, trust strip, bloque valor, CTA WhatsApp)
- [ ] Refinar landing (hero, prueba social, trust)
- [ ] Variante mobile-first de busqueda
- [ ] Landing marketing aparte del catalogo (opcional)
