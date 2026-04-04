# Evaluación de Stitch (Google Labs) — Fase 0

**Flujo de diseno en el repo:** ver `.stitch/DESIGN.md`, `.stitch/SITE.md` y la skill `.cursor/skills/stitch-design/SKILL.md` (prompts alineados a la landing Next.js).

**Fecha:** 2026-03-30
**Proyecto Stitch:** RefaccionesAutomotrices (ID: 12594010196170838033)
**Proyecto GCP:** refacciones-mvp
**Modelo utilizado:** Gemini 3 Pro

---

## 1. Resumen Ejecutivo

Stitch genera HTML con Tailwind CSS de alta calidad visual. Sin embargo, el output **no es directamente usable** como código de componentes React/Next.js. Su valor principal es como **referencia visual y de diseño**, no como base de código.

**Decisión: Stitch como referencia visual, NO como base de componentes.**

---

## 2. Pantallas Generadas

| Pantalla | Screen ID | Calidad Visual | Calidad Código |
|---|---|---|---|
| Landing Precision 2026 (industrial) | `a3f16aab5a3b4c48aa9ec6f1438724ca` | Alta | Media (referencia) |
| Landing Page | `e16e35f1653e44a0b6d12a4f6dc1c715` | Alta | Media |
| Resultados de Búsqueda | `03ecfbf921244a0aa4616718bcaa37b0` | Alta | Media |
| Detalle de Producto | `7e1d9511f11b4c2883f593c09fde13d4` | Alta | Media |

---

## 3. Lo que Stitch hace bien

### 3.1 Design System auto-generado ("Velocity Blue")
Stitch generó automáticamente un design system completo con:
- Paleta semántica de ~40 color tokens (primary, surface, on-surface, etc.)
- Tipografía: Inter (headline, body, label)
- Spacing scale, roundness, elevation rules
- Documento markdown con guías de uso ("The Precision Atelier")

**Valor:** La paleta y los tokens se pueden reutilizar directamente en `tailwind.config.ts`.

### 3.2 Layout y UX
- Jerarquía visual correcta (hero → categorías → CTA)
- Filtros laterales funcionales en búsqueda
- Tabs para specs y compatibilidad en detalle
- Breadcrumbs, paginación, badges de compatibilidad
- Micro-interacciones: hover scale, transitions, glassmorphism

### 3.3 Tailwind CSS nativo
El HTML generado usa clases de Tailwind puras:
- Responsive prefixes (`md:`, `lg:`, `sm:`)
- Custom colors definidos en inline `tailwind.config`
- Grid/flexbox layouts modernos

### 3.4 Imágenes de referencia
Stitch generó imágenes placeholder con prompts descriptivos (`data-alt`), útiles para definir el tipo de fotografía de producto necesaria.

---

## 4. Brechas con nuestro stack

### 4.1 No es React/Next.js
| Lo que genera Stitch | Lo que necesitamos |
|---|---|
| HTML plano | Componentes React (.tsx) con App Router |
| `<a href="#">` | `<Link href="/ruta">` de Next.js |
| `<img>` con CDN URLs | `<Image>` de `next/image` con optimización |
| Sin state management | Zustand para carrito, hooks para búsqueda |
| Sin Server Components | RSC para fetching de datos de Supabase |

### 4.2 No usa shadcn/ui
| Componente Stitch | Equivalente shadcn/ui |
|---|---|
| `<button>` custom con clases | `<Button variant="default">` |
| `<input>` custom | `<Input>` con composición |
| Cards con divs | `<Card>`, `<CardHeader>`, `<CardContent>` |
| Tabs con buttons | `<Tabs>`, `<TabsTrigger>`, `<TabsContent>` |
| Badges inline | `<Badge variant="secondary">` |
| Checkboxes raw | `<Checkbox>` con label accesible |

### 4.3 Iconos incompatibles
- Stitch usa **Material Symbols** (Google)
- shadcn/ui usa **Lucide React** por defecto
- Necesita mapeo manual de iconos

### 4.4 Accesibilidad (a11y)
- Sin atributos ARIA
- Sin manejo de focus
- Sin navegación por teclado
- Sin roles semánticos en componentes interactivos

### 4.5 Inconsistencias de idioma
- Footer y nav mezclan inglés/español entre pantallas
- Labels inconsistentes ("Request Quote" vs "Cotización")

---

## 5. Elementos reutilizables

### 5.1 Design Tokens → `tailwind.config.ts`
Los color tokens generados son directamente trasladables:

```typescript
// Extraído del design system "Velocity Blue"
const colors = {
  primary: "#00288e",
  "primary-container": "#1e40af",
  surface: "#f7f9fb",
  "on-surface": "#191c1e",
  "on-surface-variant": "#444653",
  outline: "#757684",
  "outline-variant": "#c4c5d5",
  // ... ~40 tokens más
}
```

### 5.2 Decisiones de diseño a conservar
- **Color primario:** #1e40af (azul industrial)
- **Font:** Inter (headline + body + label)
- **Roundness:** 8px (rounded-lg)
- **Background:** #f7f9fb (off-white, no pure white)
- **No usar pure black:** usar #191c1e
- **Glassmorphism en nav:** backdrop-blur + transparency
- **Gradient CTA:** linear-gradient(135deg, #00288e, #1e40af)

### 5.3 Estructura de layout
- Header: logo | search compacto | cotización badge
- Hero: headline + subtitle + search prominente + trust badges
- Categorías: grid 4 columnas con iconos
- Búsqueda: sidebar 240px filtros | grid 3 columnas cards
- Producto: 50/50 imagen gallery | info + actions + tabs specs

---

## 6. Esfuerzo estimado de conversión

| Tarea | Esfuerzo |
|---|---|
| Extraer design tokens a `tailwind.config.ts` | ~30 min |
| Recrear componentes con shadcn/ui | ~4-6 hrs por pantalla |
| Mapear iconos Material → Lucide | ~1 hr |
| Agregar a11y + keyboard nav | ~2 hrs |
| Integrar con Supabase data fetching | ~3-4 hrs |
| **Total estimado** | **~20-25 hrs** |

vs. construir desde cero sin referencia visual: **~25-35 hrs**

**Ahorro neto estimado: 15-30% del tiempo de frontend.**

---

## 7. Decisión Final

### Stitch = Referencia Visual + Design Tokens

**Uso recomendado:**
1. Consultar las pantallas en stitch.withgoogle.com como mockups de referencia
2. Extraer el design system (colores, tipografía, spacing) al `tailwind.config.ts`
3. Usar la estructura de layout como guía para construir componentes React/shadcn/ui
4. **NO** copiar HTML directamente — reescribir como componentes modulares

**No usar como:**
- Base de código para componentes
- Generador de componentes React
- Sustituto de shadcn/ui

### Criterio de salida: CUMPLIDO

Se documentó la evaluación con decisión clara: **Stitch como referencia visual y fuente de design tokens, no como generador de código de producción.**

---

## 8. Links de Referencia

- [Proyecto Stitch](https://stitch.withgoogle.com) — Pantallas generadas visibles aquí
- Design System: "Velocity Blue" — documentado en el proyecto Stitch
- Pantallas: Landing, Search Results, Product Detail
