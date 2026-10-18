# Structured data and Google ecommerce

Read sources S01–S07 in the source register before coding. Structured data must describe visible, accurate content. It can establish eligibility; it does not guarantee a rich result. Schema.org vocabulary support and Google feature support are different things.

## Page-to-schema mapping

| Page | Proposed schema | Guardrails |
|---|---|---|
| Homepage/About | Organization or OnlineStore plus WebSite where appropriate | Stable organization ID; actual brand and legal/contact facts only. Do not fabricate a walk-in shop/address/hours. |
| Single product | Product with Offer and BreadcrumbList | Current approved retail offer, actual image and public specs. |
| Variant family | ProductGroup with hasVariant Product entries | True variation axes, stable group ID, exact variant offers and selecting URLs. |
| Collection | CollectionPage/ItemList and BreadcrumbList | Describes list; does not claim product rich results for category pages. |
| Editorial article | BlogPosting/Article and BreadcrumbList | Real author, publication/change dates and representative image. |
| Video demonstration | VideoObject only when eligible video exists | Real watchable content, accurate metadata, thumbnail and permissions. |
| FAQ sections | Useful HTML questions/answers | Do not plan for FAQ rich results: Google discontinued that feature in May 2026 and removed its documentation in June. No QAPage workaround. |

Use a shared safe JSON-LD component and typed builders; serialize JSON and escape `<` as `\u003c` to prevent script-tag injection from product/editor content. Never interpolate raw HTML or executable MDX. Reuse stable absolute `@id` references instead of creating disconnected organization objects per page.

## Product fields and offer rules

Product identity: name, URL, stable @id, sku, approved description, absolute image URLs, brand reference and real identifiers if assigned. Add material and additionalProperty for verified hair composition, tip length, handle length and mounting-end diameter. These properties improve clarity without guaranteeing that Google exposes them.

Offers: actual current price as a decimal in declared currency; absolute offer URL selecting the correct SKU; correct availability; real condition; seller reference where appropriate. Convert integer cents once. Do not publish a priceValidUntil unless the offer really expires on that date. Do not use synthetic ratings, sales claims, fake reviews or invented GTINs/MPNs.

| Commerce state | HTML/purchase | Schema/feed policy |
|---|---|---|
| Public and approved, available with confirmed price | Buy enabled | Accurate Product+Offer; feed eligible subject to market/checkout checks. |
| Confirmed price, genuinely out of stock | Clear stock message; buy disabled | Product+Offer with OutOfStock; feed reflects state. |
| Preview/unpriced | Coming soon; buy disabled | Product descriptive data if useful; omit made-up offer; exclude from merchant feed. |
| Genuine preorder | Accepts preorder and states date/terms | PreOrder only when business workflow and availability date requirements are satisfied. |
| Private/draft/archived | Not public or deliberate retirement page | No public offer/feed; sitemap policy depends on actual public page lifecycle. |

Positive price alone is not proof of stock. Current code lacks a complete inventory signal, so settle availability semantics before automatic InStock markup. Likewise, static zero seed prices are not authoritative when live overrides exist.

## Variants

Current families: Feng Hui Outline (S/L), Sandalwood L5 (S/M/L), Flat Brush Series (#3/#5/#7) and SuHan (S/M/L). Keep parent URLs. Implement the single-page model first: `/products/feng-hui-outline-brush?variant=EXACT_SKU`, with SSR selection and clean parent canonical. Each merchant feed row uses the exact selectable variant URL. Keep family and SKU identifiers stable even if display names change.

ProductGroup should identify real `variesBy` dimensions, e.g. schema.org/size, hasVariant products with unique sku/size and their offers, and productGroupID. Include actual per-size measurements and image differences where known. Confirm the required/current Google properties against S03 and validate implementation examples in Rich Results Test. A brand-new variant selection parameter is not a reason to create hundreds of indexable duplicate pages.

## Organization, returns and shipping

Confirm merchant legal identity, monitored email, public profiles, return destination, countries served, return window, return method and customer cost. Existing pages refer to unused returns within 30 days and damage reporting within seven; verify operative terms and applicable law before creating structured policy. Never reduce statutory rights to match a schema field.

Use organization-level MerchantReturnPolicy for shared approved terms; product-level exceptions only when genuine. Shipping details may describe confirmed destinations, rates, handling and transit ranges. Do not substitute 2–5-day processing for international delivery time. Current shipping code uses weight assumptions and manually quoted exceptions; do not invent worldwide flat rates or zero-cost shipping. Configure only markets with a complete purchase and delivery path.

## Merchant Center implementation workstream

This requires business/account review in addition to code. Domain verification/claiming, target-country eligibility and account policies were not inspected. A VPS/Next.js site can supply product data without WooCommerce.

Proposed feed endpoint: `/feeds/google-products.xml` outside locale routing, or a supported scheduled source selected in Merchant Center. Decide account ingestion method before building unnecessary API integration. Start with a small verified set, then scale after diagnostics pass.

Minimum mapping contract (verify current per-market requirements): stable item id → sellable SKU; title/description → approved retail copy; link → exact landing/variant URL; image_link → clean accessible product image; availability/price/currency → same public offer resolver; brand → approved Sicon Art entity; gtin/mpn → actual assigned identifiers when applicable. Include item_group_id and actual variant attributes for genuine variant families. Item condition and product taxonomy must be accurate.

Do not set identifier_exists=no merely because the catalog currently lacks GTINs. Determine whether identifiers exist and apply the current category rules; retain any legitimate identifiers that do exist. If Sicon Art is the manufacturer, any assigned manufacturer part numbering must be a deliberate stable business decision, not an invented SEO value.

Merchant images should show the actual product cleanly; avoid promotional overlays and decorative dimension panels as the primary feed image. Supplementary images may demonstrate use within current feed guidelines. Do not label a generated performance example as an actual painted result.

Feed handling: XML-escape fields; support absolute public URLs; filter unapproved products; validate currency/price/stock; expose no wholesale/MOQ/customer data; report rejected rows internally; tie updates to retail changes; detect source failures; monitor freshness and feed fetch logs. Account automatic updates are a safety net, not permission for stale feeds.

## Acceptance and monitoring

Validate representative single product, size family, unavailable product and article using JSON parsing, Schema.org validator and relevant Google Rich Results Test features. Compare raw/rendered HTML with schema, cart quote and feed at the same time. Check Merchant Center diagnostics for price, stock, identifiers, image crawl, policy and landing-page issues. Submit a small pilot feed; expand only after correctness is established. No paid campaign creation is required by this task.
