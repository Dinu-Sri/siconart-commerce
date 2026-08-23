# Product images

Each shop product has a folder named after its URL slug.

```text
public/products/<slug>/feature.jpg   White-background classic photo
public/products/<slug>/gallery/      Extra photos: close-ups, in-hand, details
```

Example for Chi Ling Travel Brush (`/products/chi-ling-travel-brush`):

```text
public/products/chi-ling-travel-brush/feature.jpg
public/products/chi-ling-travel-brush/gallery/close-up.jpg
public/products/chi-ling-travel-brush/gallery/in-hand.jpg
```

Rules:

- `feature` is the main product-page photo. Use `.jpg`, `.jpeg`, `.png`, or `.webp`.
- Drop any extra photos into `gallery/`. Names can be anything.
- Keep product cutouts on a white background.
- Refresh the shop after copying files. No code change is required.
- Shop cards pick a random image from `feature` + `gallery` on each visit.
- The private `/list` page still uses `public/products/price-list/`.
