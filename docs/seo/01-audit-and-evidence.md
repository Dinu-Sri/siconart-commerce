# Audit and evidence

Audit date: 18 October 2026. Baseline commit: `97f9bcbd758719b2d1270d73f2b068b83f2aa64f`. Code references below are relative to the repository root. To inspect that exact version, use `https://github.com/Dinu-Sri/siconart-commerce/blob/97f9bcbd758719b2d1270d73f2b068b83f2aa64f/<path>`.

## Scope and confidence

Inspected repository routes, metadata, product catalog, pricing resolver, cart pricing, image resolution, schema, navigation/filter components, robots handler, Docker and build workflow. Read public homepage, shop, FAQ, About, and selected product pages through web retrieval. The live shop retrieval returned 60 listings; older search snapshots returned 47, illustrating why cached snippets cannot establish current inventory.

Direct HTTP requests from this environment to robots.txt, sitemap.xml, and llms.txt returned 403; the web retrieval tool could not access those endpoints either. This does NOT prove that the website returns 403 to Googlebot or normal visitors, or that the files are absent in production. Their deployed responses require independent validation. Repository absence and deployed absence are separate findings.

Not performed: authenticated Search Console/Merchant Center/analytics audit, production database inspection, end-to-end checkout, measured Core Web Vitals, rendered visual/mobile audit, exhaustive crawl, server log inspection, or proof that production runs this exact commit. Do not label this a complete production certification.

## Findings

| ID | Priority | Evidence and current behavior | Required outcome |
|---|---|---|---|
| A01 | P0 | `src/data/product-social-proof.ts` derives rating and sold counts from SKU hashes. `home-v2/page.tsx` enables these through ProductCard; home-v2 is currently noindex. | Remove generated claims from any publishable UI and all structured outputs; replace only with verified records. |
| A02 | P0 | Homepage `src/app/[locale]/page.tsx` hard-codes 4.9/250+ review claim. Testimonials are static objects in `testimonials-carousel.tsx`; their authenticity is unverified. | Owner verifies review evidence and permissions; remove unsupported totals/testimonials. Never infer authenticity from a source file. |
| A03 | P0 | Public catalog seed plus DB price overrides drive `live-prices.ts`; `price-list-overrides.ts` silently returns empty overrides on DB errors. | Define authoritative public retail projection, observability and safe failure behavior; prevent stale fallback offers/feed prices during outages. |
| A04 | P1 | Product route has no `generateMetadata`. Layouts supply generic titles/descriptions. No canonical/OG product logic found. | Unique metadata and canonical per indexable page using approved public data. |
| A05 | P1 | No JSON-LD implementation found in inspected source. | Shared schema builders for products, variants, breadcrumbs, organization, and articles. |
| A06 | P1 | `src/app/robots.ts` exists but lacks sitemap declaration. No sitemap implementation found in the tree. | Add sitemap and verify deployed crawl endpoints. |
| A07 | P1 | Layout metadataBase falls back to localhost; Docker build arg also defaults to localhost. GH workflow passes a repository variable whose configured value was not inspected. | Require correct production origin at build/runtime boundaries and test final HTML. |
| A08 | P1 | `shop/[slug]/page.tsx` and product alias resolution use Next `redirect`. | Permanent, direct redirects for genuine equivalent legacy URLs; preserve variant identity when relevant. Verify HTTP status. |
| A09 | P1 | Shop has filters, but no dedicated crawlable collection routes. `shop-catalog.tsx` has no main shop H1. | Compact shop H1 and curated collection pages; preserve the existing clean grid. |
| A10 | P1 | Product type has currency and prices but no explicit public inventory lifecycle, verified-material status, identifiers, measurement semantics or SEO fields. | Add typed public attributes and approval provenance without exposing wholesale fields. |
| A11 | P1 | `prisma/schema.prisma` contains ProductStatus, but storefront products come from static catalog plus overrides, not a query filtering Product rows by that status. | Explicitly align publication/availability rules across catalog, cart, feeds, markdown, and sitemap. |
| A12 | P1 | Only 7/53 parent records have a `specs.Hair` field; most descriptions repeat category templates. Accessories even inherit brush-oriented handle/feel fields. | Enrich priority SKUs with verified differentiating facts; use accessory-specific specs. |
| A13 | P1 | Variant buttons use client state initialized to first variant. Cards for multiple variant SKUs link to the same parent without selection. | Stable variant URLs that server-select the advertised SKU, image, price, and cart selection. |
| A14 | P1 | `src/data/shipping.ts` has destination rates, 1 kg limit and temporary 50 g/item estimate. | Confirm measured weights and real delivery ranges before publishing shipping schema/feed claims. |
| A15 | P2 | No blog routes/content model/author system found. | Build an original editorial system with semantic, accessible, evidence-based visuals. |
| A16 | P2 | No llms.txt or public Markdown route implementation found. | Optional generated discovery layer after HTML and retail-data contracts pass. |
| A17 | P2 | `/return-policy` and `/return-exchange-policy` render same page through re-export. | Choose the latter as canonical policy URL to match current support navigation; redirect the former permanently. |
| A18 | P1 | robots disallows list/admin/API, but only list routes have explicit global noindex headers in next.config.ts. | Inventory cart, checkout, confirmation, tracking, admin and internal routes; add appropriate noindex and access controls. |
| A19 | P2 | Image gallery uses same generic name alt for active photos; specs use dt/dd without a wrapping dl. | Per-view image descriptions/captions and valid semantic specification markup. |

## Catalog facts derived from source

53 parent records; 4 variant families containing 11 variants; flattened shop rows = 53 minus 4 plus 11 = 60. Nine legacy category labels; 11 parent seed prices equal zero. Seed zeros do not establish live availability: DB retail overrides can make these products purchasable. The workbook deliberately excludes prices for that reason.

Hair, tip length, handle length and shaft diameter are recorded together for seven newer brushes. Recorded specifications are assertions in the catalog, not independent manufacturer verification. Several records remain labelled Coming Soon even when live retail overrides make them purchasable; remove category/status coupling.

`getBrushSets` infers sets from variants or the words series/set. A size family is not automatically a packaged set. The legacy Tai Chi pair URL now points toward a single Yin brush: review actual equivalence before permanently mapping it; do not silently change what an old customer expects.

## Useful foundations to retain

Server-side public catalog resolution; human-readable product URLs; Next Image usage; product galleries; related-product links; retail/wholesale intent already documented in AGENTS; explicit English-only routing; standalone Docker delivery. A client component can still be server-prerendered: do not claim shop content is absent from initial HTML just because it uses `use client`.
