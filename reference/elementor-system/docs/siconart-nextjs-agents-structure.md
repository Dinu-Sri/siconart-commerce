# Proposed AGENTS.md Structure For Sicon Art Next.js

Date: 2026-06-28

This is the proposed replacement structure for the current Elementor-focused `AGENTS.md` after the repo is approved for a fresh Next.js rebuild. Do not overwrite the current file until the existing WordPress/Elementor system is archived under `reference/`.

## Proposed File

```markdown
# Sicon Art Next.js Agent Guide

> Read this first before editing the Sicon Art storefront.

## Mission

Build and maintain the Sicon Art website as a premium Next.js storefront for handcrafted Chinese watercolor and urban sketching brushes. Preserve the brand's warm craft identity while improving product discovery, mobile shopping, performance, accessibility, SEO, and VPS deployment reliability.

## Current Architecture

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS or CSS variables plus component classes
- Commerce backend: to be approved
- Content: local JSON/MDX first, then connected backend where needed
- Deployment: VPS with Docker or approved Node process manager

## Source Of Truth

- UX/UI plan: `docs/siconart-nextjs-ux-ui-plan.md`
- Product data: `apps/web/data/products/`
- Product images: `apps/web/public/products/`
- Translations: `apps/web/messages/`
- Policies: `apps/web/content/policies/`
- Reference WordPress exports: `reference/elementor-system/projects/siconart/`

## Design Rules

- Brand mood: warm paper, ink, copper, handcrafted, premium, calm.
- Use semantic color tokens for light and dark modes.
- Primary light tokens:
  - paper: `#FEF9EF`
  - umber: `#523A27`
  - copper: `#A67146`
  - copper-hover: `#8B5D3A`
  - ink: `#17110C`
- Build real storefront screens, not marketing-only placeholders.
- Product images must use stable aspect ratios to avoid layout shift.
- Use real product/category data when available.
- Avoid generic WooCommerce-looking grids.
- Cards should be restrained and functional; do not nest cards inside cards.
- Mobile layouts must be checked at 390px and 430px widths before handoff.

## UX Rules

- Shop filters should help artists choose by use-case, handle type, hair feel, skill level, price, and availability.
- Product pages must show image gallery, price, variants, add-to-cart, shipping note, use-case specs, care guidance, and related brushes.
- Cart and checkout must be simple, trustworthy, and mobile-first.
- Empty states must offer recovery actions.
- Keep WhatsApp/contact paths available for custom or wholesale questions if approved.

## Language And Content Rules

- Default locale: English.
- Prepare `zh-CN` structure if approved, but do not invent translations for legal/product content.
- Use plain ASCII in source files unless existing content requires Chinese product/brand marks.
- Keep policy and contact details evidence-based.
- Do not publish placeholder phone numbers or emails.

## SEO Rules

- Keep clean metadata for every product, collection, policy, and guide page.
- Use structured data for Product, BreadcrumbList, Organization, FAQPage, and Article where applicable.
- Product pages should have descriptive alt text and canonical URLs.
- Preserve useful content from the WordPress exports, but rewrite placeholder/demo copy.

## Implementation Rules

- Prefer small, typed components.
- Keep commerce logic in `lib/commerce/`.
- Keep product transforms/importers in `scripts/`.
- Keep UI primitives in `components/ui/`.
- Keep storefront components in `components/storefront/`.
- Do not hardcode secrets or API keys.
- Environment variables belong in `.env.local` and documented `.env.example`.
- Do not edit reference exports except to add notes.

## Verification

- Run lint/typecheck/build before final handoff when available.
- Visually verify home, shop, product detail, cart, checkout, and mobile menu.
- Check light and dark mode.
- Check empty product/filter state.
- Check at least one variable product and one simple product.

## Git And Deployment

- Use feature branches with `codex/` prefix unless instructed otherwise.
- Update `README.md` when commands, deployment, or architecture changes.
- For VPS release changes, update `docs/deployment.md`.
- Never expose WooCommerce, payment, email, or server secrets in commits.
```
*** End Patch
