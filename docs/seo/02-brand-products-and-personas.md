# Brand, product entities and sales personas

Update: files 10–12 supersede earlier provisional audience/market priorities with the confirmed urban-sketcher focus, six named markets, professional/large-painting segment, sponsored events, collaborations and ambassadors. Demand volumes remain unmeasured.

## Positioning

Recommended search positioning: artist-led handcrafted Chinese brushes for watercolor and urban sketching. Distinguish functional painting tools from decorative collectibles through measured dimensions, material disclosures and real painting demonstrations. Preserve Sicon Art as the public brand spelling, with SiconArt as an alternate name if approved. Keep the broader gallery/academy identity visible through genuine About, artist and event content; do not let it obscure the storefront's purchase paths.

The public About page presents Wang Feng (Tina) as the founder and an artist based in Dongguan. Treat credentials, awards and affiliations as verification tasks before reusing them in bios or schema. Do not infer that the Sri Lankan project operator, a Hong Kong WhatsApp number, a Chinese shipping origin and the legal merchant are the same entity.

## Buyer hypotheses to validate

| Persona | Job and likely questions | Buying obstacles | Page and evidence to supply |
|---|---|---|---|
| Urban sketcher / traveler | Carry fewer tools; switch between a fine line and wash outdoors. Is the tip protected? What are packed and working lengths? | Portability, drying safely, shipping cost relative to brush price. | Travel collection, real packed dimensions, field demo, brush-roll compatibility. |
| Developing watercolor painter | Choose a useful first upgrade. What does soft vs springy feel like? Can it do my sketchbook size? | Unfamiliar names, size labels, animal-hair preferences, fear of poor point control. | Beginner buying guide, side-by-side strokes, physical dimensions, clear limits. |
| Experienced painter / instructor | Repeatable water release and point response; tools to demonstrate to students. | Generic claims, incomplete materials and inconsistent sizing. | Controlled comparison protocol, close-up wet point, artist demo, verified specs. |
| Collector / gift buyer | Own an unusual, functional artisan object. Is the handle real material or imitation? Is it genuinely limited? | Authenticity, packaging, provenance, delivery date. | Collector collection, truthful handle details, packaging photos, documented edition limits. |
| Retailer / school / community organizer | Reliable supply and suitability for students or a local store. | Lead time, regional terms, volume consistency. | `/become-an-agent` with capability and application information; negotiated prices stay private. |

These are inferred segments, not survey or purchase-cohort findings. Initial prioritization: travel/urban sketching, then functional Chinese watercolor brushes, then collectors. Validate against contribution margin, repeat orders and target-country logistics.

## Entity and relationship model

| Entity | Stable identity | Relations and required facts |
|---|---|---|
| Brand / merchant | Approved organization ID, e.g. origin + `/#organization` | Public brand, legal seller when approved, actual support contacts, verified external profiles. |
| Parent product | Existing product slug plus immutable internal ID | Belongs to collections; materials; form; applications; real images; measurements. |
| Sellable SKU | Existing SKU, with identifier history if changed | Variant/parent association; exact current retail offer; publication and stock status. |
| Variant family | Stable productGroupID | Varies by real attribute such as size; each variant has physical specs and selected URL. |
| Collection | Stable collection slug | Curated membership, primary buying intent, buying guidance, breadcrumbs. |
| Material | Controlled term with verification state | Hair species/blend and percentage if known; handle material separately. |
| Technique | Controlled concept | Wash, detail, line-and-wash, travel, studio; verified recommendations with examples. |
| Article / author / demonstration | Stable slug/author ID | Actual creator, sources, tested SKUs, image rights, publication dates. |

Public Product projection should include: id, sku, slug, approved name/aliases, description, retail price/currency, publicationStatus, availability, variant relation, verified material and dimensions, images with purpose/alt/caption, approved use cases, care guidance, public updatedAt, and provenance/approval status for factual fields. Keep provenance internal except public methodology where useful.

Use a separate type for accessories. A brush roll needs capacity, open/closed dimensions, material, fastening, drying guidance and compatible brush lengths; it does not need a fictional brush feel or hair field.

## Product enrichment protocol

1. Start with travel representatives Chi Ling, T3 and Feng Short Sketch; material-documented Xiangfei Scroll; and one real variant family such as Feng Hui Outline.
2. Complete `product-fact-workbook.csv` with maker/measurement evidence. The catalog's skill labels and feel descriptions remain provisional until owner review.
3. Record tip length, diameter at the hair mounting end, handle length, total assembled length, packed length for travel models, actual weight and units. Define measurement points in a photograph. Do not add tip and handle lengths unless the definitions prove that gives total length.
4. Hair composition: keep the maker's original term and a verified English interpretation. Do not turn “Shantu” into a guessed species; request clarification. Never infer sable, Kolinsky, vegan, sustainable or cruelty-free status from price, color or a product name.
5. Handle: distinguish natural bamboo/wood from imitation materials. Coiled Dragon's source record explicitly describes imitation camel bone and imitation ox horn fittings; do not market these as genuine animal materials.
6. Photograph dry shape, wet point, mounting-end measurement, scale reference, fine-to-broad stroke and actual painting use. Show original source photographs alongside any styled marketing imagery in the asset workflow. Marketing renders must not establish performance evidence.
7. Capture test conditions: brush/SKU, paper, paint, dilution, loading, stroke method, tester and date. Publish findings as observations; avoid universal quantitative performance claims from a casual demo.
8. Write a distinctive short answer: who it suits, what it does, verified physical difference, limitation, care and a link to the next comparison. Do not pad to a word quota.

## Publication rules

Missing optional specifications can be omitted. Missing trustworthy identity, purchasable offer or image blocks merchant-feed inclusion. Unpriced products may have useful preview pages, but must not pretend to be free, in stock, or available for preorder. Out of stock, unpriced, draft, discontinued and made-to-order are different states.

The current code uses support@siconart.com; previous business preference mentioned hello@siconart.com. Confirm the active monitored inbox and propagate one approved support record across policies, email, schema and Markdown. Do not silently switch based on memory.
