# Sicon Art SEO implementation plan

Prepared 18 October 2026. Planning branch: `codex/seo-knowledge-base`. Repository baseline for this pack: `97f9bcbd758719b2d1270d73f2b068b83f2aa64f`. This document is a planning deliverable. It does not authorize storefront implementation, deployment, Merchant Center submission, feed publication, or public content launch.

Current assignment: read the SEO pack, inspect Facebook media and existing videos, and specify how to implement SEO, product pages, the ten commercial articles, events, ambassadors, and artist testimonials. Owner review is required before any application code change.

## 1. How to use this plan

- Follow `AGENTS.md` and `docs/seo/AGENT-START-HERE.md`. English-only flat URLs, current product slugs, warm-paper design, retail/private-data boundary, and GHCR/Portainer workflow stay as they are.
- File 15 is the authoritative ten-article shortlist. Files 07, 10, and 11 overlap and are not extra approved articles.
- Files 16–17 plus the manifests are the media source of truth. Collapsed Facebook captions, album previews, and original-resolution files remain incomplete.
- Rankings, rich results, AI citations, and sales are outcomes to measure later. They are not promises in this plan.
- Distinctions used below:
  - **Independent**: reversible engineering that can proceed after owner authorization without waiting for missing facts.
  - **Publication gate**: a fact, right, SKU, rating, ambassador status, or live offer that must be evidenced before public HTML, schema, feed, or Markdown may claim it.

Do not change application code, deploy, modify production commerce values, submit merchant feeds, or publish content from this assignment.

## 2. Current storefront versus the pack

Inspected on this branch against the audited baseline. Useful foundations to keep: App Router storefront, `getStorefrontProduct(s)` live market overlay, human-readable `/products/[slug]` URLs, Next Image galleries, English-only routing, GHCR pull-only deploy.

| Area | Current state | Planned outcome |
|---|---|---|
| Social proof | `src/data/product-social-proof.ts` hashes SKUs into fake ratings/sold counts. `home-v2` enables them via `ProductCard`. Homepage hard-codes `4.9 (250+) reviews`. `testimonials-carousel.tsx` uses unverified Jhon/Emma/Olivia/Sara quotes. Shop cards default `showSocialProof` off. | Remove generated claims from every publishable surface, including noindex previews that may later launch. Replace only with evidenced artist-use/testimonial modules. |
| Pricing | `src/lib/commerce/live-prices.ts` overlays `PriceOverride.retail`. `getPriceListOverrides()` returns `{}` on DB error, so seed prices silently become the public offer. | Shared public DTO; fail closed or last-known-good with freshness; never advertise draft seed prices as live offers. |
| Metadata | Locale layout supplies generic title/description. `metadataBase` falls back to `http://localhost:3000`. Product routes have no `generateMetadata`. | Unique title/description/canonical/OG per public page; production origin required. |
| Crawl | `src/app/robots.ts` exists, no sitemap declaration. No `sitemap.ts`. `/list` and `/home-v2` are noindex. Cart/checkout/admin coverage is incomplete. | Sitemap of canonical public URLs; robots points at it; utility routes noindex. |
| Schema | No JSON-LD found. | Supported Product/Offer, ProductGroup, Organization, BreadcrumbList, Article; Event/VideoObject/Person only when facts exist. No FAQ rich-result markup. |
| Collections | Shop is a filterable grid. No `/collections/[slug]`. | Three curated collections after membership rules are approved. |
| Blog/events/ambassadors | No `/blog`, `/events`, `/ambassadors`, or `/collaborate` routes. | Repository-backed content models with draft/preview/publish. |
| AI layer | No `llms.txt` or public Markdown. Middleware already excludes dotted paths. | Optional, after HTML and retail contracts. |
| Support identity | Site uses `support@siconart.com`. Facebook public bio shows `hello@siconart.com`. WhatsApp is `+852 5742 3547`. | One monitored public inbox across footer, schema, policies, and Markdown. |
| Hong Kong | Country exists in `src/data/countries.ts`. No `HK` rate in `src/data/shipping.ts`, so checkout follows the WhatsApp quote path. | Do not advertise automatic HK shipping until a rate is approved. |
| Catalog | 64 parent SKUs including SA-53/SA-54 Coming Soon. Seven Facebook-mapped products exist at current slugs. Skyward Dragon (SA-45) is unpriced. Most catalog copy is category-template. | Enrich with verified facts; keep current slugs. |

## 3. Media inspection notes

Validated against `MEDIA-VALIDATION.md`: 55 Facebook JPEGs under `docs/seo/assets/facebook/`, 121 source records, 26 page mappings, nine existing MP4s. This planning pass visually inspected representative event posters, product graphics, booth photos, all four artist-works posters, the one international-demo poster, and 2-second frames from all nine videos.

### 3.1 Event posters that already contain usable facts

