# Sponsored events, ambassadors and future collaborations

Owner requirement added 18 October 2026: dedicated sponsored-event content covering existing/past events, future collaboration opportunities, and existing brand ambassadors. These are planned site features; no new pages have been implemented by this documentation update.

## Purpose

Build a coherent public record of who uses Sicon Art, where the brand contributes and how the brushes perform in real painting. These pages can support branded/name/event searches, original editorial evidence, product discovery and qualified partnership enquiries. They do not automatically confer search authority, backlinks or ranking gains.

Distinguish **sponsored**, **organized**, **exhibiting**, **demonstrated at**, and **attended**. Each page must state the actual relationship. A group photograph is not evidence of sponsorship, and an artist appearance does not automatically make that artist an ambassador. Confirm participants, affiliations and permission before publication.

## Proposed routes and keyword ownership

| Route | Purpose | Owns intent |
|---|---|---|
| `/events` | Human-readable hub for supported events, with past/upcoming views | Sicon Art events, sponsored sketchwalks, brush demonstrations. |
| `/events/[slug]` | One authoritative record per actual event/edition | Actual event name + date/location + Sicon Art involvement. |
| `/collaborate` | Explain collaboration possibilities and accept relevant enquiries | Sicon Art sponsorship/collaboration; watercolor workshop sponsor enquiry. |
| `/ambassadors` | Brand-ambassador directory with real introductory context | Sicon Art ambassadors and artist collaborations. |
| `/ambassadors/[slug]` | One substantial profile per approved ambassador | Artist name + Sicon Art, artist's brush demonstrations and verified practice. |
| `/blog/[slug]` | Technique/buying guidance derived from events and artists | Painting/selection question rather than duplicate event/biography intent. |

Use “Community” as an optional navigation grouping for Events, Ambassadors and Collaborate; keep primary shopping and blog paths easy to find. Country/type filters can serve the hub without creating indexable empty tag pages. Do not create a separate country ambassador page for one short profile.

## Sponsored event content model

Internal data: stable id/slug, approved title, edition/year, publication status, actual start/end with timezone when known, country/city/venue, organizer identity/URL, Sicon Art relationship and sponsorship scope, lifecycle status, short description, full recap/program, participating artist/ambassador IDs, actually demonstrated SKU IDs, media with rights/captions, public registration URL if any, evidence source links, approval record and material updatedAt. Keep private contracts, fees, personal contact details and negotiated sponsorship terms outside the public model.

Past-event page: precise event/date/place, what the brand contributed, what participants painted, useful lessons, selected captioned photographs, named contributors where authorized, specific product demonstrations and organizer/source links. Keep it available after the event; label past status clearly and remove stale registration CTAs. Preserve backlinks and useful history without pretending the event is upcoming.

Upcoming-event page: only publish confirmed information; state actual organizer, schedule/timezone, public attendance/registration details and Sicon Art role. Mark cancellation/rescheduling accurately; never move dates forward to maintain visibility. A future collaboration idea without agreed event details belongs on the collaboration page or stays internal, not in a fabricated public event listing.

If an existing event article and a deeper technique article both exist, give them different jobs. Event record owns event identity and recap; blog owns the technique and links to the event as evidence. Do not duplicate full text across both and add self canonicals to each.

## Brand ambassador profile

Publish an approved artist name, real portrait, country/base only with consent, relevant biography, actual practice (urban sketching, plein air, watercolor, instruction), relationship type and accurate current/former status, signed-off quotes, selected original works, exact brushes actually used, demonstrations, event participation and verified external profiles. Provide meaningful content beyond a portrait/name grid.

Ambassador is a commercial relationship, not an independent-review credential. Disclose the relationship plainly; indicate gifted products, commissions or affiliate arrangements where applicable. Do not label ambassadors “verified buyers” or their endorsements independent. Do not invent ratings or convert a promotional quote into aggregate product review data.

If the same person authors blog content, use one stable Person ID across author references and ambassador profile. Prefer the ambassador page as that person's primary site profile; a separate author archive can reference it rather than duplicating the biography. Real author/reviewer assignments must reflect actual contribution, not name-dropping for SEO.

## Collaboration page and enquiries

