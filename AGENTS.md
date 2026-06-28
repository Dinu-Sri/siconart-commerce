# Sicon Art Next.js Agent Guide

> Read this first before editing the Sicon Art storefront.

## Mission

Build and maintain Sicon Art as a premium Next.js commerce site for handcrafted Chinese watercolor and urban sketching brushes. Preserve the warm craft identity from the current site while improving product discovery, mobile shopping, performance, accessibility, SEO, and VPS deployment reliability.

## Architecture

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS with semantic CSS variables
- Translation: `next-intl`, matching the Sinours pattern
- Locales: `en`, `zh`
- Commerce backend: Prisma + Postgres owned by this app
- Deployment: Docker standalone app + Postgres, GHCR image, Portainer stack
- Direct test port: host `3224` to container `3225`
- Cloudflare Tunnel: disabled by default, enabled later with env/profile

## Source Of Truth

- UX/UI plan: `docs/siconart-nextjs-ux-ui-plan.md`
- Deployment: `DEPLOY.md`
- Product seed data: `src/data/products.ts`
- Product images: `public/products/`
- Brand assets: `public/brand/`
- Translations: `messages/en.json`, `messages/zh.json`
- Commerce schema: `prisma/schema.prisma`
- Old WordPress/Elementor reference: `reference/elementor-system/`

## Design Rules

- Brand mood: warm paper, ink, copper, handcrafted, premium, calm.
- Primary light tokens:
  - paper: `#FEF9EF`
  - umber: `#523A27`
  - copper: `#A67146`
  - copper hover: `#8B5D3A`
- Keep light mode as the main brand experience.
- Dark mode should feel like an ink studio, not a generic dark SaaS UI.
- Use real product photography and stable image aspect ratios.
- Avoid generic WooCommerce-looking grids.
- Build actual store screens, not marketing-only placeholders.
- Mobile layouts must remain useful at 390px and 430px widths.

## UX Rules

- Shop filters should help artists choose by use-case, handle type, hair feel, skill level, price, and availability.
- Product detail URLs should use `/products/[slug]`; keep `/shop/[slug]` as a redirect-only compatibility path.
- Default English URLs must be flat, e.g. `/shop` and `/products/slug`; Chinese remains under `/zh`.
- Product pages must show image gallery, price, variants, add-to-cart, shipping note, use-case specs, care guidance, and related brushes.
- Empty states must offer recovery actions.
- Cart and checkout should be clear, trustworthy, and mobile-first.
- Keep contact paths available for custom, wholesale, and product-selection questions.

## Translation Rules

- Follow the Sinours structure:
  - `src/i18n/routing.ts`
  - `src/i18n/request.ts`
  - `src/middleware.ts`
  - locale routes under `src/app/[locale]`
  - messages in `messages/*.json`
- Do not invent final legal or product translations when business review is needed.
- Keep message keys stable across languages.

## Commerce Rules

- Do not use WooCommerce for the new system.
- Keep product, cart, checkout, order, and contact logic in this app.
- Storefront has a `$100` minimum order strategy and worldwide shipping notice.
- Product image panels should stay white so product cutouts do not sit on beige/yellow backgrounds.
- The shop page should remain a clean product grid with left-side price/category checkbox filters, not a marketing page.
- Brush Finder has been removed from navigation; use Become an Agent for wholesale/agent leads.
- Header logo, footer logo, favicon, hero image, line-art background, and decorative flower images should come from `public/brand/`.
- Footer must expose the full support/legal set: About, FAQ, Shipping Policy, Return & Exchange Policy, Track Your Order, Privacy Policy, Terms & Conditions, Contact, Shop, and Become an Agent.
- Header cart icon should show the local cart item quantity badge.
- Admin login is env-based. Never commit the real admin email/password; configure `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in Portainer.
- Keep `ADMIN_COOKIE_SECURE=false` for direct IP/http testing. Change it to `true` only after HTTPS is active.
- Payment provider integration is not final yet; keep the schema/provider boundary clean.
- PayHere env keys are `PAYHERE_MERCHANT_ID`, `PAYHERE_MERCHANT_SECRET`, `PAYHERE_CURRENCY`, and `PAYHERE_SANDBOX`.
- Never commit secrets, payment keys, tunnel tokens, or database passwords.
- Product prices in the current seed are draft values until verified.

## Verification

Before handoff when dependencies are installed:

- `npm run typecheck`
- `npm run build`
- verify `/`, `/zh`, `/shop`, at least one product page, cart, checkout, and mobile navigation
- check light and dark mode

## GitHub And Deployment

- Pushes to `master` build `ghcr.io/dinu-sri/siconart-app:latest`.
- Update `README.md` and `DEPLOY.md` when commands, ports, architecture, or deployment behavior changes.
- Use `codex/` branch prefix unless the user asks otherwise.