These are source assertions, not owner-approved publication copy. They reduce some “unknown date” gaps and still need confirmation.

| Asset | Visible facts | Remaining gate |
|---|---|---|
| FB-020-01 | Saigon Aquarelle 2026, 19–28 Sep 2026, Contemporary Art Space / HCMC Fine Arts Association, 01 Einstein, Thu Duc. Sicon Art logo appears among co-sponsors. | Confirm official organizer names, Sicon Art’s approved role wording, and that the logo means co-sponsor rather than media/support. Do not treat the 19 Sep demo as the whole exhibition. |
| FB-017-01 | Tina Wang live demo 19 Sep 2026, 11:00–12:30, Contemporary Art Space, 1 Einstein, Thu Duc, HCMC. Founder, Sicon Art. | Separate demo block from exhibition dates. Confirm completed attendance. |
| FB-019-01 | Same venue; Tina Wang listed 11:00–12:30 on 19/9/2026 among many artists; country shown as China. | Credit fellow artists only with permission. Tina is one listed demonstrator. |
| FB-012-01 | “Greater Bay Area Urban Sketching Annual Meeting 2026”; thank-you to Sicon Art; SAN 26 SHUI / Oct 3rd–5th 2026. | Owner-approved English title and translated certificate wording. Role from the document, not from a logo in a photo. |
| FB-005-01 | SiconArt Gallery mini exhibition; Sanjeewee Senevirathna; 07 Oct 2026, 09:00–12:00; Dongguan Zhangmutou. | Confirm completion, artist-approved spelling (Senevirathna vs Senevirathne), and obtain demo photos. Poster is announcement evidence. |
| FB-075-01 | Giresun International Watercolor Festival, 09–12 May 2026; “Official Fine Art Materials Partner”; coordinator Adem Velioglu; consultant Yasar Birinci. | Confirm completion and exact role. Do not reuse Izmir footage as Giresun. Poster manufacturer wording is not a storefront claim until approved. |

Documentary booth photos (FB-004, FB-010, FB-006) are usable recap evidence after portrait/artwork credit. Good Market photos (FB-125) show market atmosphere only. Thailand launch photos (FB-126) show a “Free test” booth and Tina with a brochure; they do not name city, date, or a permanent shop. Bangkok table photos (FB-124) show a private meal/demo, not a festival.

### 3.2 Product graphics with embedded claims

Current public catalog for these SKUs has no hair, tip, handle, or diameter fields. Graphics must not be copied onto product pages until the owner confirms the numbers and that diameter means hair-mounting-end shaft diameter.

| Product | Assets | Embedded claims visible in the files | Extra caution |
|---|---|---|---|
| Qin SA-08 | FB-024-01, FB-051-01/02 | Tip 3 cm, shaft Ø 0.6 cm, handle 15 cm wood; bristles “Goat, hemp, and Synthetic Hair Mix”. | Stroke uses and “detail brush” marketing copy need owner sign-off. |
| Happiness SA-09 | FB-024-02, FB-050-01/02 | Tip 2.5 cm, shaft Ø 0.65 cm, handle 13 cm; “Horse, and Synthetic Hair Mix”; bamboo wood; 福 mark. | Confirm travel vs short-handle construction. |
| T3 SA-05 | FB-049-01/02, FB-023-01/02 | Tip 1.7 cm, shaft Ø 0.5 cm, handle 13 cm. Customization graphic offers hair types and engraving. | Historical batch photos are not current stock. Engraving is a live service only if terms exist. |
| Chi Ling SA-14 | FB-028-01/02/03 | Named in caption as Chi Ling 赤翎. **FB-028-03 handle is engraved `SiconArt T6`.** | Do not publish this cutout as Chi Ling until the owner confirms the model. Styled still-life origin unverified. |
| Skyward Dragon SA-45 | FB-032-01/02 | Carved coiled handle; in-hand riverside scene looks highly produced. | Coming Soon / unpriced. Do not use as documentary manufacturing proof or as a large-wash result claim. |
| T1 SA-07 | FB-021-01/02/03 | Sketchbook boat sequence associated by Instagram caption with Sanjeewee and T1. | Confirm exact SKU and artist permission. Painting use is not a review. |
| Run Hao SA-34 | FB-026-01/02 | Brown-handle production batch. | Historical quantities stay off the product page. |

Pete Sirodom temple paintings (FB-122) show a yellow bamboo travel brush that resembles T3. That resemblance is not a SKU assignment.

### 3.3 Videos versus adjacent posters

Nine MP4s exist at the tracked `public/instagram/highlights/` paths. Byte sizes match the register. OpenCV 2-second frames confirm the register’s visual notes and add attribution that the register left pending.

**Do not use the adjacent JPG as a poster.** Highlight cover images belong to different artists than the clips they sit beside.

