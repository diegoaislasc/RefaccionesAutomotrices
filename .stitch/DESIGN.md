# Design system — Refacciones Automotrices (Stitch + producto)

Fuente: evaluacion F0 (`docs/stitch-evaluation.md`) + implementacion actual en Next.js / Tailwind / shadcn.

---

## 1. Principios

- **Marca**: confianza industrial + claridad; acento **rojo** (accion / marca), fondos **zinc** en hero.
- **Desktop-first** para catalogo; mobile usable sin friccion.
- **Stitch** genera referencia visual; **tokens** deben alinearse con esta hoja al promptear.

---

## 2. Paleta (roles)

| Rol | Uso | Referencia Tailwind / hex |
|-----|-----|---------------------------|
| Fondo hero / oscuro | Cabecera principal | `zinc-900`, gradiente radial `red-900/20` |
| Acento primario | CTA, marca, hover enlaces | `red-500`, `red-600` (botones) |
| Superficie clara | Secciones bajo hero | `bg-background`, `muted` |
| Texto sobre oscuro | Titulos hero | `text-white`, secundario `zinc-400` |
| Texto sobre claro | Cuerpo | `text-foreground`, `muted-foreground` |

---

## 3. Tipografia

- **Producto**: Inter (layout raiz en `src/app/layout.tsx`).
- En Stitch puedes pedir **Inter** para paridad con produccion.

---

## 4. Componentes que ya existen en codigo (no reinventar en Stitch como spec final)

- `SearchBar` (hero + compact)
- `ProductCard`, `Card` categoria
- Header sticky con logo **RA**
- Botones estilo shadcn (`button-variants`)

En prompts Stitch, describir **layout y jerarquia** compatible con estos bloques.

---

## 5. Voz y contenido (MX)

- Espanol Mexico: "refaccion", "catalogo", "cotizacion", "busqueda".
- CTAs: "Ver catalogo", "Agregar a cotizacion", WhatsApp cuando aplique.

---

## 6. Design system notes for Stitch generation (COPIAR AL PROMPT)

Usa este bloque al final de cada prompt a `generate_screen_from_text` o al editar con `edit_screens`:

```markdown
**DESIGN SYSTEM (REQUIRED) — Refacciones Automotrices:**
- Platform: Web, desktop-first, responsive
- Mood: Profesional, taller automotriz / refacciones, limpio, no jugueton
- Palette: Fondo hero muy oscuro (zinc/casi negro), acentos rojos (#ef4444 / #dc2626), superficies claras blanco/gris para secciones inferiores
- Typography: Inter, jerarquia clara (titulo display en hero, cuerpo legible)
- Styles: Bordes suaves (rounded-lg/xl), sombras ligeras en cards, mucho aire en secciones
- Branding: Monograma "RA" o texto "Refacciones" en header; buscador prominente en hero
- No saturar de color: el rojo solo para acentos y CTAs
```

---

## 7. Actualizar este documento

Si cambias tema en `globals.css` o tokens shadcn, ajusta secciones 2–6 para que los prompts Stitch sigan alineados.
