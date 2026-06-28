# Sicon Art Next.js Migration - UX/UI Approval Plan

Date: 2026-06-28

## Current-State Findings

- The current workspace is a WordPress/Elementor automation kit, not a Next.js app yet.
- `projects/siconart/pages/` already contains useful exported page content for home, shop, product, cart, checkout, contact, FAQ, policies, header, and footer.
- The live site has a strong visual direction on the homepage: warm cream paper background, dark umber text, copper CTA color, editorial serif headings, real brush-in-use photography, and simple top navigation.
- The live shop currently shows "No products found matching your criteria", and at least one product URL from the homepage returned a 404 during review. The Next.js catalog should be built from local product data/photos first, then connected to the final commerce source.
- Local product assets exist in `PRODUCTS PHOTO SET/` with 38 brush images covering feature, thumbnail, and variation images.
- `projects/siconart/product-mapping.json` lists 12 parent products plus variations across Chinese Brushes, Detail Brushes, Flat Brushes, Travel Brushes, Urban Sketching Brushes, Wash Brushes, and related categories.
- `shipping-zones.json` contains country-based shipping zone costs that can inform checkout/shipping UI.
- Contact and footer copy needs final verification. Some page exports include placeholder data such as `+1234-567-890` and `info@siconart.com`, while live footer shows `support@siconart.com`.

## Brand Direction

Sicon Art should feel like a premium artist-tool storefront: quiet, tactile, crafted, and practical. The design should keep the current warm traditional brush-making identity but make the e-commerce experience cleaner and more trustworthy.

Core visual tokens:

- Paper background: `#FEF9EF`
- Deep umber: `#523A27`
- Copper / clay CTA: `#A67146`
- Hover copper: `#8B5D3A`
- Ink / near-black: `#17110C`
- Rice-paper light: `#FFFDF7`
- Muted text: `#8B7355`
- Success / WhatsApp green: use sparingly only for WhatsApp or success states

Typography direction:

- Editorial headings: Playfair Display or a similar high-quality serif.
- Interface/body: Poppins, Inter, or Geist Sans. Prefer one clean UI font for all controls.
- Product data and SKU/spec rows: tabular/numeric-friendly sans styling.

Mode support:

- Light mode should be the primary brand experience: paper, ink, copper, real product photography.
- Dark mode should feel like an ink studio: deep umber/black backgrounds, cream text, copper highlights, product images on lifted warm panels.
- Use semantic CSS variables from day one so themes are not duplicated manually.

Language support:

- Build i18n-ready from the start.
- Proposed initial locales: English (`en`) as default and Simplified Chinese (`zh-CN`) as prepared structure.
- Do not machine-translate product/legal text without review. Use translation files and mark missing locale strings clearly during development.

## Information Architecture

Primary navigation:

- Home
- Shop
- Brush Finder
- About
- Journal / Guides
- Contact
- Cart

Recommended pages for phase 1:

- `/` Home
- `/shop` Product listing with filters
- `/shop/[slug]` Product detail
- `/brush-finder` Guided selection flow
- `/about` Brand story and craft process
- `/contact` Contact, wholesale, and custom order requests
- `/faq`
- `/shipping-policy`
- `/return-policy`
- `/privacy-policy`
- `/terms-conditions`
- `/cart`
- `/checkout`
- `/order/track`

Recommended phase 2:

- `/guides` Educational blog index
- `/guides/[slug]` SEO articles
- `/collections/[slug]` curated collection pages
- `/wholesale`
- `/custom-brushes`

## Home Page UX

Hero:

- Keep the current idea: large editorial headline, warm paper texture, real brush-in-use image.
- Improve layout with a balanced two-column composition on desktop and image-first/compact narrative on mobile.
- Primary CTA: "Shop Brushes".
- Secondary CTA: "Find Your Brush".
- Add trust chips near CTA: "Ships worldwide", "Handcrafted Chinese brushes", "Watercolor and sketching".

Homepage sections:

1. Featured products
   - 3 to 4 best sellers with clean cards.
   - Use-case badges such as Detail, Wash, Travel, Sketching.
2. Brush Finder preview
   - Simple three-question guided entry: painting style, brush feel, travel/studio.
3. Craft story
   - Ancient Chinese brush-making tradition adapted for watercolor, urban sketching, and plein air.
4. Collection bands
   - Travel Brushes, Detail Brushes, Wash Brushes, Flat Brushes, Master Grade.
5. Why artists choose Sicon Art
   - Water holding, fine point, snap, handmade craft, natural hair blends.
6. Education/FAQ strip
   - Care instructions, choosing hair type, shipping, returns.
