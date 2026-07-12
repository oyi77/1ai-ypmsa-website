# YPSMA Website — Data Layer Audit for Astro Migration

## Critical Finding

**This is NOT a React SPA.** It is a traditional multi-page HTML/CSS/JS site deployed on Cloudflare Pages.
- **No `src/data/` directory exists**
- **No `src/index.ts` exists**
- **No React components exist**
- All data is embedded inline in HTML files as hardcoded content

The audit below maps the ACTUAL data layer and prescribes Astro equivalents.

---

## Project Structure

| Aspect | Detail |
|---|---|
| Architecture | Multi-page static HTML + CSS + vanilla JS |
| Deployment | Cloudflare Pages (static) + Express server (registration/email/chat) |
| Domains | ypsma.or.id, ypsma.org |
| HTML pages | 20 files |
| CSS files | 8 (split across 3 design systems) |
| JS files | 2 (behavioral only, no data layer) |
| Landing pages | 8 donation campaign pages |
| Blog articles | 4 long-form articles |
| API endpoints | 1 CF Pages Function + Express server |

---

## Data Extraction Map

### 1. index.html (root) — Homepage

| Data Item | Type | Static? | Fields | Astro Approach |
|---|---|---|---|---|
| Navigation | Config | Yes | label, href, external | `src/config/navigation.ts` |
| Programs (3 cards) | Static Content | Yes | name, age_range, description, features[], icon, link | `src/data/programs.ts` |
| Events (3 cards) | Static Content | Yes | title, category, date, image, description, time, location | `src/data/events.ts` |
| Stats | Config | Yes | value, label, icon | `src/data/stats.ts` |
| PPDB Banner | Config | Yes | title, description, cta_label, cta_link | `src/config/site.ts` |

**Route:** `/` (single page, no slug generation)

---

### 2. public_html/tentang-kami.html — About Page

| Data Item | Type | Static? | Fields | Astro Approach |
|---|---|---|---|---|
| History | Static Content | Yes | paragraphs[] | `src/data/about.ts` or `src/content/about/` Markdown |
| Vision/Mission | Static Content | Yes | vision_text, mission_items[] | `src/data/about.ts` |
| Team (4 members) | Static Content | Yes | name, role, photo, description | `src/data/team.ts` |
| Facilities | Static Content | Yes | name, icon, description | `src/data/facilities.ts` |

**Route:** `/tentang-kami`
**Note:** Self-contained page with 698 lines of inline `<style>` CSS — different design system from root.

---

### 3. public_html/kelas-kami.html — Programs Page

| Data Item | Type | Static? | Fields | Astro Approach |
|---|---|---|---|---|
| Programs (detailed) | Static Content | Yes | name, curriculum, schedule, features[], fees | `src/data/programs.ts` (shared) + detail Markdown |

**Route:** `/kelas-kami`
**Overlap:** Duplicates program data from root `index.html` — must deduplicate in migration.

---

### 4. public/blog/*.html — Blog Articles (4 files)

| Data Item | Type | Static? | Astro Approach |
|---|---|---|---|
| Articles | Content, Route-generating | Yes | **Content Collection** ← BEST FIT |

**Route:** `/blog/{slug}` (4 slugs)
**Articles:**

| Slug | Title | Category | Date |
|---|---|---|---|
| `ramadan-2027-santri-penghafal-quran` | 40+ Santri Penghafal Quran Butuh Dukungan Ramadan 2027 | Kampanye Ramadan | 9 Juli 2026 |
| `beasiswa-santri-jombang` | Beasiswa Santri Jombang GRATIS: Program Adopsi untuk Anak Petani | Program Beasiswa | 14 Juli 2026 |
| `yayasan-pendidikan-jombang` | Yayasan Pendidikan Jombang: Visi dan Misi Pendidikan Islam | Profil Yayasan | 10 Juli 2026 |
| `wakaf-pendidikan-vs-sedekah` | Wakaf Pendidikan vs Sedekah: Mana yang Lebih Berdampak? | Edukasi Wakaf | 10 Juli 2026 |

**Astro:** `src/content/blog/` as Markdown/MDX with YAML frontmatter (title, description, category, date, author, image, tags[], schema).

---

### 5. public/blog/index.html — Blog Listing

**Route:** `/blog`
**Astro:** Auto-generate from Content Collection using `getCollection('blog')`.

---

### 6. public/lp-*.html — Donation Landing Pages (8 files)

| Data Item | Type | Static? | Astro Approach |
|---|---|---|---|
| Campaigns | Content, Route-generating | Yes | **Content Collection** ← BEST FIT |

**Route:** `/campaigns/{slug}` (8 slugs)

| Slug | Title | Target |
|---|---|---|
| `lp-sedekah-pangan` | Sedekah Pangan | Rp 150jt/bulan |
| `lp-sedekah-sembako` | Sedekah Sembako | — |
| `lp-sedekah-sehat` | Sedekah Sehat | — |
| `lp-beasiswa` | Beasiswa | — |
| `lp-beasiswa-santri` | Beasiswa Santri | — |
| `lp-patungan-listrik` | Patungan Listrik | — |
| `lp-wakaf-sumur` | Wakaf Sumur | — |
| `lp-titip-doa` | Titip Doa | — |
| `lp-ramadan` | Ramadan | — |

**Frontmatter:** title, slug, target_amount, description, og_image, structured_data, enabled
**Shared elements:** Donation form, Midtrans Snap, WhatsApp CTA, Progress bar, FAQ, Testimonials

---

### 7. public/partner.html — Partnership Page

**Route:** `/partner`
**Astro:** `src/pages/partner.astro` with `src/data/partners.ts`

---

### 8. public/donate-success.html — Success Page

**Route:** `/sukses`
**Astro:** `src/pages/sukses.astro` (simple static)

