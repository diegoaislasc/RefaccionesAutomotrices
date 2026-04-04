# Refacciones Automotrices MVP — Version 1

> Documento vivo. El agente lo lee al iniciar sesion y lo actualiza conforme avanza el trabajo.
> Ultima actualizacion: 2026-04-04 (skill stitch-design + .stitch/)

## Estado general

| Fase | Linear | Estado | Completada |
|------|--------|--------|------------|
| F0 — Experimentacion Stitch | FRU-10 | Done | 2026-03-30 |
| F1 — Fundamentos del Proyecto | FRU-11 | Done | 2026-03-30 |
| F2 — Catalogo y Busqueda | FRU-12 | In Progress | — |
| F3 — Sistema de Cotizaciones | FRU-13 | Done | 2026-04-03 |
| F4 — Admin Panel Basico | FRU-14 | Backlog | — |
| F5 — Pulido, SEO y Lanzamiento | FRU-15 | Backlog | — |

**Fase activa:** F4 — Admin Panel Basico (F3 cotizaciones entregada; aplicar migracion 003 en Supabase)

---

## Tech stack

| Capa | Tecnologia | Version |
|------|------------|---------|
| Framework | Next.js (App Router, Turbopack) | 16.2.1 |
| Lenguaje | TypeScript | 5.x |
| UI | shadcn/ui + Tailwind CSS | 4.x |
| Iconos | lucide-react | latest |
| BD | Supabase (PostgreSQL 17) | — |
| Auth | Supabase Auth (pendiente F4) | — |
| Storage | Supabase Storage (pendiente F2) | — |
| Hosting | Vercel | — |
| Tests | Vitest (`search-url`, `quote-validation`) + Playwright (pendiente F5) | — |
| State | Zustand + persist (carrito cotizacion) | 5.x |

## Infraestructura

