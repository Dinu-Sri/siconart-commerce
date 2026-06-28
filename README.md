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
- Optional Cloudflare Tunnel service, disabled until env is added

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
```

Later, enable Cloudflare Tunnel with:

```text
COMPOSE_PROFILES=tunnel
CF_TUNNEL_TOKEN=<token>
```

Then update `NEXT_PUBLIC_BASE_URL` and `APP_URL` to the final tunnel/domain URL.

## Reference Files

The old WordPress/Elementor system is preserved under:

```text
reference/elementor-system/
```

The old WordPress API key in `reference/elementor-system/config/sites.json` was redacted for GitHub safety.

## Current Scaffold

- Home
- Shop
- Product detail
- Brush Finder
- About
- Contact
- FAQ
- Cart
- Checkout
- Shipping and return policy placeholders
- Local Sicon product catalog seed
- Product images in `public/products`
- Commerce API route stubs for cart pricing, contact, and checkout

## Notes

Product prices are draft seed values until final pricing is confirmed from the old workbook or business source of truth.
