# Sicon Art Commerce

Next.js storefront and commerce backend for Sicon Art, built to replace the current WordPress/WooCommerce site with a VPS-hosted stack.

## Stack

- Next.js 15 App Router
- TypeScript
- `next-intl` locale routing copied from the Sinours project pattern
- Tailwind CSS with semantic light/dark theme tokens
- Prisma + Postgres commerce backend
- Docker standalone deployment
- GHCR image publishing through GitHub Actions
- Cloudflare Tunnel service for domain access through `CF_TUNNEL_TOKEN`

## Local Development

```powershell
docker compose -f docker-compose.dev.yml up -d
Copy-Item .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

App: `http://localhost:3000`

## VPS/IP Deployment

The production compose file exposes:

- Host `3224`
- Container `3225`

Set these in Portainer:

```text
DB_PASSWORD=<strong password>
NEXT_PUBLIC_BASE_URL=http://<VPS-IP>:3224
APP_URL=http://<VPS-IP>:3224
ADMIN_EMAIL=<admin email>
ADMIN_PASSWORD=<admin password>
ADMIN_SESSION_SECRET=<long random secret>
ADMIN_COOKIE_SECURE=false
PAYHERE_MERCHANT_ID=<payhere merchant id>
PAYHERE_MERCHANT_SECRET=<payhere merchant secret>
PAYHERE_CURRENCY=USD
PAYHERE_SANDBOX=false
```

Enable Cloudflare Tunnel with:

```text
CF_TUNNEL_TOKEN=<token>
```

Then update `NEXT_PUBLIC_BASE_URL` and `APP_URL` to the final tunnel/domain URL and redeploy the stack.

## Reference Files

The old WordPress/Elementor system is preserved under:

```text
reference/elementor-system/
```

The old WordPress API key in `reference/elementor-system/config/sites.json` was redacted for GitHub safety.

## Current Scaffold

- Home
- Shop
- Product detail URLs under `/products/<slug>` with old `/shop/<slug>` redirects
- Product detail
- Become an Agent
- About
- Contact
- FAQ
- Cart
- Checkout
- Shipping and return policy placeholders
- Local Sicon product catalog seed
- Product images in `public/products`
- Public shop products now use the master price sheet product names, retail prices, and feature images only.
- Product seeding reconciles existing rows by SKU or slug so master-sheet SKU changes can reuse public product URLs without crashing on unique slug conflicts.
- Cart pricing with $100 minimum-order progress
- Discount code support seeded with `WELCOME10`
- Admin dashboard for products, categories, discounts, orders, and agent leads
- Commerce API route stubs for cart pricing, contact, and checkout
- Brand assets served from `public/brand`, including header/footer logos, favicon, hero photo, line art, and section flowers.
- Footer now links to About, FAQ, shipping, return/exchange, privacy, terms, track order, contact, shop, and agent pages.
- Home page includes the founder/craft story flow, Experience the Craft cards, artist testimonials, and FAQ preview.
- Header cart icon shows the current local cart item count.
- PayHere checkout creates local orders, signs the PayHere payload on the server, and receives payment notifications at `/api/payhere/notify`.
- Public storefront is currently English-only with the language switcher hidden.
- Private price list at `/list` is sourced from the master price sheet data, shows editable product cards with image preview, name, retail price, artist price, wholesale price, and MOQ. It hides normal header/footer, stores confirmed edits and versions in the browser, asks for confirmation before applying price/MOQ changes, and uses password `tina`.

## Admin

Admin is available at:

```text
/admin
```

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in Portainer before using it. Do not commit real admin credentials.

## Changelog

- 2026-06-28: Added conversion shop updates, announcement strip, cart minimum progress, discount codes, agent page, and commerce admin dashboard.
- 2026-06-28: Fixed admin env passthrough for Portainer IP testing and added new Sicon Art homepage brand imagery.
- 2026-06-28: Moved product detail URLs from `/shop/<slug>` to `/products/<slug>` and widened the shop grid.
- 2026-06-28: Switched default English URLs to flat paths, refined homepage art direction, and added PayHere checkout.
- 2026-06-28: Added full footer support links, exact policy highlights, cart quantity badge, homepage craft/testimonial/FAQ sections, and redesigned checkout summary.
- 2026-07-04: Added password-protected `/list` product price list and temporarily switched public routing to English-only.
- 2026-07-07: Promoted master-sheet product names, retail prices, and feature images into the public storefront catalog without exposing artist, wholesale, or MOQ fields.
- 2026-07-07: Fixed production seed reconciliation for master-sheet SKU changes that reuse existing product slugs.

## Notes

Product prices are draft seed values until final pricing is confirmed from the old workbook or business source of truth.
