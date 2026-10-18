# AI discovery, llms.txt and public Markdown

The correct optional filename is `/llms.txt`, not llms.txtx. As of this audit it is a community proposal, updated to v2 in August 2026, not a Google indexing requirement. Google explicitly states no special AI files or schema are needed for its AI search features. Prioritize indexable, useful HTML with visible facts, real links and accurate structured data. No file guarantees a citation.

## Useful public architecture

- `/llms.txt`: concise brand/context summary and curated links to genuinely available Markdown resources.
- `/products/[slug].md`: generated public equivalent of the canonical product page, with an exact variant selection option if supported.
- `/collections/[slug].md`: generated selection guidance and public product links.
- `/blog/[slug].md`: published article text and captions, author, sources and canonical HTML link.
- Markdown versions of shipping/returns/About when implemented; do not publish broken references before those routes exist.

In llms.txt v2, links should lead to concise agent-readable detail and may be discovered through alternate/describedby link relations. Keep the file small; a generated catalog index can list all public products behind one link. An optional llms-full.txt is not a prerequisite and should not duplicate a volatile catalog by hand.

## Route implementation decision

Existing middleware excludes paths containing a dot. That helps prevent `.md` from being rewritten through locale routing, but does not implement the route. Choose and test one explicit Next.js route-handler arrangement for suffix resources, such as a top-level dynamic segment that validates and resolves `slug.md`, without shadowing the existing HTML routes. Verify route precedence against the installed Next 15 version. An alternative explicit `/markdown/products/[slug]` route is acceptable if suffix routing is brittle; update discovery links consistently. Do not promise an untested filesystem layout.

Serve UTF-8 `text/markdown; charset=utf-8` and sensible conditional caching. Use an HTTP canonical link to the HTML equivalent and `X-Robots-Tag: noindex` on alternate Markdown to keep traditional search focused on HTML. Noindex does not block fetching; allow the route through robots/WAF. Product pages can advertise the Markdown alternate with `rel=alternate`/type text/markdown and `/llms.txt` with rel=describedby. Confirm clients actually receive headers.

Generate all representations from the same allowlisted DTO/content tree. Mirror currently visible product claims; do not create bot-only sales copy, hidden keyword text or stronger specifications. Unknown products return 404, unpublished content remains inaccessible and variant URLs validate ownership. Review cache invalidation after price/stock updates.

## Public Markdown contract

Include canonical HTML URL, SKU/variant identity, public name, concise suitability, confirmed materials/dimensions, live offer currency/price/availability or clear unpriced state, care, relevant product/guide links, source-of-truth updated timestamp and safe public contact. Include only facts also available to humans. Never publish private artist/wholesale prices, MOQ, margins, internal files, customer data, admin links or unpublished records.

Keep product identifiers and Chinese names faithful to approved records. Define ambiguous material words rather than translating them speculatively. Treat mounting-end shaft diameter consistently across text, image labels and machine exports. Canonical HTML URLs are the preferred citation targets; the Markdown alternate is a reading aid.

## Crawler policy

OAI-SearchBot supports OpenAI search discovery; GPTBot relates to model training. OpenAI documents these controls as independent. Keep public search access available for the stated citation goal. Training consent is a separate owner decision: preserve existing policy until decided; do not quietly introduce a blanket allow or block for training.

If explicit per-agent robots groups are added, repeat the relevant private-route restrictions: a more-specific matching user-agent group does not automatically inherit wildcard rules. Robots directives are not security. Verify current official agent names and published IP verification guidance before changing WAF rules. Never disable bot protection site-wide simply because this audit environment received 403.

For other AI/search agents, consult each provider's current first-party bot documentation rather than assuming a wildcard covers every product or an llms.txt permission overrides robots. Do not claim support for an agent that has not been tested.

## Validation

Fetch llms.txt; parse its headings/links; resolve every listed URL; verify content types and noindex/canonical headers; compare product price/specs against HTML and feed; change a test offer and verify all representations update. Check product, variant, unknown slug, unpriced, unpublished and DB-failure cases. Search public bundles/exports for private-field names and known private test sentinel values.

Measure discovery with verified bot logs, referrals, cited landing URLs and a documented sample of prompts with date/model/region. Citation samples are observational and variable. Do not automate mass search requests or treat self-generated test citations as market visibility.