| ID | 2-second frame | Adjacent JPG | Use |
|---|---|---|---|
| VID-01 | `irina_kulemina_art`; overlay “AMAZING BRUSH” and “THANK U SO MUCH @TINA.WANG88”; landscape + tagged Sicon Art brush. Matches TC-01, with fuller overlay than the CSV quote. | `betzalel_art` street scene. Wrong artist. | Quote-card candidate after permission. Disclose likely gift. No SKU. |
| VID-02 | Shared by `tina.wang88`; inner handle `eugeniko_art`; landscape + `SiconArt handmade` brush; no endorsement quote. | Floral still life. Wrong clip. | Demonstration only. Register “handle pending” can now be checked as eugeniko_art. |
| VID-03 | Inner handle `lenas.art.corner`; “Thank you @tina.wang88 for the ideal brush for these lines”; blue illustration. Matches TC-02. | `sareh_mohebeian` gift photo. Wrong artist. | Quote-card candidate after permission. No SKU. |
| VID-04 | Handle `woman_23`; red prawn/shrimp study. Register called it lobster. Frame shows a pencil, not a clear Sicon brush. | `loklokchung` Cantonese gift thanks. Wrong artist. | Demonstration only; do not invent a quote. |
| VID-05 | Outdoor paved plaza, brush stall, red-and-white clothing. Event unnamed. | `art.annettcoumont` “Buying some new brushes” gazebo photo. Likely a different moment. | Event/demo module after venue confirmation. |
| VID-06 | Overlay “SiconArt @IAAF Izmir, Turkey”; Tina painting. | No matching JPG. | Izmir demonstration. Never label Giresun. |
| VID-07 | “More Painting Demo” + Turkey flag; “SiconArt with Tina”. | No matching JPG. | Turkey demo; event name unknown. |
| VID-08 | Brand overlay “Lets Test SiconArt Brushes for Serious Paintings”. | No matching JPG. | Brand-authored test, not an independent review. |
| VID-09 | Packaged brushes; “A trust traveling across mountains”; “Thank you for supporting us”. | No matching JPG. | Brand thank-you. Not a testimonial. |

Additional quote-like overlays exist only on unused posters (`sareh_mohebeian`, `loklokchung`, `art.annettcoumont`). They are not in `testimonial-candidates.csv`. Treat them as new candidates, not as approved quotes.

Audio exists on all nine files and is still untranscribed. File-modification time is not `uploadDate`.

### 3.4 Facebook coverage limits

The register reached the available feed bottom. Incomplete by design: collapsed “… See more” captions, a `+71` album not downloaded, uncaptioned cover updates, and Facebook videos in FBP-002/FBP-003 that were not archived. Extra unmapped source captions include a Fujian Tulou plein-air trip and a Li Zijian Art Museum watercolor carnival. Those stay off the seven-event list until evidenced.

Downloaded files are 443–590 px platform JPEGs. They are not wide-hero originals.

## 4. Independent work versus publication gates

### Independent after implementation is authorized

1. Public retail DTO and private-field tests (`SEO-002`).
2. Remove SKU-hashed social proof and unverified homepage testimonials (`SEO-001`), leaving honest empty states.
3. Metadata builders, canonicals, robots/sitemap, redirect map, noindex inventory (`SEO-101`–`SEO-103`, `SEO-018` from audit A18).
4. Variant query-parameter SSR (`SEO-104`) on existing families.
5. JSON-LD component and builders that omit empty fields (`SEO-105`).
6. Blog/event/ambassador content schemas, preview auth, semantic components, and provenance fields (`SEO-301`, `SEO-501` models).
7. Media import pipeline: copy approved files from `docs/seo/assets/facebook/` to `public/media/...` with manifest IDs retained; generate responsive derivatives; never serve `docs/seo`.
8. Accessible video player with click-to-play, real posters extracted from the clip, `preload="none"`.
9. Footer grouping that shows only live links (`SEO-footer`).
10. Comparison-table and live-price widget components that refuse stale seed prices.

### Publication gates (do not ship claims without evidence)

Owner or named editor must supply or confirm:

- Rights: creator credit, recognizable-person consent, artwork reuse, website context distinct from Facebook/Instagram.
- Exact SKU for any “this brush” caption, product module, or article recommendation.
- Ambassador roster, relationship type, current/former status, and disclosure of gifts.
- Live retail prices and availability for any priced widget, under-$20 list, or merchant feed row.
- Hair composition, mounting-end diameter, tip/handle/packed lengths, and weights.
- Event official title, edition, start/end, venue, organizer, and Sicon Art role.
- Review totals and star ratings: none exist that are safe to keep.
- Legal merchant identity, monitored email, return destination, and operative policy text.
- Hong Kong shipping rate if checkout is to be advertised there.
- Custom engraving eligibility, price, and lead time.
- Video transcripts/captions and artist-approved quote wording.
- Higher-resolution originals before wide heroes.

