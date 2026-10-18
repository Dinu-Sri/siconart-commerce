# Blog design and editorial system

Update: files 10–12 supersede earlier provisional audience/market priorities with the confirmed urban-sketcher focus, six named markets, professional/large-painting segment, sponsored events, collaborations and ambassadors. Demand volumes remain unmeasured.

## Mission and content advantage

Build an artist-led reference for selecting and using Chinese brushes in watercolor and urban sketching. Win through original demonstrations, measured brush differences, maker knowledge and clearly attributed artist experience. Avoid a bulk generic AI article library. Content should help someone choose, paint or care for a real tool, even when they do not buy immediately.

Suggested public label: Journal or Brush Journal, with URLs `/blog` and `/blog/[slug]`. Keep URLs stable if the navigation label changes. Editorial clusters: brush selection, techniques, care, craft/materials, and verified artist field notes. Start with a small set of substantial pages; do not auto-index empty tags, dates or thin author archives.

## Architecture proposal

For the first release use repository-backed structured content or trusted MDX reviewed in Git. This suits a coding-agent workflow and avoids prematurely building a CMS. Later integrate an editorial UI if frequent nontechnical authors require it. Never evaluate arbitrary user-supplied MDX or unchecked HTML; use an allowlisted component model and sanitization.

Proposed article model: slug, title, short excerpt, contentType, primaryIntent, ownerQueryCluster, authorId, reviewerId if real, publishedAt, materiallyUpdatedAt, status, heroImage with alt/credit/rights, sections/content blocks, evidence sources, relatedCollectionIds, testedSkuIds, SEO overrides if needed and optional methodology. readingTime is computed; publication/update dates must be true. Preview requires auth and is noindex; scheduled/draft records never enter public listing, sitemap or Markdown exports.

Start with proposed files `content/blog/`, `content/authors/`, `src/lib/content/` and `src/components/editorial/`. These do not exist in the audited baseline. Keep content validation in CI: unresolved SKU, broken source link, duplicate canonical intent, missing image alt/rights, invalid date or nonexistent author should block publication or require an explicit reviewed exception.

## Visual system and semantics

Reuse warm paper `#FEF9EF`, umber `#523A27`, copper `#A67146`, Inter and Playfair Display. Keep reading surfaces quiet, images accurately colored and product cutouts on white. A strong visual hierarchy should communicate the article's argument through meaningful examples, not decorative panels.

| Component | Reader purpose | Semantic and accessibility contract |
|---|---|---|
| ArticleHeader | Understand topic, author and currency | H1, linked real author, time elements, concise deck; no distracting autoplay. |
| AnswerSummary | Get the direct recommendation quickly | Plain visible text with scope/limits; no duplicated hidden SEO summary. |
| TableOfContents | Navigate long content | Nav with real fragment links; headings remain readable without JS. |
| BrushComparison | Compare measured differences | Table with caption, th/headers, units and source/unknown labels; usable at 390 px. |
| StrokeFigure | See how a brush behaves | Figure/img/figcaption; actual SKU, paper, paint, method and creator attribution. |
| DimensionFigure | Understand physical scale | Accurate labels and mounting-end diameter; matching adjacent text values. |
| ProcessSteps | Follow preparation or care | Ordered list, concise action, optional supporting image; no HowTo rich-result promise. |
| TechniqueGallery | Compare fine/broad marks or pressure | Label by technique/test condition; no unlabelled artistic collage. |
| ProductRecommendation | Find the next tool | Explicit reason and limitation, current retail data, real link, no fake score. |
| ArtistNote | Learn from real practice | Actual contributor, permission, context and relevant artwork; no invented testimonial. |
| SourcesAndMethod | Assess evidence | Linked primary sources and original test procedure; distinguish experience from universal claims. |

Use readable line lengths around 60–75 characters, generous spacing, adequate contrast and a visible focus state. Copper is an accent; check actual contrast for text/buttons on paper. Responsive table overflow should retain headers and indicate scrollability. Respect reduced motion. Product links and image captions should remain useful to a screen reader. Do not add schema merely because a decorative card resembles a review or quiz.

## Image production policy

Prefer original brush and painting photography. Keep product geometry, printed branding, real hair appearance and materials faithful. Catalog dimension diagrams and factual plots need precise authored assets; do not use image generation to invent measurement labels or performance tests. Styled AI marketing visuals may supplement the article when truthful and labelled appropriately; they cannot replace evidence. Capture alt text per image purpose, rights/credit and crop-safe focal point. Include images near the paragraph they explain.

Do not assume all teaching-image preferences transfer to ecommerce branding: use the established Sicon Art typography/design unless requested otherwise. No forced 16:9 crop when a vertical brush detail is clearer. Generate responsive derivatives and reserve dimensions; avoid multi-megabyte originals in reading flow.

