# Artist videos, demonstrations and testimonial reuse

The owner identified existing website artist clips as potential trust content. Nine MP4s already exist under `public/instagram/highlights/`; `src/lib/instagram.ts` loads them as generic highlights. `video-trust-register.json` records the exact tracked paths, duration, dimensions, byte counts, audio presence, visual observations and classification. Reuse these files rather than downloading/re-encoding duplicates by default.

## What can support an endorsement

Three candidate exact quotes were observed. These are not star ratings or verified-purchase reviews.

| ID | Attribution in source | Exact quote candidate | Evidence and limits |
|---|---|---|---|
| TC-01 | irina_kulemina_art | “Amazing brush.” | Visible story overlay in VID-01 at 2 seconds. Highlight context retained; original individual story URL and exact brush model not established. Capitalization normalized. |
| TC-02 | lenas.art.corner | “Thank you @tina.wang88 for the ideal brush for these lines” | Visible story overlay in VID-03 at 2 seconds; heart emoji omitted. Confirm approved artist name, quote and website reuse; exact model unknown. |
| TC-03 | Pete Sirodom | “Your travel brush is amazing. I love it.” | Visible nested artist/group post shared by Sicon Art under “Little brushes can paint so smooth watercolor.” The two temple-painting images are FB-122-01/02. Public photo source retained in manifest; direct quote-post permalink not captured. No SKU/purchase verification. |

Use `testimonial-candidates.csv` as editorial input. Preserve actual source wording and attribution. Quote candidates need review of the original context and allowed new website use. The owner's request authorizes collecting and preparing this material; it does not verify the wording of unreviewed audio or resolve a third party's original artwork rights. Keep the surrounding context accessible through a source link where practical.

An artist painting with a brush is evidence of use, not necessarily a statement that they love it. VID-02 and VID-04 are artwork demonstrations without a transcribed endorsement. VID-05–VID-08 show displays/testing or founder/event demonstrations. VID-09 is a brand-authored supporter/shipment message. Do not convert those seven clips into invented customer quotations. VID-06 visibly names IAAF Izmir; do not map it to Giresun solely because both are in Turkey. Other event/recording dates remain unknown.

Do not infer ambassador status, country of residence, real name, exact SKU, price paid, verified purchase, star score or recording date. The generic highlights do not verify the existing site’s numerical review/rating claims. Keep removal of generated/unsupported social proof in the implementation backlog.

## Proposed storefront modules

Use a reusable “Artists using Sicon Art” section with two distinct card types in its data model: attributed quote with evidence; and artist demonstration with a factual title. It may show both within a cohesive section, but captions must make their meaning clear. On a product page, show a clip as a model-specific endorsement only after exact SKU linkage; otherwise use it in a clearly general brand experience section, away from a model rating summary.

A useful card contains a real poster, accessible play button, descriptive title, artist attribution/relationship disclosure, exact quote only when verified, and source context. Keep full artwork credit in the caption. If a clip is brand-produced, gifted, sponsored or part of an ambassador relationship, disclose the actual relationship once confirmed rather than calling it independent.

Use the existing local JPG poster where it matches the clip, or extract a real representative video frame. Never use a different artist’s painting as the poster. Provide explicit controls, `playsInline`, native dimensions/aspect ratio, `preload="none"` or metadata, a real poster and click-to-play. Avoid nine simultaneous video downloads, audio autoplay, hover-only controls, looping motion without a pause control, or a carousel that hides content from keyboards. Respect reduced-motion preferences.

All nine files have audio tracks; audio has not been transcribed in this review. Listen to each clip during editorial preparation, prepare an accurate transcript/captions where meaningful audio exists, include visible story text in accessible nearby HTML, and describe essential visual-only demonstration information. Do not invent WebVTT captions from guesses. Keep text content server-rendered even when the player loads lazily.

## Schema and SEO boundaries

Visible factual testimonials can improve user trust without rating markup. Do not manufacture `Review`/`AggregateRating` values from story overlays, likes, followers or brand thank-you captions. Do not expect self-serving Organization/LocalBusiness reviews to yield Google review stars. A product review must genuinely be about that specific product and satisfy current applicable documentation; an unidentified-brand brush clip is insufficient.

A curated substantive video detail/watch page may use VideoObject after confirming supported properties such as title, description, stable thumbnail URL, uploadDate, duration and contentUrl/embedUrl, matching visible content. File modification time is not uploadDate. Do not fabricate dates merely to populate schema. A decorative homepage clip does not automatically deserve an indexable watch page. Follow file 05 and recheck official Google documentation during implementation.

Measure meaningful engagement and assisted product discovery, not claims of guaranteed rankings or AI citations. No schema or live website changes are included in this handoff.

Official implementation references checked 18 October 2026: [Google review snippet guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet), [VideoObject documentation](https://developers.google.com/search/docs/appearance/structured-data/video), and [event documentation](https://developers.google.com/search/docs/appearance/structured-data/event). These support the schema boundaries above; none guarantees rich-result display.