## 5. Release order

Prefer small verified releases. Plan `SEO-001`–`SEO-004` first. Content models may be built in parallel; public URLs stay unpublished until gates pass.

```text
Phase 0  Factual integrity          SEO-001, SEO-002, SEO-003, SEO-004
Phase 1  Indexable foundations      SEO-101 … SEO-106
Phase 2  Commerce measurement       SEO-201 … SEO-204   (account work is owner-operated)
Phase 3  Editorial framework        SEO-301, SEO-302
Phase 4  Events / collaborate       SEO-501, SEO-502, SEO-504, Vietnam pilot
Phase 5  Product evidence modules   seven mapped PDPs after SKU/rights
Phase 6  Ten commercial articles    SEO-303, file 15 order, evidence gates
Phase 7  Ambassadors / testimonials SEO-503, TRUST-ARTISTS
Phase 8  Footer live links          after destinations exist
Phase 9  Optional llms.txt          SEO-401 … SEO-403
```

PR per phase. Each PR lists changed paths, ticket IDs, actual checks, remaining blocked facts, and rollback. Run `npm run typecheck` and `npm run build` when application code changes. Record incomplete checks honestly. Deploy only through green GHCR + Portainer after owner approval. Do not auto-publish the 121 Facebook captions.

## 6. Phase 0 — factual integrity

### SEO-001 Remove generated social proof

Existing files: `src/data/product-social-proof.ts`, `src/components/storefront/star-rating.tsx`, `src/components/storefront/product-card.tsx`, `src/components/storefront/home-v2-hero-slider.tsx`, `src/app/[locale]/home-v2/page.tsx`, `src/app/[locale]/page.tsx`, `src/components/storefront/testimonials-carousel.tsx`.

Proposed change: delete or isolate the hash generator so it cannot reach any public UI, schema, feed, or Markdown. Remove homepage `4.9 (250+) reviews`. Stop rendering Jhon/Emma/Olivia/Sara cards until each quote has a source, permission, and relationship disclosure. Keep `/home-v2` noindex until that preview is either cleaned or explicitly launched.

Acceptance: grep of public bundles and rendered HTML finds no SKU-derived sold counts or star values. Facebook/Instagram counts are not copied onto the site.

### SEO-002 Public DTO and pricing failure

Existing files: `src/lib/commerce/live-prices.ts`, `src/lib/price-list-overrides.ts`, `src/data/products.ts`, `src/data/price-list-products.ts`, `src/data/shop-listings.ts`.

Proposed: `src/lib/catalog/public-product.ts` allowlists retail fields only. Move public names/categories off the private price-list module. On override DB failure, disable purchase and suppress feed rows rather than serving seed prices as live offers. Tests must prove artist/wholesale/MOQ/sentinel values are absent from client bundles, RSC payloads, schema, feed, and Markdown.

### SEO-003 Publication and availability

Align Coming Soon (`priceCents === 0`), out-of-stock, draft, and discontinued across catalog, cart, schema, sitemap, and feed. Price alone does not imply InStock. Unpriced products remain visible as Coming Soon and are excluded from merchant feeds.

### SEO-004 First verified product facts

Complete `docs/seo/product-fact-workbook.csv` for a first set: Chi Ling, T3, T1, Happiness, Qin, plus one variant family (Feng Hui Outline). Skyward stays preview-only while unpriced. Run Hao supports maker photography after batch-quantity claims are stripped.

Proposed product-page sections, only with verified rows: at-a-glance, marks, physical specs in a real `dl` or table, travel vs short construction, in-use story, linked demonstration, care, delivery, compare.

Title pattern after suitability is verified, slug unchanged: `Chi Ling Travel Brush for Urban Sketching · Sicon Art`.

## 7. Phase 1 — technical SEO

Existing files to extend: `src/app/[locale]/layout.tsx`, `src/app/[locale]/products/[slug]/page.tsx`, `src/app/[locale]/shop/page.tsx`, `src/app/[locale]/shop/[slug]/page.tsx`, `src/app/robots.ts`, `next.config.ts`.

Proposed files: `src/app/sitemap.ts`; shared metadata helpers; `src/components/seo/json-ld.tsx`; collection routes under `src/app/[locale]/collections/[slug]/page.tsx`.

