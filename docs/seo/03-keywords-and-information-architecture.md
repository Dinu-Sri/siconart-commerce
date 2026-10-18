# Keywords, intent and information architecture

## What this research can establish

Public search sampling supports relevant query families: travel watercolor brushes, Chinese brushes for watercolor, urban sketching brushes, materials, point control and brush care. It does not provide reliable search volume, difficulty or a “most demanded” ranking. All priorities here are business-fit hypotheses. No numeric volume, CPC or difficulty score has been fabricated.

Search sampling on 18 October 2026 included `watercolor travel brush Chinese brush natural hair urban sketching best`, `travel watercolor brush Escoda Da Vinci`, and `Chinese watercolor brushes`. Manufacturer and retailer results show travel collections, named brush families, physical specifications and artist content competing for these intents. Escoda is a useful primary-source benchmark for product/artist architecture. These observations are directional, not a fixed or country-specific SERP ranking audit.

## Priority ladder

| Priority | Query family | Intended owner | Reason and limitation |
|---|---|---|---|
| First | travel watercolor brushes; travel watercolour brush | `/collections/travel-watercolor-brushes` | Strong inventory fit and specific purchase intent; demand magnitude unmeasured. |
| First | Chinese watercolor brushes; Chinese brushes for watercolor | `/collections/chinese-watercolor-brushes` | Clear differentiation; distinguish watercolor use from calligraphy-only intent. |
| First | brushes for urban sketching | `/collections/urban-sketching-brushes` | Technique aligns with brand; needs authentic field demonstrations. |
| First | Sicon Art / SiconArt + product name | Existing product URLs, homepage for brand | Establish entity clarity and prevent confusing aliases. |
| Next | fine detail watercolor brush; flat watercolor brushes | Detail/flat collections | Product-supported use cases; check sufficient inventory before publishing collections. |
| Next | natural hair watercolor brushes; goat hair watercolor brush | Curated verified-material collection + informational guide | Only publish membership when composition is confirmed. Not every blend is wholly natural. |
| Next | how to clean watercolor brushes; soft vs springy brushes | Individual blog guides | Supports product choice and retention; practical evidence opportunity. |
| Later | artisan paintbrush gifts; collectible Chinese brushes | Collector collection and gift guide | Gift packaging and edition authenticity need confirmation. |
| Later | watercolor brush wholesale | `/become-an-agent` | B2B intent; keep confidential prices outside public exports. |
| Competitive supporting | best watercolor brushes; watercolor brushes for beginners | Buying guide / shop | Broad competition; do not make this the sole launch target or call products best without a method. |

Use watercolor as the consistent English house spelling, with watercolour naturally where appropriate in text. Do not create duplicate pages for US/UK spellings. Avoid “water brush pen” unless the product truly contains a water reservoir. Do not create a set page for a selectable size family sold one brush at a time.

## Demand validation before scaling content

1. Choose target countries using actual fulfilled orders, delivery capability, currency/payment support and margin. Provisional research groups: US/UK/Australia for English intent and Singapore/Malaysia for regional shipping fit; these are not proven top markets.
2. Export Search Console query/page/country/device data over the available period; separate brand from non-brand and note site-age limitations. Use impressions as first-party opportunity evidence, not market-wide volume.
3. Run the same seed families through Google Ads Keyword Planner by country and language. Record date, range, competition definition and account limitations. Optionally use a paid SEO dataset with its provider/date clearly retained.
4. Inspect actual country SERPs for intended page type, visual results, competing brands, shopping presence and content gaps. Keyword Planner ad competition is not organic difficulty.
5. Score business relevance, eligible stock/margin, purchase intent, observed demand and evidence readiness separately. Do not turn an unsupported qualitative score into a traffic forecast.
6. Update `keyword-map.csv`; add measured country-specific fields without replacing the original hypothesis labels. Maintain one primary owning URL per intent cluster.

## Proposed navigation and ownership

Preserve `/shop` as the all-products grid. Add `/collections/[slug]` for selected evergreen buying intents, with a short useful introduction, linked real products, specific comparison/selection advice and related guides. Initial launch: travel, Chinese watercolor and urban sketching; detail/flat/collector/accessories follow when content and membership are ready. Overlapping product membership is fine; nearly identical collection pages are not.

Every collection needs a unique purpose, stable membership rule, meaningful inventory, a concise H1 and a short explanation of what makes the choice different. Do not generate every combination of material, country, size and use. Preserve the current four filter groups as a shopping affordance; they are not automatically the SEO taxonomy.

Primary paths: homepage → shop/collections → products. Editorial paths: blog hub → guide → relevant collection → specific SKU. Product pages link back to their canonical primary collection and to a useful technique/care guide. Artist stories link to products actually demonstrated; products link back to those demonstrations when authorized.

Each product can appear in several collections but should have one stable breadcrumb path. Use descriptive contextual anchors without forcing an exact keyword into every link.

## Indexing matrix

| Route | Indexing/canonical policy |
|---|---|
| `/`, `/shop`, approved `/collections/...` | Indexable, self canonical. |
| Existing canonical `/products/[slug]` | Indexable when public and useful; no slug rewrite for keywords alone. |
| `/products/[slug]?variant=SKU` | Exact variant server-selected. Single-page family model canonicalizes to parent; schema/feed link still selects the variant. |
| `/shop?group=...` | Choose one policy: redirect an exact approved group to its matching collection, or keep as a shopping facet with noindex. Do not point materially filtered content to an unrelated collection. |
| Arbitrary filter/sort/search combinations | Exclude from sitemap; ordinarily noindex when retained as pages; control link proliferation and crawl traps. |
| Tracking parameters | Clean canonical to equivalent URL; preserve functional analytics. |
| Blog articles/hub | Published useful content indexable; drafts/preview excluded and access-controlled. |
| Cart, checkout, confirmation, admin, list, tracking responses | Noindex, absent from sitemap; private data requires real authorization. |
| `/home-v2` | Retain current noindex preview behavior until a deliberate launch decision. |
| Legacy paths | Permanent redirect only to genuinely equivalent content; otherwise appropriate 404/410 or helpful replacement page based on real history. |

Recover legacy WordPress URLs from Search Console, backlinks, logs and old sitemaps before designing a redirect map. The reference directory alone cannot establish which old URLs had traffic.