---

### 9. public/admin.html — Admin Dashboard

**Route:** `/admin`
**Status:** DYNAMIC — requires auth + API calls
**Astro:** Keep as separate app or use Astro SSR. **NOT suitable for SSG.**

---

### 10. js/main.js — Client-Side Data

| Data Item | Type | Astro Approach |
|---|---|---|
| Month names (Indonesian) | Config | `src/utils/dates.ts` |
| Program filter logic | Behavior | Alpine.js or Astro build-time |
| Contact form | Behavior (simulated!) | Needs real API endpoint |
| Scroll animations | Behavior | CSS animations or View Transitions |
| Calendar events | Behavior | Data from `data-events` attribute (currently empty) |

---

### 11. functions/api/donate.js — Payment API

**Route:** `POST /api/donate`
**Astro:** `src/pages/api/donate.ts`
**Secrets:** MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, MIDTRANS_ENV

---

### 12. server.js — Express Server

| API | Route | Astro Migration |
|---|---|---|
| Registration | POST /api/register | `src/pages/api/register.ts` |
| Email templates | N/A | `src/utils/email-templates.ts` |
| Live chat | Socket.io | **CANNOT SSG** — keep as separate service |
| Admin registrations | GET /api/admin/registrations | `src/pages/api/admin/registrations.ts` |

---

### 13. Configuration Files

| File | Type | Astro Approach |
|---|---|---|
| `public/sitemap.xml` | SEO Config (22 routes) | `@astrojs/sitemap` integration |
| `public/_redirects` | URL Redirects | `astro.config.mjs` redirects option |
| JSON-LD Structured Data | SEO | `src/utils/seo.ts` — typed objects |

**JSON-LD schemas found:** Organization, DonateAction, FAQPage, WebPage, BreadcrumbList, EducationalOrganization, Course, Article

---

## Data Sharing Analysis

### Cross-Page Duplicates

| Data | Duplicated In | Migration Benefit |
|---|---|---|
| Navigation links | index.html, tentang-kami.html, kelas-kami.html, partner.html | **HIGH** — shared Astro Navbar component |
| Footer content | All HTML files | **HIGH** — shared Astro Footer component |
| Program data (TK, SD, SMP) | index.html, kelas-kami.html | **HIGH** — single `src/data/programs.ts` |
| CSS variables | css/main.css + 4+ inline `<style>` blocks | **MEDIUM** — centralize `tokens.css` |

### Circular Dependencies
None — the project has no module system, so no import cycles exist.

### Optimal Load Order
No JS module loading — all scripts are DOMContentLoaded event listeners. In Astro:
1. Layout loads shared CSS
2. Page component imports data (build time)
3. Frontmatter runs at build time
4. Client scripts load at bottom

---

## Content Collections Recommendation

### ✅ Best Candidates (use Content Collections)

| Collection | Location | Frontmatter Fields | Why |
|---|---|---|---|
| `blog` | `src/content/blog/` | title, description, category, date, author, image, tags[], draft | Auto-generated index, RSS, tag filtering, type-safe queries |
| `campaigns` | `src/content/campaigns/` | title, slug, target_amount, description, og_image, structured_data, enabled | Consistent donation pages from single template |

### ❌ Does NOT Need Content Collections

| Data | Location | Why |
|---|---|---|
| Navigation | `src/config/navigation.ts` | Config, not content |
| Stats | `src/data/stats.ts` | Tiny, numeric |
| Programs | `src/data/programs.ts` | Structured data, no Markdown body |
| Events | `src/data/events.ts` | Cards, no body |
| Facilities | `src/data/facilities.ts` | Icon + text |
| Team | `src/data/team.ts` | Only 4 entries |
| Site config | `src/config/site.ts` | Metadata |

---

## Migration Priority Order

| Phase | Task | Files |
|---|---|---|
| 1 | Extract shared components + site config | `src/config/site.ts`, `src/config/navigation.ts`, `src/layouts/BaseLayout.astro` |
| 2 | Extract static data from HTML | `src/data/programs.ts`, `src/data/team.ts`, `src/data/events.ts`, `src/data/facilities.ts`, `src/data/stats.ts` |
| 3 | Create Content Collections | `src/content/blog/*.md`, `src/content/campaigns/*.md`, `[slug].astro` pages |
| 4 | Build static pages | `src/pages/index.astro`, `tentang-kami.astro`, `kelas-kami.astro`, `partner.astro` |
| 5 | Migrate API routes | `src/pages/api/donate.ts`, `src/pages/api/register.ts` |
| 6 | SEO layer | `src/utils/seo.ts`, `astro.config.mjs` with `@astrojs/sitemap` |

---

## Totals

| Metric | Count |
|---|---|
| Data items to extract | 47 |
| Static pages | 15 |
| Dynamic endpoints | 5 |
| Content Collections | 2 (blog, campaigns) |
| Shared config files | 6 |

---

## ⚠️ Warnings

1. **Two design systems:** Root `index.html` uses `css/main.css` (Plus Jakarta Sans, Tailwind-like). `public_html/` pages use Inter + inline styles with different color variables. Must unify before migration.

2. **Inline CSS bloat:** 8 landing pages each have ~500+ lines of inline `<style>`. Extract shared styles to component library first.

3. **Inconsistent canonical URLs:** Some point to `ypsma.org`, others to `ypsma.or.id`. Fix during migration.

4. **Simulated contact form:** `js/main.js` contact form uses `setTimeout` — no real API. Needs real endpoint.

5. **Live chat requires persistence:** `server.js` uses Express + Socket.io. This **CANNOT be SSG'd** — must remain as separate service or be replaced.

6. **Empty events data:** Calendar events are loaded from `data-events` HTML attribute but no HTML file currently provides this data.