| Ticket | Work | Acceptance |
|---|---|---|
| SEO-101 | Valid HTTPS `metadataBase`; unique title/description/canonical/OG. Fail production config on localhost origin. | Rendered HTML on homepage, shop, one product, one policy. |
| SEO-102 | Sitemap of public canonical 200s; robots sitemap URL; noindex cart/checkout/thank-you/track/admin/list/home-v2/drafts. | Parseable sitemap; private URLs absent; `/list` remains noindex. |
| SEO-103 | Permanent one-hop redirects for genuine aliases; `/return-policy` → `/return-exchange-policy`; unknown slugs 404. | Status codes checked; Tai Chi pair mapping reviewed before any permanent single-brush redirect. |
| SEO-104 | `?variant=EXACT_SKU` server-selects price, image, and cart SKU for Feng Hui, Sandalwood L5, Flat Series, SuHan. | Share/refresh/back keep the advertised SKU. |
| SEO-105 | Product+Offer, ProductGroup, Organization, BreadcrumbList. Escape `<` in JSON-LD. Omit GTINs, ratings, shipping, and returns until those facts exist. | Rich Results Test on representative pages; no invented identifiers. |
| SEO-106 | Collections: `urban-sketching-brushes`, `travel-watercolor-brushes`, `chinese-watercolor-brushes`. Compact shop H1. Large-wash collection only after measurements. | Unique purpose, approved membership, self canonical; filters stay non-indexable. |

Do not activate `/zh`, hreflang, or country landing pages. Local-language keyword seeds stay research-only.

## 8. Phase 2 — Google commerce and measurement

| Ticket | Work | Gate |
|---|---|---|
| SEO-201 | Pilot `/feeds/google-products.xml` from the public DTO. One product, one family, one out-of-stock, unpriced excluded. | Owner must not submit until the pilot validates. |
| SEO-202 | Merchant Center checklist: domain, countries, shipping, returns. | Owner/account operator. HK stays quote-path until rated. |
| SEO-203 | GSC domain property and sitemap submission; ecommerce events without PII. | Owner accounts. WhatsApp enquiries are not purchases. |
| SEO-204 | Labelled lab mobile performance on home, shop, one PDP, one article. | No invented CWV scores. |

Feed image is the clean white product photo, not a spec overlay or Facebook graphic.

## 9. Products: seven named modules

Keep current URLs. Import Facebook assets only after SKU and rights checks. Product image panels stay white.

| ID | URL | First evidence | Implementation note |
|---|---|---|---|
| PDP-SA-07 | `/products/t1-soulmate-limited-travel-brush` | FB-021 sequence; Instagram SBR05 names Sanjeewee + T1 | Strongest in-use pilot. Attributed story, not a rating. |
| PDP-SA-05 | `/products/travel-series-brush-t3` | FB-049 graphics; FB-023 production | Verify dimensions; strip order-quantity captions; T3 vs Chi Ling article destination. |
| PDP-SA-14 | `/products/chi-ling-travel-brush` | FB-028 | Resolve the **T6 engraving** on FB-028-03 before any Chi Ling gallery use. |
| PDP-SA-09 | `/products/happiness-short-travel-brush` | FB-024-02, FB-050 | Confirm horse/synthetic mix and whether it is a true travel mechanism. |
| PDP-SA-08 | `/products/sicon-art-qin-brush` | FB-024-01, FB-051 | Confirm goat/hemp/synthetic mix; keep stroke photos with matching text specs. |
| PDP-SA-34 | `/products/run-hao-short-brush` | FB-026 | Maker-process photos; no lifetime sales inference. |
| PDP-SA-45 | `/products/skyward-dragon-brush` | FB-032 | Stay Coming Soon until priced. Styled images after confirmation only; Memories of Izmir (FB-013) stays off this SKU. |

Proposed public media paths after approval: `public/media/products/<slug>/<manifest-id>-<descriptive>.jpg` with `publicPath` recorded back onto the manifest. Native width/height in `next/image`. Spec graphics may support a details panel; they must not become shop thumbnails (`isBrushDetailsImage` already skips spec cards).

## 10. Ten commercial articles

Authoritative list from file 15 / `editorial-calendar.csv`. Routes under `/blog/[slug]`. Journal can be the nav label. Earlier 12-brief lists are backlog.

Proposed content tree: `content/blog/`, `content/authors/`, `src/lib/content/`, `src/components/editorial/`. Status fields: `draft`, `factChecked`, `rightsChecked`, `publishedAt`. Drafts are auth-preview and noindex. Unpublished articles do not enter sitemap, footer, or Markdown.

