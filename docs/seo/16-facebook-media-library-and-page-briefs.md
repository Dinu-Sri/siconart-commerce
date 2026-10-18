# Facebook media library and coding-agent page briefs

Reviewed and downloaded 18 October 2026. This extends the limited recent-post review in file 14. The owner requested a Facebook archive review, selected image acquisition, page mapping and reuse of existing artist videos. This handoff prepares content and implementation planning; it does not publish pages or change the application.

## What was reviewed and acquired

The connected-browser review scrolled the public Sicon Art page from recent posts to the available feed bottom, ending with the Thailand launch and initial cover-photo posts. The feed stopped growing after three further scroll attempts; viewport bottom equalled document bottom. Captured 127 non-empty caption records, deduplicated to 121 source records by visible media identity or normalized caption. These are capture counts, not certified lifetime post totals. Uncaptioned cover updates are not in the register. Facebook can omit unavailable posts, collapse captions and show only preview photos from large albums; a `+71` gallery was not downloaded in full. No claim is made that every album image, complete caption, spoken word or historical post was inspected.

Selected **55 JPEG images, 2,728,375 bytes**, downloaded from browser-observed image addresses and visually checked in contact sheets. These are actual files under `assets/facebook/`, with dimensions and SHA-256 hashes. No temporary CDN signatures, browser captures, publisher/admin controls, private comments or follower lists are included. Existing website videos are referenced at their tracked paths rather than duplicated.

Primary data files:

- `facebook-source-register.json`: 121 deduplicated source records; public source URLs where available; caption completeness flag and image names. Captions are observed excerpts, not automatically publication copy. A missing permalink is explicitly empty, not invented.
- `media-manifest.json` and `media-manifest.csv`: 55 selected files, source association, individual visual alt text, candidate caption, product/event mapping, dimensions, checksum, rights/fact gates and quality limits. JSON also retains source excerpts and URLs.
- `page-media-map.csv`: 26 entity-to-media mappings: seven event candidates, one supporting maker story, ten already-planned commercial articles, seven existing products and one reusable artist module. The supporting maker story can be the article-10 evidence page; it is not an eleventh approved article.
- `video-trust-register.json`, `testimonial-candidates.csv` and file 17: nine existing video files and three exact-quote candidates.

## How to use the images

During planning, import the manifest into a typed content model or CMS design. During authorized implementation, copy approved images into stable public paths, e.g. `public/media/events/<event-slug>/<descriptive-name>.jpg`, and retain the original manifest ID as provenance. Do not serve internal `docs/seo` paths as storefront URLs. Preserve original file bytes here; create optimized responsive derivatives in the application/media pipeline. The current downloaded filenames preserve Facebook resource identities; descriptive published names may differ with a recorded `publicPath` mapping.

Use `next/image` with actual width/height, correct `sizes`, and responsive layout. Request higher-resolution originals for wide heroes; do not upscale a 443–590 px feed image to a full-width sharp hero. Native resolution is recorded per asset. Lazy-load below-fold galleries; preload only the actual LCP hero, avoid loading all event photos above the fold. Preserve the warm-paper/copper design and white product-image panels.

Alt text is image-specific and describes visible content. Use the supplied draft as the starting point, then adapt to placement: empty alt for a repeated decorative thumbnail; accessible text on a linked card must convey destination; poster information needs nearby HTML text. Put artist attribution, event context and source link in a visible caption/credit rather than stuffing keywords into alt. Do not repeat countries, shipping claims, product names or inferred materials in every alt.

Some product graphics include dimensions, material names, performance claims or customization options. Those claims remain visible even if HTML omits them. Verify the graphic itself before public reuse; remake a corrected graphic from approved facts when necessary. Diameter must mean brush-hair diameter at its mounting end, not the handle barrel or connector. Do not infer a hair species or exact blend from a photo. Stylistic Chi Ling/Skyward images have unverified editing provenance; they can illustrate the product after confirmation but must not be presented as documentary proof of the manufacturing process.

## Event page briefs

Use one event entity for its announcement, posters, recap, booth photos and demonstrations. Do not create separate indexable pages for each social post.

