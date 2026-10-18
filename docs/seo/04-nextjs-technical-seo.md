# Next.js technical SEO specification

Baseline uses Next.js `^15.3.4`, React 19, next-intl and Prisma/Postgres. Review the resolved installed version and supported security release separately; do not blindly copy APIs from a newer Next.js major. This specification introduces proposed modules rather than claiming they exist.

## Shared public read contract

Create a server-only `src/lib/catalog/public-product.ts` (proposed) that returns a deliberately allowlisted public DTO. It may wrap the existing `getStorefrontProduct(s)` resolver, but must not serialize the private price-list model. Include only approved retail fields. Audit client imports: `shop-listings.ts` currently imports private price-list data for names; `shop-catalog.tsx` imports category constants from the same module. Move public names and category constants to a public module and verify bundles, RSC payloads and generated exports contain no private commercial values.

Use one resolved retail snapshot per request across metadata, HTML, JSON-LD and Markdown. Memoize within the request using supported React/Next patterns; do not introduce persistent caching accidentally. Cart remains server repriced. A real price/availability change invalidates all public representations and feed caches together.

Existing DB override failure falls back to seeds. Define explicit behavior: return a monitored temporarily unavailable offer state or trusted last-known-good snapshot under a documented freshness limit; otherwise serve informational content with purchasing disabled and suppress invalid feed rows. Do not emit inaccurate offers simply to avoid an error. Retain useful product identity on the page.

## Metadata contract

Add `generateMetadata` to product and collection routes; static metadata or builders for other public routes. Ensure unknown slugs follow the same notFound path as page rendering.

| Field | Requirement |
|---|---|
| title | Unique descriptive product/collection/article title; include brand once through template. Keep readable, not a keyword list. |
| description | Actual differentiating verified attributes and suitability. Avoid stale price claims and unsupported superlatives. |
| metadataBase | Approved HTTPS origin from validated configuration. Fail production build/config validation on missing/localhost origin. |
| alternates.canonical | Absolute preferred URL; strip tracking/facet parameters according to ownership policy. |
| Open Graph/Twitter | Page-specific title, description and absolute product/article image; appropriate type where supported. |
| robots | Index intended public pages, noindex utility/preview pages; avoid inherited noindex on store pages. |

Example title direction: `Chi Ling Travel Brush for Watercolor | Sicon Art`; a layout using a dot separator can retain that established convention. Do not append the brand twice. Character counts are editorial heuristics, not guaranteed display limits or ranking rules.

Default English URLs remain flat. Do not activate `/zh`, hreflang alternates or language switching while Chinese is paused. Verify `/en/...` normalization and `/zh` behavior against current routing; do not publish alternates pointing to non-existent translated pages.

Next 15 supports streamed metadata behavior. Test both ordinary and HTML-limited crawler user agents using the installed version. Verify metadata in what crawlers actually receive; do not assume a generic curl snapshot always represents a search crawler.

## Crawl routes and status behavior

Add `src/app/sitemap.ts` (proposed), listing only public canonical 200 HTML pages, approved products, collections and published articles. Exclude utility, redirect, facet, preview and Markdown alternate URLs. Use genuine content modification dates; omit lastModified if unknown instead of setting every URL to deployment time. Include images where supported and useful. A single sitemap is enough for this catalog; split only when scale justifies it.

Extend existing `src/app/robots.ts` with absolute sitemap URL. Do not block `/_next/` assets needed for rendering. Robots is crawl guidance, not authentication or reliable removal from search. A blocked page may still have its URL indexed; allow crawling of a noindex directive where deindexing is needed, and use actual authentication for private material. Scope rules carefully across flat English and locale compatibility routes.

Use `permanentRedirect` or explicit server redirect configuration for retired equivalent aliases. Collapse legacy shop → legacy product → canonical product chains into one hop where possible. Preserve old size-specific links by selecting the exact SKU. Unknown products must return a true 404; do not redirect all unknown requests to shop or return a 200 empty template. Do not map an old pair set to a single brush without reviewing equivalence.

Keep policy URL duplicates consolidated. Noindex cart, checkout, thank-you, tracking and internal previews, and retain existing list protections. Noindex is not authorization. Ensure order URLs/responses never expose another customer's order.

## Semantic HTML and product usability

Use one clear main page heading; meaningful heading nesting; `main`, `article`, `nav` and `section` where appropriate. Add the missing shop H1 compactly. Put product specifications in `dl` or a properly headed table. Breadcrumbs need human-readable links as well as schema. Collection/product links must be real anchors usable without JS.

Server-render selected variant name, price, image and initial cart SKU from a validated query parameter. Update the URL on variant selection. Handle invalid SKUs deliberately; do not quietly advertise the wrong variant. Preserve keyboard access and selected state. Keep product copy visible in HTML, with accordions used only for supporting detail.

Provide image metadata per view: descriptive alt when informative, empty alt when decorative/redundant, visible captions for test conditions. Do not hide dimensions or specifications solely in raster images. Keep actual measurements in text too.

## Performance and VPS

Measure before claiming improvement. Target field p75 Core Web Vitals on relevant traffic: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1. A new/low-traffic site may lack field data; use mobile lab diagnostics while waiting, clearly labelled lab results.

- Retain correctly sized Next Image output, responsive sizes and reserved aspect ratios. Prioritize only genuine LCP media; lazy-load below-fold galleries. Article images need intrinsic dimensions and a purpose.
- Avoid large client libraries for blog prose. Render articles on server; hydrate only interactive tools that improve the task. Defer Instagram content and optional embeds with lightweight accessible fallbacks.
- Inspect font requests, hero resource waterfall, JS payload and image weight; do not invent a performance score. Use existing Inter/Playfair and semantic tokens unless a design review changes them.
- Current product/shop routes are force-dynamic. Avoid database waterfall and repeated full catalog/FS image reads; measure then memoize/precompute safe public image manifests. Do not statically freeze live retail offers.
- Check redirects for HTTP/www/trailing slash, TLS, gzip/Brotli where supported, static asset headers, origin stability and bot/WAF handling. Repo nginx.conf is not proof of active VPS configuration. Its cache directives do not prove a working proxy cache zone exists.
- Never cache carts, personalized pages, admin, checkout or private exports publicly. Test price-cache invalidation and response headers on every host layer.

## Deployment checks

Follow AGENTS: GitHub Actions builds GHCR image; Portainer pulls it. No VPS compilation. Configure the HTTPS origin for the build argument and runtime as needed; Next public environment values can be build-time inlined. Verify the produced image's pages, not just Portainer's env display.

Add checks for valid origin, sitemap uniqueness, route status, noindex exclusions, schema parsing, public-data boundary and variant consistency. Run typecheck and build on the implementation branch with safe test data. `npm run lint` currently uses `next lint`; verify compatibility with resolved dependencies before adding it as a required CI gate. This audit did not install dependencies or run application tests because no application code was changed.