| # | Slug | Intent | Mapped assets | Publish only when |
|---|---|---|---|---|
| 1 | `chinese-watercolor-brush-prices` | Price / what to pay | FB-049, FB-050, FB-051 | Live public prices, date, USD basis, Coming Soon excluded, no market-wide range from Sicon Art alone. |
| 2 | `chinese-vs-western-watercolor-brush` | Form comparison | FB-021, FB-051 | Original same-paper tests of named samples. Social beauty shots are not a head-to-head. |
| 3 | `choose-brush-urban-sketching` | Which travel brush | FB-021, FB-028, FB-049 | Approved available models, dimensions, limits. |
| 4 | `travel-vs-short-handle-watercolor-brush` | Construction choice | FB-028, FB-050 | Measured working/packed lengths and actual mechanisms. |
| 5 | `travel-watercolor-brush-under-20` | Budget | FB-049, FB-050 | Enough in-stock products under $20 after live overlay, with update logic. Otherwise fold into article 1. |
| 6 | `natural-hair-synthetic-brush-blends` | Materials value | FB-026, FB-051 | Verified composition; no species inferred from photos. |
| 7 | `t3-vs-chi-ling-travel-brush` | Named model vs | FB-023, FB-028, FB-049 | Exact differences, measurements, mark samples. High brand relevance, unmeasured demand. |
| 8 | `choose-brush-large-watercolor-washes` | Large wash | FB-013, FB-032 | Verified working size and a painting whose brush is identified. FB-013 alone is not Skyward evidence. |
| 9 | `travel-brush-vs-water-brush` | Reservoir vs dip | FB-028 | Fair comparison; do not label Sicon brushes as water brushes. |
| 10 | `handmade-chinese-watercolor-brush-value` | Handmade worth | FB-023, FB-026, FB-080 | Workshop interview as process evidence, not a lifespan guarantee. ST-MAKER is this article’s evidence page, not an 11th article. |

Launch order once evidence exists: **1, 3, 4** first. Hold 2, 6, 7, 8, 9 until comparison samples exist. Article 5 is conditional. Article 10 can follow the Vietnam/T1/workshop pilots.

Editorial components from file 07: ArticleHeader, AnswerSummary, TOC, BrushComparison, StrokeFigure, DimensionFigure, ProcessSteps, ProductRecommendation, ArtistNote, SourcesAndMethod. Product widgets use the public DTO and exact variant URLs. Price changes invalidate article widgets.

Authors must be real people. Tina Wang / Wang Feng may author craft pieces after the About biography facts are verified. Do not name-drop ambassadors as authors.

## 11. Events

Proposed routes: `/events`, `/events/[slug]`. One entity per edition. Do not index a page per Facebook post.

| ID | Proposed slug | Treatment | First assets | Gates |
|---|---|---|---|---|
| EV-VIETNAM-2026 | `saigon-aquarelle-2026` | **Pilot.** Past recap + separate Tina demo block. | FB-004, FB-010, FB-017, FB-019, FB-020 | Confirm role, completion, credits. Exhibition 19–28 Sep 2026 vs demo 19 Sep 11:00–12:30. |
| EV-GBA | `greater-bay-area-urban-sketching` | Urban-sketcher community recap. | FB-006, FB-012 | Official English title, Oct 3–5 2026 Sanshui vs any other booth locations, translated certificate. |
| EV-GALLERY-SANJEEWEE | `sanjeewee-gallery-demo-2026` | Gallery/academy record. | FB-005-01 | Completion, spelling, photos. Not an ambassador profile. |
| EV-GIRESUN-2026 | `giresun-watercolor-festival-2026` | Materials-partner archive. | FB-075-01 | Role/completion. VID-06/07 stay Izmir/unspecified Turkey. |
| EV-BANGKOK-DEMO | `bangkok-brush-demonstration` | Small artist meeting. | FB-124 | Date, venue, Zhong Jianping spelling, permission, brush model. Stay unpublished if thin. |
| EV-GOOD-MARKET | `good-market-art-day-colombo` | Community participation. | FB-125 | Date, booth/role, brush-use photos. Atmosphere shots are insufficient. |
| EV-THAILAND-LAUNCH | `sicon-art-thailand-launch` | Brand timeline. | FB-126 | Date, city, venue, partners. No local warehouse/distributor inference. |

Event page recipe: one H1, outcome summary, date/place/role fact box, credited gallery, what artists tried, named products only if confirmed, link to a buying guide, collaborate CTA. Past events stay public and labelled past. No invented attendance, sales, or organizer quotes.

Schema: Article/BreadcrumbList for recaps. Event markup only with required facts and correct lifecycle. Sicon Art as sponsor is not automatically organizer. No event Offers.

Fujian Tulou trip and Li Zijian carnival remain source-register backlog.

## 12. Ambassadors and collaborate

Proposed routes: `/ambassadors`, `/ambassadors/[slug]`, `/collaborate`. Optional “Community” nav group once pages are live.

**There is no approved ambassador roster in this pack.** Named people in media (Tina Wang, Sanjeewee, Zhong Jianping, Pete Sirodom, irina_kulemina_art, lenas.art.corner, eugeniko_art, woman_23, and poster-only handles) are not ambassadors by default.

SEO-501 starts as an internal register: name, approved spelling, relationship (`founder`, `demonstrating artist`, `customer`, `gift recipient`, `ambassador`, `unknown`), consent, source URLs, SKUs actually used.