| Recurso | Detalle |
|---------|---------|
| Repo GitHub | `diegoaislasc/RefaccionesAutomotrices` (privado) |
| Proyecto Vercel | `refaccionesautomotrices-pepe` (auto-deploy desde main) |
| URL produccion | https://refaccionesautomotrices-pepe.vercel.app |
| Supabase project | `beligivdpgnybboujazw` (us-east-1) |
| Linear project | Refacciones Automotrices MVP (team: Fruteria) |
| Variables de entorno | `.env.local` (gitignored) — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`; opcional cotizacion/email: `RESEND_API_KEY`, `QUOTE_NOTIFY_EMAIL`, `RESEND_FROM` |

## Base de datos

Esquema aplicado: `supabase/migrations/001_initial_schema.sql`

**Tablas:**
- `categories` — Categorias jerarquicas (parent_id, slug, icon, description)
- `brands` — Marcas (name, slug, logo_url)
- `products` — Productos (name, slug, sku, part_number, price, specs JSONB, search_vector TSVECTOR, images TEXT[])
- `vehicle_compatibilities` — Compatibilidad vehicular (product_id, make, model, year_start, year_end, engine)

**Caracteristicas:**
- Full-text search con `tsvector` + extension `unaccent` + indice GIN
- Trigger `update_product_search_vector` para mantener `search_vector` actualizado
- Trigger `update_updated_at` en todas las tablas
- Row Level Security (RLS) habilitado — politicas de lectura publica
- Seed data: 4 categorias, 6 marcas, 10 productos, 11 compatibilidades

**Migracion 003 (cotizaciones):** `supabase/migrations/003_quotes.sql` — tablas `quotes`, `quote_items`, enum `quote_status`, RLS insert anon/authenticated sin SELECT publico.

**Tipos TypeScript:** `src/types/database.ts` (alineados al esquema + RPC + cotizaciones)

## Archivos clave

| Archivo | Proposito |
|---------|-----------|
| `src/app/layout.tsx` | Layout raiz (Header + Footer + Inter font) |
| `src/app/page.tsx` | Landing (hero + search + category cards desde Supabase) |
| `src/app/globals.css` | Tailwind imports + theme CSS variables |
| `src/components/layout/header.tsx` | Header sticky (logo RA, search, nav) |
| `src/components/layout/footer.tsx` | Footer (copyright, WhatsApp, telefono) |
| `src/lib/supabase/client.ts` | Supabase browser client tipado |
| `src/lib/supabase/server.ts` | Supabase server client con cookies |
| `src/lib/supabase/service.ts` | Cliente service role (confirmacion cotizacion, bypass RLS) |
| `src/stores/quote-cart-store.ts` | Carrito cotizacion (Zustand + localStorage) |
| `src/app/actions/submit-quote.ts` | Server Action envio cotizacion |
| `src/app/cotizacion/page.tsx` | Lista carrito + formulario cliente |
| `src/app/confirmacion/page.tsx` | Folio y resumen (lee BD con service role) |
| `src/lib/quote-validation.ts` | Validacion cliente + parse lineas JSON |
| `src/lib/notify-quote.ts` | Email opcional via Resend |
| `supabase/migrations/003_quotes.sql` | Esquema cotizaciones + RLS |
| `supabase/migrations/004_demo_articulos_cliente.sql` | Seed demo 200 articulos (presentacion cliente) |
| `src/components/ui/button-variants.ts` | Variantes CVA de boton usables en Server Components |
| `.cursor/skills/stitch-design/SKILL.md` | Skill: diseno landings con Stitch MCP (este repo) |
| `.stitch/DESIGN.md` | Tokens + bloque obligatorio para prompts Stitch |
| `.stitch/SITE.md` | Mapa landings / rutas Next vs pantallas Stitch |
| `src/types/database.ts` | Tipos TS generados del esquema |
| `supabase/migrations/001_initial_schema.sql` | Esquema SQL inicial |
| `supabase/migrations/002_search_rpc.sql` | RPC busqueda full-text + filtros |
| `src/app/buscar/page.tsx` | Resultados de busqueda |
| `src/app/producto/[slug]/page.tsx` | Detalle de producto |
| `src/hooks/use-search.ts` | Debounce + sugerencias via RPC |
| `src/components/search/search-bar.tsx` | Buscador hero / header |
| `src/components/search/search-filters.tsx` | Filtros laterales (URL) |
| `src/components/product/product-card.tsx` | Tarjeta en grid |
| `src/components/product/compatibility-table.tsx` | Tabla compatibilidad |
| `src/lib/search-url.ts` | Parseo de query params |
| `src/lib/search-server.ts` | Llamada RPC servidor |
| `docs/stitch-evaluation.md` | Evaluacion de Stitch (F0) |

## Decisiones tomadas

1. **Stitch como referencia visual, no como base de codigo** — El HTML generado por Stitch no es compatible con React/shadcn/ui. Se usa solo para paleta y layout reference.
2. **Supabase SSR con cookies** — Se usa `@supabase/ssr` para manejar auth en Server Components via cookies, no localStorage.
3. **shadcn/ui sin `asChild`** — La prop `asChild` fue removida en versiones recientes de shadcn/ui. Se usan `<a>` con clases Tailwind directamente.
4. **Deploy via CLI + GitHub integration** — El proyecto Vercel esta conectado al repo GitHub para auto-deploy en cada push a main.
5. **Full-text search nativo** — Se usa `tsvector` de PostgreSQL en vez de Algolia/ElasticSearch para mantener la arquitectura simple.

---

## F0 — Experimentacion Stitch (DONE)

**Objetivo:** Explorar Stitch (Google Labs), evaluar si acelera el desarrollo.
**Resultado:** Stitch sirve como referencia visual y para design tokens, pero no genera codigo React utilizable.

| # | Subtarea | Linear | Estado |
|---|----------|--------|--------|
| 0.1 | Crear proyecto en stitch.withgoogle.com | FRU-16 | Done |
| 0.2 | Configurar Stitch MCP en `.cursor/mcp.json` | FRU-17 | Done |
| 0.3 | Probar `generate_screen_from_text` | FRU-18 | Done |
| 0.4 | Evaluar compatibilidad HTML con Tailwind/shadcn | FRU-19 | Done |
| 0.5 | Documentar decision en `docs/stitch-evaluation.md` | FRU-20 | Done |

---

## F1 — Fundamentos del Proyecto (DONE)

**Objetivo:** Proyecto Next.js funcional con BD lista y un producto visible en pantalla.
**Resultado:** Landing deployada en Vercel con categorias cargadas desde Supabase.

| # | Subtarea | Linear | Estado |
|---|----------|--------|--------|
| 1.1 | Init Next.js 16 (TS, Tailwind, App Router, ESLint) | FRU-21 | Done |
| 1.2 | Crear proyecto Supabase, configurar `.env.local` | FRU-22 | Done |
| 1.3 | Instalar shadcn/ui + componentes base | FRU-23 | Done |
| 1.4 | Crear Supabase clients tipados (client.ts + server.ts) | FRU-24 | Done |
| 1.5 | Migracion SQL inicial (categories, brands, products) | FRU-25 | Done |
| 1.6 | Seed data (10 productos de prueba) | FRU-26 | Done |
| 1.7 | Layout base (Header + Footer) | FRU-27 | Done |
| 1.8 | Landing page (hero + buscador + tarjetas categoria) | FRU-28 | Done |
| 1.9 | Push GitHub + deploy Vercel | FRU-29 | Done |

---

## F2 — Catalogo y Busqueda (IN PROGRESS)

**Objetivo:** Un usuario puede buscar una refaccion y ver su detalle completo.
**Criterio de salida:** Buscar "balata ford f-150" muestra resultados filtrados. Click abre detalle completo.

**Infra requerida:** Aplicar en Supabase SQL Editor `supabase/migrations/002_search_rpc.sql` (funciones `search_products` y `count_search_products`). Sin esto, `/buscar` muestra error amigable con instrucciones.

| # | Subtarea | Linear | Estado |
|---|----------|--------|--------|
| 2.1 | Trigger `update_product_search_vector()` (ya en migracion 001) | FRU-30 | Done |
| 2.2 | Hook `useSearch` con debounce 300ms | FRU-31 | Done |
| 2.3 | Componente `SearchBar` (hero + compact) con dropdown | FRU-32 | Done |
| 2.4 | Pagina `/buscar` con grid + paginacion + params URL | FRU-33 | Done |
| 2.5 | Componente `SearchFilters` (categoria, marcas, precio) | FRU-34 | Done |
| 2.6 | Pagina `/producto/[slug]` SSR | FRU-35 | Done |
| 2.7 | Tabla compatibilidad vehicular | FRU-36 | Done |
| 2.8 | Expandir seed data a 50-100 productos reales | FRU-37 | Backlog |
| 2.9 | Tests Vitest (`parseSearchPageParams`) | FRU-38 | Done |
| 2.10 | Commit + deploy Fase 2 | FRU-39 | Done |

---

## F3 — Sistema de Cotizaciones (DONE)

**Objetivo:** Un usuario puede agregar productos a cotizacion y enviarla.
**Criterio de salida:** Flujo buscar-agregar-cotizar-confirmar. Precios en BD al guardar. Email opcional (Resend).
**Infra:** Aplicar `003_quotes.sql` en Supabase. Sin migracion, el envio falla. Confirmacion requiere `SUPABASE_SERVICE_ROLE_KEY` en servidor.

| # | Subtarea | Linear | Estado |
|---|----------|--------|--------|
| 3.1 | Zustand store para carrito (localStorage) | FRU-40 | Done |
| 3.2 | Boton "Agregar a Cotizacion" + badge header | FRU-41 | Done |
| 3.3 | Pagina `/cotizacion` (lista items, totales) | FRU-42 | Done |
| 3.4 | Migracion SQL: `quotes` + `quote_items` con RLS | FRU-43 | Done |
| 3.5 | Formulario de envio cotizacion | FRU-44 | Done |
| 3.6 | Server Action `submitQuote` | FRU-45 | Done |
| 3.7 | Pagina `/confirmacion` | FRU-46 | Done |
| 3.8 | Notificacion al negocio (email) | FRU-47 | Done |
| 3.9 | Tests validacion cotizacion (Vitest) | FRU-48 | Done |
| 3.10 | Commit + deploy Fase 3 | FRU-49 | Done |

---

## F4 — Admin Panel Basico

**Objetivo:** El dueno gestiona productos y cotizaciones sin tocar la BD directamente.
**Duracion estimada:** 3-4 dias.
**Criterio de salida:** Admin puede loguearse, ver cotizaciones, gestionar productos con imagenes.

| # | Subtarea | Linear | Estado |
|---|----------|--------|--------|
| 4.1 | Configurar Supabase Auth (admin login) | FRU-50 | Backlog |
| 4.2 | Middleware proteccion rutas `/admin/*` | FRU-51 | Backlog |
| 4.3 | Layout admin con sidebar | FRU-52 | Backlog |
| 4.4 | CRUD productos (tabla + formulario + imagenes) | FRU-54 | Backlog |
| 4.5 | Dashboard cotizaciones (status workflow) | FRU-53 | Backlog |
| 4.6 | CRUD categorias y marcas | FRU-55 | Backlog |
| 4.7 | Tests de autorizacion | FRU-61 | Backlog |
| 4.8 | Commit + deploy Fase 4 | FRU-57 | Backlog |

---

## F5 — Pulido, SEO y Lanzamiento

**Objetivo:** Sitio listo para produccion.
**Duracion estimada:** 2-3 dias.
**Criterio de salida:** Sitio en dominio propio, catalogo completo, Lighthouse > 80, E2E pasando.

| # | Subtarea | Linear | Estado |
|---|----------|--------|--------|
| 5.1 | SEO: `generateMetadata()` dinamico | FRU-56 | Backlog |
| 5.2 | Sitemap XML + `robots.txt` | FRU-58 | Backlog |
| 5.3 | Optimizar imagenes con `next/image` | FRU-60 | Backlog |
| 5.4 | Revision mobile completa | FRU-59 | Backlog |
| 5.5 | Boton "Consultar por WhatsApp" contextual | FRU-62 | Backlog |
| 5.6 | Paginas 404 y 500 personalizadas | FRU-63 | Backlog |
| 5.7 | Playwright E2E happy path | FRU-64 | Backlog |
| 5.8 | Cargar catalogo completo (100-200 productos) | FRU-65 | Backlog |
| 5.9 | Configurar dominio personalizado Vercel | FRU-66 | Backlog |
| 5.10 | Lanzamiento MVP | FRU-67 | Backlog |

---

## Changelog

| Fecha | Cambio |
|-------|--------|
| 2026-03-30 | Documento creado. F0 y F1 completadas. Vercel deployado con auto-deploy desde GitHub. |
| 2026-04-03 | F2: `/buscar`, `/producto/[slug]`, SearchBar/useSearch, filtros, RPC 002, tests Vitest. Pendiente: aplicar migracion 002 en Supabase, seed masivo, deploy. |
| 2026-04-03 | F3: carrito Zustand, `submitQuote`, `/cotizacion`, `/confirmacion`, migracion `003_quotes.sql`, badge header, Resend opcional, tests `quote-validation`. Aplicar 003 en Supabase y `SUPABASE_SERVICE_ROLE_KEY` en Vercel para confirmacion. |
| 2026-04-04 | Demo cliente: migracion `004_demo_articulos_cliente.sql` (200 productos articulo1..200, SKU DEMO-ART-*). Landing con seccion "Vista previa del catalogo" (12 tarjetas + enlace a `/buscar`). |
| 2026-04-04 | Fix produccion: `buttonVariants` movido a `button-variants.ts` (sin `"use client"`) para evitar 500 en `/` al importar estilos desde Server Components. |
| 2026-04-04 | Skill `stitch-design` en `.cursor/skills/` + carpeta `.stitch/` (DESIGN.md, SITE.md, metadata, designs/) para landings con Stitch MCP. |
