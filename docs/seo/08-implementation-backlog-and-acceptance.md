# Implementation backlog and acceptance

Use sequential, reviewable PRs. Tickets below are proposed IDs, not existing GitHub issues. Each PR should cite affected audit findings, changed paths, before/after examples, exact test results, remaining unknowns and rollback approach. Rebaseline against the latest repository first.

## Phase 0 — factual and public-data readiness

| Ticket | Deliverable | Acceptance |
|---|---|---|
| SEO-001 | Remove generated social proof; verify homepage claims | No SKU-derived rating/sold counts anywhere public; only evidenced review totals; no fabricated review schema. Audit home-v2 too. |
| SEO-002 | Public DTO and safe pricing failure contract | Public exports allowlist fields. Tests prove private prices/MOQs and known sentinel data are absent from client bundles/RSC/feed/MD. DB outage cannot silently advertise draft seed offer. |
| SEO-003 | Publication/availability semantics | Explicit approved/unpriced/out-of-stock/draft lifecycle; price alone never sets stock; cart and exports agree. |
| SEO-004 | Initial verified product facts and merchant identity | Five representative product pages plus one family reviewed; dimensions and active support/policies approved; unresolved facts omitted/flagged. |

Safe technical work can proceed while facts are gathered, but inaccurate offers, reviews or policies must not be released in feeds/schema.

## Phase 1 — indexable foundations

| Ticket | Deliverable | Acceptance |
|---|---|---|
| SEO-101 | Origin validation + shared metadata | Correct HTTPS host in production; unique title/description/canonical/OG for homepage/shop/product/policies; no localhost or duplicate brand. |
| SEO-102 | Sitemap/robots + utility noindex | Sitemap parseable, URLs unique/current/canonical; robots declares it; utility/draft/private excluded; public pages/assets crawlable. |
| SEO-103 | Permanent redirect and old URL map | Known equivalent aliases resolve directly; invalid slugs 404; true variants preserve selection; no blanket shop fallback. |
| SEO-104 | Variant URLs and SSR selection | At least two different sizes open with exact matching price/image/cart SKU before hydration; refresh/share/back actions work. |
| SEO-105 | Product/organization/breadcrumb schema | Safe serialization; visible-data parity; no critical relevant validator errors; no made-up claims/identifiers. |
| SEO-106 | Three collection pages + compact shop H1 | Unique purpose, server-visible links, approved membership and self canonical; arbitrary filters do not generate thin indexable pages. |

## Phase 2 — Google commerce and measurement

| Ticket | Deliverable | Acceptance |
|---|---|---|
| SEO-201 | Pilot feed from approved retail projection | Single product, family and out-of-stock cases correct; unpriced/draft excluded; XML escaped; no private fields. |
| SEO-202 | Merchant setup checklist and pilot review | Owner/account operator verifies domain, eligible targets, checkout, shipping/return settings and diagnostics; no account status assumed. |
| SEO-203 | Search/analytics baseline | GSC domain property and sitemap submission verified by authorized account; ecommerce events deduplicated; no PII; consent handled as required. |
| SEO-204 | Mobile performance baseline and targeted fixes | Store before/after lab configuration and page samples; field vs lab labelled; no unsupported score claim. |

Events: view_item_list, select_item, view_item, add_to_cart, begin_checkout and purchase using actual SKU/currency/value conventions. Record purchase only from confirmed payment state and deduplicate transaction IDs. WhatsApp enquiries are separate conversion events, not purchases. Do not transmit customer names/emails/order addresses in analytics.

## Phase 3 — original editorial launch

| Ticket | Deliverable | Acceptance |
|---|---|---|
| SEO-301 | Blog/content/author framework | Published/draft distinction; content validation; authenticated previews; safe renderer; article metadata/schema/sitemap. |
| SEO-302 | Semantic editorial components | Header, TOC, comparison table, captioned figure, steps, recommendations; keyboard/mobile/no-JS reading verified. |
| SEO-303 | First three evidence-backed articles | Each has actual author, original assets, specific methodology, useful internal links and approved claims; no duplicated collection ownership. |

## Phase 4 — optional AI-readable layer

| Ticket | Deliverable | Acceptance |
|---|---|---|
| SEO-401 | Markdown equivalents and discovery headers | Exact approved public-data parity, correct content type/canonical/noindex, unknown 404, draft inaccessible and private data absent. |
| SEO-402 | llms.txt | All links real, concise v2-compatible structure, generated freshness checks; no rankings/citation guarantees. |
| SEO-403 | Crawler policy validation | Search access checked at robots/WAF/server; training policy separately recorded; specific bot groups retain private-route restrictions. |

## Representative validation matrix

Test homepage, shop, three collections, one basic travel product, one detailed-material product, two sizes in one family, unpriced, out-of-stock, unknown slug, legacy slug, return-policy alias, article, draft preview, cart/checkout and each export. Use safe local/staging fixtures for states absent in production. Never change production prices just to run a test.

For product cases compare URL/status, H1, selected SKU, HTML price/currency, schema offer, feed row, Markdown and cart quote. Include a price-change/invalidation test and a DB-unavailable test. Test descriptions containing `</script>` and XML special characters safely; published scripts/feed must remain valid and non-executable.

At the public host verify status/redirects, canonical host, meta robots/X-Robots-Tag, robots and sitemap availability, image fetchability, search-agent access and no private responses in public cache. Use proper provider bot/IP verification when interpreting logs; spoofing a UA is only a response test, not identity proof.

Run `npm run typecheck` and `npm run build` in the implementation environment. Validate supported rich results and inspect rendered HTML. Record which checks were not possible and why. Documentation creation in this audit did not itself run application tests.

## Release and rollback

Owner reviews factual decisions and agent presents concrete PRs. Deploy through existing green GHCR workflow and Portainer with a recorded image SHA, migration/back-up plan when schema changes, health check and previous known-good image. Monitor canonical/indexing, price/feed mismatch, checkout error and bot-response regressions immediately; restore previous image/config if necessary. Never auto-rollback destructive data migrations without a tested reversal plan.

## Measurement cadence

Baseline before release; review diagnostics after release and weekly during initial rollout, then compare meaningful 28/90-day periods with seasonality/site age noted. Track non-brand impressions/clicks by cluster and country, indexed canonical coverage, product/merchant issues, collection-to-product engagement, organic add-to-cart/purchase conversion and revenue, qualified agent enquiries and observed AI referrals/citations. Interpret low traffic cautiously; a successful schema validation is not proof of commercial uplift.
