---
name: stitch-design
description: >-
  Diseno de landings y pantallas con Stitch MCP para Refacciones Automotrices.
  Usar cuando el usuario pida disenar o iterar una landing, mockup Stitch,
  actualizar DESIGN.md, generar pantalla desde texto o editar pantalla existente.
---

# Stitch Design — Refacciones Automotrices

Eres quien guia el **diseno con Google Stitch (MCP)** para este repo. El producto real es **Next.js 16 + Tailwind + shadcn**; Stitch produce **referencia visual y HTML**, no el codigo final de produccion.

## Antes de actuar

1. Lee **`.stitch/DESIGN.md`** (especialmente **seccion 6**, bloque para copiar al prompt).
2. Lee **`.stitch/SITE.md`** para rutas Next y mapa de paginas.
3. Lee **`.stitch/metadata.json`** para `projectId`. Si falta o falla, usa el MCP **`list_projects`** y actualiza `metadata.json`.

## MCP Stitch en este proyecto

- Configuracion: **`.cursor/mcp.json`** (servidor `stitch`, `GOOGLE_CLOUD_PROJECT=refacciones-mvp`).
- Antes de la primera llamada, si no conoces los nombres exactos de herramientas, inspecciona el descriptor del servidor en el workspace.
- **Reglas de las herramientas:**
  - `generate_screen_from_text` y `edit_screens` pueden tardar **varios minutos**: **no reintentar** de inmediato; si hay error de red, puede que la generacion siga en servidor — usar `get_screen` / `list_screens` despues.
  - Pasar `projectId` **sin** prefijo `projects/`.

### Herramientas tipicas

| Intencion | Herramienta MCP | Parametros clave |
|-----------|------------------|------------------|
| Nueva pantalla / landing | `generate_screen_from_text` | `projectId`, `prompt`, `deviceType` (ej. `DESKTOP` o `MOBILE`) |
| Ajustar pantalla existente | `edit_screens` | `projectId`, `selectedScreenIds`, `prompt` |
| Ver estado / URLs | `get_screen`, `list_screens`, `get_project` | `projectId`, `screenId` segun tool |
| Obtener HTML | `fetch_screen_code` | `projectId`, `screenId` |
| Obtener imagen | `fetch_screen_image` | segun schema del servidor |

## Flujo: disenar una landing (text-to-design)

1. **Mejorar el prompt del usuario** con terminologia UI concreta (jerarquia, sticky header, grid de cards, CTA primario/secundario, espaciado).
2. **Incrustar obligatoriamente** el bloque *Design system notes* de `.stitch/DESIGN.md` seccion 6 dentro del prompt enviado a Stitch.
3. Llamar **`generate_screen_from_text`** con `deviceType` acorde (landings catalogo → suele ser `DESKTOP`; variante movil → `MOBILE`).
4. Tras la respuesta:
   - Mostrar al usuario **`outputComponents`**: textos, sugerencias y resumenes que vengan en la respuesta.
   - Si hay sugerencias accionables ("Yes, make them all"), ofrecer al usuario repetir generacion con el prompt sugerido.
5. **Artefactos locales (opcional):** si el usuario quiere archivos en repo, guardar referencias bajo **`.stitch/designs/`**:
   - `{slug-pagina}.html` — contenido desde `fetch_screen_code` o URL de codigo que devuelva `get_screen`.
   - `{slug-pagina}.png` — screenshot si hay URL; para thumbnails de CDN Google, puedes anadir `=w{width}` al query de ancho segun documentacion Stitch.
6. **Implementacion en Next.js:** describir o aplicar cambios en **`src/app/...`** usando componentes existentes (`SearchBar`, `Card`, `ProductCard`, etc.); **no** sustituir la app por el HTML crudo de Stitch.

## Flujo: editar diseno existente (edit-design)

1. Obtener **screen IDs** con `list_screens` o desde `docs/stitch-evaluation.md` / historial.
2. Prompt corto y especifico (ej. "Aumenta contraste del CTA rojo", "Hero mas compacto en mobile").
3. Incluir de nuevo el bloque de **seccion 6** de `DESIGN.md` si el cambio afecta estilo global.
4. Llamar **`edit_screens`** con `selectedScreenIds` (IDs sin prefijo `screens/` si asi lo pide el schema).

## Flujo: crear o actualizar `.stitch/DESIGN.md`

- Si el usuario cambia paleta o voz de marca, **editar** `.stitch/DESIGN.md` y la **seccion 6** (lo que se copia a Stitch).
- Opcional: enriquecer desde salida de `get_screen` / tema del proyecto si el MCP expone tokens.

## Mapeo rapido (vago → preciso)

| Vago | Mejor para Stitch |
|------|-------------------|
| "Bonita landing" | Hero full-width oscuro, titulo display 2 lineas, subtitulo muted, buscador centrado ancho max ~xl, grid 4 columnas categorias con icono + titulo + descripcion corta |
| "Que se vea profesional" | Espaciado generoso (py-16+), limitar line length texto, cards con ring sutil y hover elevacion leve |
| "Mas marca" | Acento rojo solo en logo, CTA primario y enlaces hover; resto neutro |

## Buenas practicas (proyecto)

- **Iterar con `edit_screens`** antes que regenerar todo.
- Alinear copy con **Mexico** y terminos del dominio (refacciones, catalogo, cotizacion).
- Tras entregas utiles, el usuario puede actualizar **`docs/stitch-evaluation.md`** o Version1; sugerirlo si hubo decision de diseno importante.

## Referencia externa

Patron inspirado en la skill publica [stitch-design](https://skills.sh/google-labs-code/stitch-skills/stitch-design) (Google Labs stitch-skills), adaptado a este monorepo Next.js.