## Twelve article briefs

Titles and SKU examples are proposals. Product inclusion requires verified fit and current public state. Calendar CSV is a sequence, not an automatic publishing schedule.

### 1. How to Choose a Travel Watercolor Brush

Intent: choose compact tools; owner query travel watercolor brush buying guide. Outline: direct choice criteria → packed vs working dimensions → point protection and drying → line/wash trade-offs → measured comparison → links to travel collection. Original assets: side-by-side closed/open lengths and same-paper strokes. Candidate products: Chi Ling, T3, T7–T9. Do not claim all are collapsible until verified. CTA: compare current travel options.

### 2. Chinese Brushes for Watercolor: What Changes in Your Painting?

Intent: understand Chinese form in Western watercolor practice. Outline: what the shape changes → loading and release → angle/pressure demonstration → suitability and limits → brush selection. Original assets: one brush producing fine line and wash under documented conditions. Candidate: Xiangfei Scroll after material/measurement approval. Own informational intent; collection owns transactional intent.

### 3. A Small Brush Kit for Urban Sketching

Intent: assemble a practical limited kit. Outline: sketchbook size → one versatile brush plus optional detail tool → packing/drying → a real outdoor sketch sequence. Candidates: Feng Short Sketch, Chi Ling and brush roll. Include a genuine field photo and layout; never describe separate items as a packaged set unless sold that way.

### 4. Soft vs Springy Watercolor Brushes

Intent: understand response, not just material labels. Outline: definitions → controlled pressure/return demonstration → wash vs edges → personal preference limits → selection table. Compare actual samples with recorded test method; do not assign universal numeric softness scores from catalog adjectives.

### 5. How to Clean and Store Natural-Hair Watercolor Brushes

Intent: care and longevity. Outline: gentle rinse → reshape → safe drying → travel storage → warning signs and support. Confirm maker advice and media compatibility. Original close-up drying sequence. Avoid unsupported solvents, prolonged soaking or guarantees of restored damaged hair.

### 6. Fine Lines and Broad Washes with One Chinese Brush

Intent: practical pressure/control technique. Outline: loading → light point → increasing contact → reloading → common failures. Original stroke sequence and an actual painting detail. Candidates: verified Xiangfei or Feng model. State paper/paint and practitioner context.

### 7. Understanding Brush Measurements Before You Buy

Intent: remove size confusion. Outline: tip length → mounting-end shaft diameter → handle/assembled/packed lengths → why size numbers differ → compare actual products. Original accurate dimension diagram and matching text table. Use approved measurement definitions; never measure the travel connector as hair-mounting diameter.

### 8. Natural Hair and Synthetic Blends: Reading Brush Specifications

Intent: explain verified compositions and purchasing preferences. Outline: terms → blended performance as an observation → animal-material disclosure → what to ask when data is missing. Use approved maker terminology. Do not equate weasel, sable and Kolinsky or translate Shantu without evidence. CTA points to individually verified products, not a blanket natural label.

### 9. Flat vs Pointed Brushes for Architectural Watercolor

Intent: choose by shape and mark. Outline: edges/planes → point details → same subject with each → selection by working scale. Candidate Flat Series and a verified pointed brush. Include actual brush width for each size and original painting sequence.

### 10. Inside the Making of a Sicon Art Brush

Intent: craft/provenance. Publish only after maker interview and approved process photography. Outline: materials → assembly/shaping → inspection → limitations of handmade variation. Avoid invented generational histories, sustainability claims or manufacturing stages.

### 11. Choosing a Brush as a Gift for a Watercolor Artist

Intent: gift/collector selection. Outline: painter style → usable vs collectible → dimensions/materials → actual packaging → delivery uncertainty. Candidates: confirmed collectible models and packaging. No fake scarcity or guaranteed arrival date.

### 12. Artist Field Notes: Painting [Real Location] with [Verified Brush]

Intent: first-hand inspiration and technique. Interview an actual artist; include signed-off attribution, original work, exact SKU, step images, difficulty and useful limitations. No placeholder author, invented travel account or fake endorsement. Link to author/artist profile, brush and related technique guide.

## Publishing workflow

Brief → gather original evidence/assets → verify product facts and rights → draft → artist/editor review → technical preview/mobile/accessibility check → metadata/schema/internal links → publish → measure. AI can assist structure/editing but must not fabricate hands-on experience. Publish one strong article when evidence is ready; there is no required frequency or minimum word count.

Before approval, answer: does this add original information; does the visual demonstrate its nearby claim; can the reader identify author/source; does the recommended SKU actually suit the task; can the article be understood without purchasing; does it overlap an existing URL? Materially update only when facts change; never bump dates for freshness alone.