File 12 first-content target: one past event (Vietnam) + two approved ambassadors + collaborate page. The two ambassador profiles stay blocked until the owner names them.

Collaborate page: describe programs the business will actually run (sketchwalk demos, workshops, product trials, community support). Form fields from file 12; submissions private, rate-limited, not indexed. Enquiry is not acceptance. No promised fees or coverage.

## 13. Artist testimonials and trust module

Proposed reusable module `TRUST-ARTISTS` with two card types in one section:

1. **Attributed quote** — only TC-01, TC-02, TC-03 after permission, exact wording, source link, gift/sponsor disclosure, no SKU unless verified.
2. **Artist demonstration** — VID-02, VID-04, event clips, FB in-use photos. Caption says the person painted with a Sicon Art brush. It does not say they reviewed it.

Do not manufacture `Review` or `AggregateRating`. Do not move generic quotes onto T1/T3/Chi Ling PDPs.

Player rules: extract a real frame from the same MP4; never use the mismatched highlight JPG; explicit controls; no autoplay audio; no nine simultaneous downloads; visible HTML title/attribution even if the player is lazy; respect reduced-motion.

VideoObject only on a substantive watch page with real `uploadDate`. Homepage clips stay decorative until that page exists.

Replace current homepage testimonials with this module or with nothing.

## 14. Footer

Existing: `src/components/site-footer.tsx` plus `messages/en.json`. Support/legal links already match AGENTS.md except Track order currently sits under Shop.

Proposed visible copy from file 15, after owner wording sign-off:

> Sicon Art creates handmade traditional Chinese brushes for urban sketchers and watercolor artists. Explore compact travel brushes, new brush designs and larger brushes for expressive plein-air painting.

> Worldwide shipping enquiries welcome—from Thailand, Indonesia, Vietnam, India and the USA to destinations across Europe. Check destination availability and rates at checkout, or contact us for a shipping quote.

“New brush designs” links only if a maintained new-arrivals surface exists. Country names are sentence text, not six SEO pages. Hong Kong may be named as a sales market in research; automatic rates still do not exist.

| Group | Links |
|---|---|
| Shop | All brushes; collections only after they are live. |
| Buying guides | Only published articles. |
| Community | Events, ambassadors, collaborate only after those hubs exist. |
| Help | About, FAQ, Shipping, Return & Exchange, Track order, Privacy, Terms, Contact. |
| Utility | AI & product information → `/llms.txt` only when that file is generated and valid. |

No dead links. No hidden keyword lists.

## 15. Media import design

During authorized implementation:

1. Keep original bytes in `docs/seo/assets/facebook/` as provenance.
2. Copy approved images to `public/media/events/<slug>/` or `public/media/products/<slug>/` or `public/media/artists/`.
3. Record `asset_id`, SHA-256, source URLs, caption completeness, rights status, and `publicPath`.
4. Request originals before any full-width hero (current files are ~443–590 px).
5. Alt text starts from the manifest, then adapts to placement. Credits live in visible captions.
6. Remake graphics that contain unapproved dimensions or materials rather than cropping the claim away.
7. Do not upscale feed JPEGs. Do not load whole event galleries as LCP.

Internal editorial preview can render manifests before public routes exist.

## 16. Missing publication facts

Owner evidence still required. Empty means omit the claim, not invent a placeholder.

### Identity and commerce

- [ ] Legal merchant name and public organization facts for schema
- [ ] Authoritative monitored email (`support@` vs `hello@`)
- [ ] Operative return window, return destination, and customer cost
- [ ] Measured product weights (code still uses 50 g estimate, 1 kg cap)
- [ ] Handling vs transit ranges by country
- [ ] Hong Kong shipping rate, or confirm quote-only
- [ ] Availability lifecycle distinct from price
- [ ] GTIN/MPN policy: exist, or omit; do not set `identifier_exists=no` by habit
- [ ] Custom engraving: which SKUs, price, lead time, current availability
- [ ] Production origin wording already in footer (“Orders ship from Dongguan”) confirmed for schema

### Product specifications

- [ ] Qin: 3 / 0.6 / 15 cm and goat-hemp-synthetic mix
- [ ] Happiness: 2.5 / 0.65 / 13 cm and horse-synthetic mix; travel vs short
- [ ] T3: 1.7 / 0.5 / 13 cm; packed length; cap; current hair options
- [ ] Chi Ling: working/packed lengths; **is FB-028-03 a T6 misfile or a Chi Ling alias?**
- [ ] T1: confirm FB-021 and Instagram p/Db-23sNn5Io are this SKU
- [ ] Skyward: materials, diameter definition, retail price, large-sheet evidence
- [ ] Run Hao: hair/dimensions if claimed
- [ ] Whether diameter on graphics is mounting-end hair diameter
- [ ] Live overlay prices for any under-$20 or comparison widget

