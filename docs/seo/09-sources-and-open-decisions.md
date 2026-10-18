# Sources, research limits and open decisions

Update: files 10–12 supersede earlier provisional audience/market priorities with the confirmed urban-sketcher focus, six named markets, professional/large-painting segment, sponsored events, collaborations and ambassadors. Demand volumes remain unmeasured.

Retrieved/checked 18 October 2026. Recheck current primary documentation before implementation, especially supported Google features, merchant requirements, crawler policies and installed Next.js API behavior. Links are references, not permission to copy competitor text or images.

## Primary technical sources

| ID | Source | Use |
|---|---|---|
| S01 | https://developers.google.com/search/docs/specialty/ecommerce | Ecommerce discovery and site architecture. |
| S02 | https://developers.google.com/search/docs/appearance/structured-data/merchant-listing | Current product merchant structured data; offers, shipping, returns and requirements. |
| S03 | https://developers.google.com/search/docs/appearance/structured-data/product-variants | Single-page/multiple-page variant models and ProductGroup. |
| S04 | https://developers.google.com/search/docs/appearance/structured-data/organization | Business identity and organization-level information. |
| S05 | https://developers.google.com/search/docs/appearance/structured-data/article | Article metadata and authorship. |
| S06 | https://support.google.com/merchants/answer/7052112?hl=en | Merchant product data attributes and per-market constraints. |
| S07 | https://support.google.com/merchants/answer/160161?hl=en | Legitimate identifiers and manufacturer numbering. |
| S08 | https://developers.google.com/search/docs/appearance/ai-features | Google AI inclusion uses search fundamentals; no special AI-file requirement. |
| S09 | https://developers.google.com/search/updates?hl=en | June 2026 llms clarification and FAQ feature removal; May 7 FAQ discontinuation. |
| S10 | https://developers.openai.com/api/docs/bots | OAI-SearchBot vs GPTBot; independent controls and verification guidance. |
| S11 | https://llmstxt.org/ | Community llms.txt v2 proposal, modified August 10, 2026. |
| S12 | https://nextjs.org/docs/app/api-reference/functions/generate-metadata | Metadata API. Cross-check Next 15 compatibility. |
| S13 | https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap | Sitemap file convention. |
| S14 | https://nextjs.org/docs/app/guides/json-ld | Safe JSON-LD implementation. |
| S15 | https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites | URL/canonical consistency and facet pitfalls. |

## Project and qualitative market evidence

- Repository: https://github.com/Dinu-Sri/siconart-commerce/tree/97f9bcbd758719b2d1270d73f2b068b83f2aa64f . Inspected source paths are listed in the audit. No production DB or private price data is reproduced in this pack.
- Live site samples: https://siconart.com/ , https://siconart.com/shop , https://siconart.com/about , https://siconart.com/faq , https://siconart.com/products/ruyue-short-brush , https://siconart.com/products/little-gourd-sprite-brush . Retrieval dates differ from underlying search snapshots; current source and live overrides may differ.
- Primary manufacturer benchmark: https://escoda.com/en/ and https://www.escoda.com/wp-content/uploads/pdf/escoda-catalog-eng.pdf . Useful for named families, travel form, real sizing and artist relationships. No superiority or price comparison against Sicon Art has been established.
- Secondary retail SERP context: https://www.jacksonsart.com/en-us/techniques/plein-air/travel-brushes . Demonstrates travel category competition; not a demand-volume source.
- Related brand ecosystem search results: https://watercolor.lk/natural-hair-vs-synthetic-watercolor-brushes-which-are-better/ and https://watercolor.lk/using-chinese-brushes-for-calligraphy-and-watercolor/ . These appeared in search; full editorial overlap/ownership was not audited. Confirm relationship and review before cross-linking. Do not syndicate identical articles or build an artificial link network.

Keyword findings are a seed strategy, not a full multi-country rank/volume study. No GSC/GA/Merchant Center account was inspected. No Lighthouse/CrUX score was measured. Browser-rendered visual QA and checkout verification remain implementation tasks.

## Owner decisions and requested evidence

| Decision/evidence | Why it matters | Safe default while waiting |
|---|---|---|
| Actual sales/margins/stock within confirmed TH/VN/ID/US/IN/HK markets | Determines rollout sequencing | Markets confirmed by owner; relative performance and demand remain unknown. |
| GSC export by query/page/country/device | Reveals existing opportunity and migration risks | No demand ranking or traffic forecast. |
| Keyword Planner export by target country | Validates highest-demand relevant clusters | Hypothesis labels in keyword map. |
| Actual manufacturer facts and measured dimensions | Product differentiation and accurate entity data | Omit unverified claims; preserve workbook gaps. |
| Approved stock/preview/discontinued lifecycle | Prevents false InStock/free-product offers | Exclude ambiguous offers from feed. |
| Legal merchant, policies, return destination and monitored email | Organization/schema/merchant trust | Preserve no invented legal/contact facts; verify support vs hello inbox. |
| Review evidence and artist permissions | Prevents unsupported trust claims | Remove generated ratings; omit unverified endorsements. |
| Real weights and handling/transit ranges by country | Shipping parity and merchant eligibility | Keep manual-quote limits; do not fabricate delivery schema. |
| Actual primary target buyer and hero products | Prioritizes first collection and article set | Travel/urban sketching first as a provisional fit decision. |
| Training crawler policy | Independent from search visibility | Preserve current controls; document later owner choice. |
| Maker interview, sample paintings and author biographies | Original blog authority | Framework can launch; articles stay drafts until evidence exists. |

These decisions should not block reversible implementation of metadata builders, validators, routing fixtures, safe content components and a public DTO. They do block publishing unsupported factual claims, offers, legal terms or account submissions that depend on the answer.