7. Final CTA
   - "Need help choosing?" with Contact and WhatsApp actions.

## Shop UX

The shop should not feel like a default WooCommerce grid. It should feel like an artist-tool selector.

Filters:

- Painting use: Detail, Wash, Line and Wash, Urban Sketching, Travel, Flat.
- Handle type: Travel, Short, Long.
- Hair feel: Soft/absorbent, springy, mixed.
- Skill level: Beginner, Enthusiast, Professional.
- Price range.
- Availability.

Product cards:

- Fixed aspect-ratio image area.
- Product name.
- Short use-case line.
- Price.
- Badges: "Travel", "Detail", "Soft wash", "Best for sketching".
- Quick add where simple product.
- "Choose options" where variable product.
- Wishlist/save later can be phase 2.

Empty states:

- Replace generic "No products found" with useful recovery: clear filters, browse all brushes, or open Brush Finder.

## Product Detail UX

Above the fold:

- Large image gallery with feature and detail shots.
- Product title, price, stock status, variant selector if needed.
- Short description focused on painting outcome.
- Quantity, add to cart, WhatsApp question link.
- Shipping note: "Shipping calculated at checkout" plus country estimator later.

Below the fold:

- Best for: watercolor, sketching, wash, detail, travel.
- Brush characteristics: hair blend, water capacity, point, snap, handle, size.
- How it performs: examples by stroke type.
- Care instructions.
- Shipping and returns accordion.
- Related brushes by use-case, not just category.

Trust badges from current export can become:

- Handmade
- Quality checked
- Natural hair
- Secure checkout
- Support
- Returns

## Cart And Checkout UX

Cart:

- Clear item rows with product image, selected variation, quantity stepper, subtotal.
- Shipping estimator using `shipping-zones.json`.
- Continue shopping and checkout CTAs.
- Add "Need help choosing another brush?" link.

Checkout:

- Two-column desktop, single-column mobile.
- Contact/shipping/payment steps.
- Order summary sticky on desktop.
- Clear customs/import-duty note for international shipping.
- Keep legal/policy links visible near final order action.

Commerce implementation options to approve later:

- Option A: Next.js frontend with WooCommerce as headless backend.
- Option B: Next.js frontend with local product data and Stripe/PayPal checkout.
- Option C: Next.js frontend with Medusa/Saleor or another commerce backend.

For fastest migration from the current site, Option A is likely the least risky because existing products, orders, and admin workflows can remain in WooCommerce while the user-facing site becomes Next.js.

## Mobile UX Rules

- Header becomes compact with logo, cart, and menu.
- Keep CTA buttons thumb-friendly, minimum 44px height.
- Product cards use two columns only if image/text remains readable; otherwise one column.
- Filters open as a bottom sheet with selected-filter chips.
- Product page gallery appears before purchase controls, with sticky add-to-cart bar after scrolling.
- Avoid oversized headings that push product content below the first viewport.

## Deployment Direction

Target VPS stack:

- Next.js App Router.
- TypeScript.
- Tailwind CSS or CSS modules with semantic variables.
- Docker deployment on VPS.
- Reverse proxy with Nginx or Caddy.
- PM2 is acceptable for non-Docker deployment, but Docker is cleaner for repeatable VPS releases.
- Environment files for API endpoints, WooCommerce keys, payment provider keys, analytics, and email service.
- Image optimization strategy: use local optimized assets during build, remote image allowlist for WordPress media if headless WooCommerce is used.

Suggested deployment flow:

1. Build locally and verify.
2. Push to GitHub.
3. VPS pulls release or CI builds Docker image.
4. Run migrations/imports if needed.
5. Restart container.
6. Smoke test home, shop, product, cart, checkout, policies.

## Fresh Project Folder Plan

Do not move existing files until approval.

After approval:

```text
reference/
  elementor-system/
    AGENTS.md
    README.md
    sync.ps1
    plugin/
    templates/
    projects/siconart/
    docs/
    scripts/

apps/
  web/
    app/
    components/
    content/
    data/
    lib/
    messages/
    public/
    styles/
    tests/

docs/
  siconart-nextjs-ux-ui-plan.md
  architecture.md
  deployment.md
  content-model.md

AGENTS.md
README.md
package.json
docker-compose.yml
```

## Approval Questions

1. Should we use WooCommerce as the headless backend for products/orders in phase 1?
2. Should the first public languages be English only, or English plus prepared Chinese routes?
3. Should the new visual design stay close to the current cream/umber/copper identity, or should we introduce a more modern gallery/storefront look?
4. Is WhatsApp a required buying/support channel on the new site?
5. Can we replace placeholder contact details with `support@siconart.com` until final details are confirmed?