### Events

- [ ] Vietnam: approved role (co-sponsor vs exhibitor vs demo), completion, photo credits
- [ ] GBA: official English title/edition, full venue list, certificate translation
- [ ] Sanjeewee: completion, approved spelling, demo photos, student-work rights
- [ ] Giresun: completion, contract role vs poster wording, document credit
- [ ] Bangkok: date, venue, artist-approved name, permission, brush
- [ ] Good Market: date, booth/role, brush-use photos
- [ ] Thailand launch: date, city, venue, partner roles
- [ ] Izmir IAAF: date and whether it is a separate event entity from Giresun
- [ ] VID-05/VID-07 exact event names

### People, quotes, ambassadors

- [ ] Ambassador roster (minimum two names if directory is to launch)
- [ ] Permission and approved wording for TC-01, TC-02, TC-03
- [ ] Decision on extra poster quotes (sareh_mohebeian, loklokchung, art.annettcoumont)
- [ ] VID-02 eugeniko_art and VID-04 woman_23 reuse permission
- [ ] Gift vs purchase disclosure for thank-you stories
- [ ] Portrait consent for booth visitors in Vietnam/GBA/Thailand photos
- [ ] Artwork credit for sketchbook paintings, temple paintings, and Memories of Izmir
- [ ] Real author biographies for blog posts
- [ ] Whether any review total is evidenced; if not, none is published

### Media production

- [ ] Higher-resolution originals for heroes
- [ ] Full collapsed Facebook captions where a page will quote them
- [ ] Complete album contents if a gallery needs more than the selected 55
- [ ] Audio transcripts / captions for all nine MP4s
- [ ] Real `uploadDate` for any VideoObject
- [ ] Original Instagram story permalinks (currently highlight-level only)

### Markets and demand

- [ ] Keyword Planner exports for TH, VN, ID, US, IN, HK (volumes currently unknown)
- [ ] GSC query/page/country export
- [ ] Relative sales/margin by market for sequencing, not for public claims

## 17. Open decisions for owner review

1. Authorize implementation of Phase 0–1 on a `codex/` branch, still without publishing articles/events.
2. Choose the public support inbox and keep it consistent.
3. Confirm Chi Ling vs T6 on FB-028-03.
4. Name the two ambassador profiles, or delay `/ambassadors` until a roster exists. Collaborate and Vietnam recap can launch without it.
5. Keep article 5 as a standalone URL or fold under-$20 into article 1.
6. Keep `/home-v2` as a noindex conversion preview, or clean it and replace `/` later as a separate decision.
7. Training-crawler policy for GPTBot versus search bots (independent of llms.txt).
8. Whether custom engraving is a current public offer.
9. Whether Memories of Izmir may be used as a large-painting example with “brush model unknown”.
10. Footer delivery paragraph: keep “USA” or use “United States”; whether to mention Hong Kong in the sentence while checkout remains quote-only.

## 18. Proposed tickets beyond the original backlog

Keep SEO-001–004, 101–106, 201–204, 301–303, 401–403, 501–505 from files 08 and 12, and add:

| Ticket | Deliverable |
|---|---|
| SEO-footer | Natural footer copy; conditional live links; support/legal preserved; mobile/keyboard check. |
| SEO-media-001 | Provenance-aware import from manifests; publicPath mapping; no `docs/seo` URLs. |
| SEO-media-002 | Video player + extracted posters + transcript fields; mismatched highlight JPGs unused. |
| SEO-pdp-pilot | T1 in-use module + Vietnam recap internal preview. |
| SEO-pdp-seven | Remaining six product modules after SKU/rights. |
| SEO-blog-10 | Ten briefs as draft records; publish individually when gates pass. |

## 19. Acceptance snapshot for later implementation PRs

When code work is authorized, verify:

- Homepage, shop, three collections, T3, Chi Ling, one variant family with two sizes, one Coming Soon product, unknown slug 404, return-policy redirect, draft article preview, cart/checkout.
- Same SKU/price/availability in HTML, metadata, JSON-LD, cart, feed, and Markdown.
- DB-unavailable case does not emit seed offers.
- Private price-list fields absent from public output.
- No generated ratings.
- Images have real dimensions/alt; galleries keyboard-accessible at 390 px.
- Sitemap contains only published canonical URLs.
- Typecheck and build on the implementation branch.

This planning assignment did not run typecheck/build: no application files changed.

## 20. Out of scope until later instruction

- Replacing `/` with `/home-v2`
- Activating Chinese locale or hreflang
- Publishing any of the ten articles
- Submitting Google Merchant Center or ads
- Creating country clones or Urban Sketchers affiliation claims
- Indexing draft events or ambassador placeholders
- Serving Facebook CDN URLs from the storefront
- Inventing keyword volumes, ratings, GTINs, delivery times, or ambassador status