Explain actual supported opportunities, for example brush demonstrations at sketchwalks, artist-led workshops, product trials, community-event support or retailer/community partnerships—but only offer programs the business is willing to run. State selection criteria, information required and how enquiries are reviewed. Do not promise sponsorship, fees, gifts, global coverage or response time unless approved.

Proposed form fields: applicant/organization name, public role/profile/website, email, country/city, opportunity type, proposed event date/timezone if applicable, audience description and approximate attendance clearly identified as applicant estimate, proposed activities, requested support and optional public supporting links. Collect only necessary information; add privacy notice, server validation, rate limiting and accessible success/error states. Submission means enquiry, not acceptance. Keep applicant data and private proposals out of search/schema/Markdown exports.

Do not ask for passwords, full identity documents, payment data or unnecessary sensitive information. Keep internal review status private. Track a qualified collaboration enquiry separately from a store purchase.

## Relationships and internal linking

- Event → participating ambassador and actual product demonstration.
- Ambassador → selected genuine events, authored demonstrations and brushes actually used.
- Product → relevant artist painting/event example with caption explaining what it proves.
- Technique article → exact demonstration/product and source event.
- Collaboration page → representative approved past collaborations and relevant event/ambassador hub.

Use selective links with explanatory context. Avoid linking every event to every product or manufacturing a network of reciprocal paid links. Organizers/artists may independently cite useful documentation; do not make keyword-rich dofollow backlinks a sponsorship condition.

## Schema and crawler rules

Organization ID should be shared with the storefront. Ambassador profiles can use Person plus ProfilePage when the page meets current Google profile guidance; the directory is not an individual profile. Express the ambassador relationship truthfully in visible text rather than inventing a special “BrandAmbassador” rich-result type. sameAs should identify the artist's verified profiles, not unrelated event pages or all product links.

An actual event can be described with Event vocabulary when appropriate, but Google event-feature eligibility requires the current guideline checks. Use a dedicated detail URL; exact dates/location/status; real organizer; real registration/offer only where it exists. Sicon Art as sponsor is not automatically organizer. A historical recap, application form, product promotion or generic sponsorship page is not an upcoming event opportunity. Do not invent price=0 for an unpriced or unknown event. Verify feature country/language support before promising event search exposure in each market.

Use Article/BlogPosting for an editorial recap where that describes the page, Person/ProfilePage for qualifying artist profiles and BreadcrumbList for navigation. Do not apply every schema type to every page. Keep planned/private records noindex and access-controlled; index only approved substantive public pages, add genuine update dates to sitemap, and generate public Markdown only from approved records. A public archive is allowed to include authentic past events.

For external links that are advertisements, paid placements or other compensated links, apply `rel=sponsored` (or an appropriate combination under current guidance). Ordinary editorial source links are different. Sponsorship disclosure and link qualification should reflect the actual agreement rather than automatically marking every outbound artist/source link sponsored.

## Proposed tickets

| Ticket | Planning deliverable / acceptance |
|---|---|
| SEO-501 | Event and ambassador fact/asset register: no invented identities/roles/dates; consent and source provenance recorded. |
| SEO-502 | Events hub/detail lifecycle: authentic past pages retained; confirmed future pages accurate; no duplicate recap ownership; mobile/keyboard checks. |
| SEO-503 | Ambassador directory/profiles: approved bios/relationship disclosures, one Person identity across authored content, genuine product links. |
| SEO-504 | Collaborate page/form: real program descriptions, minimal private data, secure handling, noindex/private submissions and qualified-enquiry measurement. |
| SEO-505 | Schema/internal links/sitemaps: match visible roles/status; eligible types validated; no private proposals, fake reviews or paid ranking links. |

First content pilot: one well-documented past sponsored event plus two approved ambassadors and a clear collaboration page. These are targets, not a claim that all source records are already available. Gather the actual names, roles, dates, organizer confirmation and approved assets before publishing. The coding agent should plan the models/components now and list missing evidence as publication gates.

## Primary references checked 18 October 2026

- https://developers.google.com/search/docs/appearance/structured-data/event
- https://developers.google.com/search/docs/appearance/structured-data/profile-page
- https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links

These sources support the eligibility/link treatment discussed above; none guarantees visibility or endorses the brand.