| Event ID | Evidence available | Proposed treatment / remaining facts |
|---|---|---|
| EV-VIETNAM-2026 | Co-sponsor announcement, exhibition poster, Tina demonstration poster/schedule, two booth/painting galleries | Strongest first event pilot. A photo-led past-event recap plus a clearly separated demo segment. Demo source gives 19 Sep 2026, 11:00–12:30, Contemporary Art Space, 1 Einstein, Thu Duc, HCMC. Confirm exhibition-wide dates/organizers and approved role. |
| EV-GBA | Booth/group pictures, sponsor-backdrop photo and Chinese organizer gratitude document | Strong urban-sketcher community relevance. Confirm exact official title/edition, dates and venue sequence; Sanshui gathering and multiple booth locations should be reconciled. Translate the certificate accurately; role wording comes from source, not the presence of a logo alone. |
| EV-GALLERY-SANJEEWEE | 7 Oct 2026, 09:00–12:00 gallery/academy poster | Confirm completed event and artist spelling; request actual demo photos. Poster is announcement evidence, not proof of attendance or completion. Do not label artist as ambassador without approved roster. |
| EV-GIRESUN-2026 | Featured materials-partner announcement, festival thank-you poster | Historical partnership candidate, May 9–12 2026 per featured source. Confirm exact role/completion. Izmir clips belong to a different location; never relabel them Giresun. |
| EV-BANGKOK-DEMO | Brand post names Zhong Jianping and Bangkok; table brush-testing photos | Small artist meeting/story candidate. Need date, venue, artist-approved name and model. Do not invent a public festival or sponsorship. |
| EV-GOOD-MARKET | Colombo Good Market Art Day caption and market atmosphere photos | Community archive candidate. Need date, actual brush booth pictures and role; general market photos alone are weak product evidence. |
| EV-THAILAND-LAUNCH | Brand launch caption, brush display and gathering photos | Brand timeline/Thailand community record after date/city/venue confirmation. This does not establish a local warehouse, permanent store or distributor. |

Each event detail should have one accurate H1, concise outcome summary, date/place/role fact box, curated gallery with credits, what artists tried, linked named products only where confirmed, related buying guide, and collaboration CTA. Index cards should lead to these useful pages rather than duplicate long captions. Do not manufacture attendee quotes, attendance counts, sales figures or organizer endorsements. Use Article/BreadcrumbList for an editorial recap; apply Event markup only where the page actually represents the event with the supported required facts and correct lifecycle. See file 12 for the schema decision. Do not invent event Offers or revive expired ticket offers.

The owner wants future sponsorship/collaboration opportunities and brand ambassador pages. The archive supports those sections but does not supply an approved ambassador roster or agreement. The collaboration page can explain the real event support process and contact route once confirmed. Ambassador profiles need approved names, biographies, relationship disclosure, artwork credit, permission and current status; an artist trying a brush is not automatically an ambassador.

## Product pages and buying guides

The seven mapped parent products are T1 Soulmate (SA-07), T3 (SA-05), Chi Ling (SA-14), Happiness (SA-09), Qin (SA-08), Run Hao (SA-34) and Skyward Dragon (SA-45). Candidate model links come from named brand posts and current catalog; verify exact variant before publishing. Current SKU associations may change: reconcile current catalog by stable slug as required by AGENTS.md.

T1 has a particularly useful actual-painting sequence associated by the source with Sanjeewee. Use it as an attributed “in use” story after artist/model confirmation. T3 and Run Hao production photos can support a maker-process section; the quantities in old captions are historical batches, not current availability or lifetime sales. Qin supplies specific stroke imagery; Happiness/Chi Ling supply named form/design graphics. Verify the specifications printed in those graphics. “Memories of Izmir” supplies a large-painting example but no exact brush model, so keep it off a Skyward-specific result claim until confirmed.

All ten commercial briefs now have asset mappings. Pricing and budget articles still need approved live prices; social photos do not establish demand, price or value superiority. Chinese-vs-Western and travel-vs-water-brush articles still need original fair comparative demonstrations. A product beauty image cannot substitute for a head-to-head test. T3-vs-Chi Ling needs measured working/packed dimensions, mark samples and confirmed composition. Article 8 must distinguish a large-brush product photo from an artwork made with an unidentified brush. Article 10 should use the workshop interview imagery and verified process explanation rather than vague heritage or lifespan claims.

Countries should appear where the evidence is real: Vietnam/Turkey event context, Thailand launch/customer story, Colombo local activity. Sales-target pages for Indonesia, US, India, Hong Kong etc. still need their actual shipping/offer facts; do not imply these archives contain events in all target countries.

## Publication gates and implementation sequence

1. Read this pack and current code; produce the requested implementation plan. Keep this assignment planning-only until the owner authorizes implementation.
2. Build a private editorial preview/CMS import from the manifests. Use explicit `draft`, `factChecked`, `rightsChecked`, `publishedAt` and media provenance fields. Empty facts must remain empty; do not render placeholders as public claims.
3. Prepare the Vietnam event and T1 product-use pilot. Obtain missing event facts, approved credit/model mapping and original-resolution assets where needed. The owner authorized collection and planned reuse; factual and third-party credit checks are editorial publication gates, not a reason to stop unrelated technical work.
4. Prepare the other event candidates, artist module and ten commercial articles in stages. Publish only substantive approved records. No thin country clones or automatic publishing of all 121 source captions.
5. Verify readable server-rendered text, internal product links, unique metadata/canonicals, image dimensions/alt, keyboard gallery use, mobile layout, accurate schema, sitemap inclusion only after publication, and no console/asset errors. Run app checks required by AGENTS.md when code changes are made. No app build is necessary for this documentation/media-only handoff.

Keep public-facing prose useful and natural. Raw excerpts, uncertainty flags, asset hashes and internal approvals belong in the editorial data and implementation plan, not in the customer journey.
