export type ProductUse =
  | "detail"
  | "wash"
  | "travel"
  | "sketching"
  | "flat"
  | "line-and-wash"
  | "studio";

export type Product = {
  sku: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  priceCents: number;
  currency: "USD";
  images: string[];
  uses: ProductUse[];
  handle: "travel" | "short" | "long";
  feel: "soft" | "springy" | "balanced";
  level: "beginner" | "enthusiast" | "professional";
  featured?: boolean;
  variants?: Array<{
    sku: string;
    name: string;
    priceCents: number;
    image?: string;
  }>;
  specs: Record<string, string>;
};

export const products: Product[] = [
  {
    sku: "SA0002",
    slug: "travel-series-brush-t3",
    name: "Travel Series Brush - T3",
    category: "Travel Brushes",
    summary: "A compact travel brush for watercolor sketching on location.",
    description:
      "The Travel Series T3 is made for artists who paint outside the studio. It packs neatly, keeps a responsive point, and carries enough water for quick washes and confident line work.",
    priceCents: 1800,
    currency: "USD",
    images: ["/products/travel-series-t3-feature.jpg", "/products/travel-series-t3-thumb.jpg"],
    uses: ["travel", "sketching", "line-and-wash"],
    handle: "travel",
    feel: "balanced",
    level: "enthusiast",
    featured: true,
    specs: {
      "Best for": "Urban sketching, plein air, line and wash",
      "Handle": "Travel handle",
      "Feel": "Balanced point and wash capacity"
    }
  },
  {
    sku: "SA0003",
    slug: "ruyue-short-brush",
    name: "Ruyue Short Brush",
    category: "Short Brushes",
    summary: "A short-handle brush with a controlled point for expressive marks.",
    description:
      "Ruyue is a nimble short brush for artists who want direct control close to the paper. It is suited to expressive sketching, small washes, and layered watercolor studies.",
    priceCents: 1600,
    currency: "USD",
    images: ["/products/ruyue-short-feature.jpg", "/products/ruyue-short-thumb.jpg"],
    uses: ["sketching", "detail"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Sketching and small watercolor studies",
      "Handle": "Short handle",
      "Feel": "Controlled and responsive"
    }
  },
  {
    sku: "SA0005",
    slug: "sicon-art-qin-brush",
    name: "Sicon Art Qin Brush",
    category: "Chinese Brushes",
    summary: "A traditional Chinese brush tuned for watercolor control.",
    description:
      "The Qin Brush connects traditional brush-making with modern watercolor needs. It offers a fine point, graceful belly, and a smooth release for washes and calligraphic strokes.",
    priceCents: 2200,
    currency: "USD",
    images: ["/products/qin-brush-feature.jpg", "/products/qin-brush-thumb.jpg"],
    uses: ["wash", "line-and-wash", "studio"],
    handle: "long",
    feel: "soft",
    level: "professional",
    featured: true,
    specs: {
      "Best for": "Watercolor washes and calligraphic line",
      "Hair feel": "Soft natural blend",
      "Character": "Fine point with generous water holding"
    }
  },
  {
    sku: "SA0006",
    slug: "happiness-short-travel-brush",
    name: "Happiness Short Travel Brush",
    category: "Travel Brushes",
    summary: "A portable brush for small kits, journaling, and travel painting.",
    description:
      "A cheerful compact brush for artists who like to keep a capable watercolor tool close at hand. It is small enough for travel while still carrying useful water for sketchbook work.",
    priceCents: 1500,
    currency: "USD",
    images: ["/products/happiness-travel-feature.jpg"],
    uses: ["travel", "sketching"],
    handle: "travel",
    feel: "balanced",
    level: "beginner",
    specs: {
      "Best for": "Travel journals and small studies",
      "Handle": "Compact travel format",
      "Kit role": "Everyday portable brush"
    }
  },
  {
    sku: "SA0007",
    slug: "sicon-art-flat-brush-series",
    name: "Sicon Art Flat Brush Series",
    category: "Flat Brushes",
    summary: "Flat brushes for edges, broad strokes, and controlled shape work.",
    description:
      "The Flat Brush Series is designed for crisp edges, architectural strokes, block-in work, and controlled flat washes. Choose the size that matches your sketchbook or studio format.",
    priceCents: 1400,
    currency: "USD",
    images: ["/products/flat-series-feature.jpg", "/products/flat-series-thumb.jpg"],
    uses: ["flat", "wash", "sketching"],
    handle: "short",
    feel: "springy",
    level: "enthusiast",
    variants: [
      { sku: "SA0008", name: "Size 3", priceCents: 1400, image: "/products/flat-series-size-3.jpg" },
      { sku: "SA0009", name: "Size 5", priceCents: 1700, image: "/products/flat-series-size-5.jpg" }
    ],
    specs: {
      "Best for": "Flat washes, edges, urban sketching shapes",
      "Available sizes": "3, 5",
      "Feel": "Springy flat edge"
    }
  },
  {
    sku: "SA0010",
    slug: "dark-green-short-brush",
    name: "Dark Green Short Brush",
    category: "Short Brushes",
    summary: "A balanced short brush for everyday watercolor sessions.",
    description:
      "The Dark Green Short Brush is an approachable, steady brush for daily practice. It works well for artists who want a short handle, clean control, and a familiar watercolor feel.",
    priceCents: 1500,
    currency: "USD",
    images: ["/products/dark-green-short-feature.jpg", "/products/dark-green-short-thumb.jpg"],
    uses: ["sketching", "detail"],
    handle: "short",
    feel: "balanced",
    level: "beginner",
    specs: {
      "Best for": "Daily watercolor practice",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA0011",
    slug: "feng-short-sketch-brush",
    name: "Feng Short Sketch Brush",
    category: "Urban Sketching Brushes",
    summary: "A lively sketch brush for quick, confident outdoor marks.",
    description:
      "Feng is built for movement. Its short handle and responsive point suit urban sketchers who shift between lines, small washes, and expressive marks.",
    priceCents: 1700,
    currency: "USD",
    images: ["/products/feng-short-sketch-feature.jpg", "/products/feng-short-sketch-thumb.jpg"],
    uses: ["sketching", "travel", "line-and-wash"],
    handle: "short",
    feel: "springy",
    level: "enthusiast",
    featured: true,
    specs: {
      "Best for": "Urban sketching and fast line work",
      "Handle": "Short handle",
      "Feel": "Springy response"
    }
  },
  {
    sku: "SA0012",
    slug: "chi-ling-travel-brush",
    name: "Chi Ling Travel Brush",
    category: "Travel Brushes",
    summary: "A refined travel brush for line, wash, and sketchbook work.",
    description:
      "Chi Ling is a travel-ready brush with a refined point and easy water release. It is a strong choice for artists who want one brush to move between drawing and watercolor passages.",
    priceCents: 1900,
    currency: "USD",
    images: ["/products/chi-ling-travel-feature.jpg", "/products/chi-ling-travel-thumb.jpg"],
    uses: ["travel", "line-and-wash", "sketching"],
    handle: "travel",
    feel: "balanced",
    level: "professional",
    specs: {
      "Best for": "Travel watercolor and line-and-wash",
      "Handle": "Travel handle",
      "Feel": "Refined balanced point"
    }
  },
  {
    sku: "SA0013",
    slug: "qing-yao-detail-brush",
    name: "Qing Yao Detail Brush",
    category: "Detail Brushes",
    summary: "A fine-point detail brush for edges, features, and precise accents.",
    description:
      "Qing Yao is for the last expressive details: fine branches, facial features, rooflines, lettering, and controlled finishing marks. It keeps a sharp point without feeling stiff.",
    priceCents: 1300,
    currency: "USD",
    images: ["/products/qing-yao-detail-feature.jpg", "/products/qing-yao-detail-thumb.jpg"],
    uses: ["detail", "line-and-wash"],
    handle: "short",
    feel: "springy",
    level: "enthusiast",
    featured: true,
    specs: {
      "Best for": "Fine detail and finishing marks",
      "Point": "Sharp detail point",
      "Feel": "Springy"
    }
  },
  {
    sku: "SA0014",
    slug: "tai-chi-group-brush",
    name: "Tai Chi Group Brush",
    category: "Master Grade Brushes",
    summary: "A Yin and Yang brush pairing for expressive contrast.",
    description:
      "The Tai Chi Group pairs two complementary brush characters so artists can move between soft absorbent passages and stronger expressive marks within one set.",
    priceCents: 3200,
    currency: "USD",
    images: ["/products/tai-chi-group-feature.jpg", "/products/tai-chi-group-thumb.jpg"],
    uses: ["wash", "detail", "studio"],
    handle: "long",
    feel: "balanced",
    level: "professional",
    variants: [
      { sku: "SA0015", name: "Brush Set", priceCents: 3200, image: "/products/tai-chi-group-feature.jpg" },
      { sku: "SA0016", name: "Yin Brush", priceCents: 1800, image: "/products/tai-chi-yin.jpg" },
      { sku: "SA0017", name: "Yang Brush", priceCents: 1800, image: "/products/tai-chi-yang.jpg" }
    ],
    specs: {
      "Best for": "Expressive watercolor contrast",
      "Set": "Yin and Yang brush options",
      "Level": "Professional"
    }
  },
  {
    sku: "SA0018",
    slug: "run-hao-short-brush",
    name: "Run Hao Short Brush",
    category: "Short Brushes",
    summary: "A soft short brush for smooth washes and gentle transitions.",
    description:
      "Run Hao is a soft, absorbent short brush for painters who love smooth gradients, gentle washes, and quiet transitions in watercolor.",
    priceCents: 1800,
    currency: "USD",
    images: ["/products/run-hao-short-feature.jpg", "/products/run-hao-short-thumb.jpg"],
    uses: ["wash", "sketching"],
    handle: "short",
    feel: "soft",
    level: "enthusiast",
    specs: {
      "Best for": "Smooth washes and gradients",
      "Handle": "Short handle",
      "Feel": "Soft and absorbent"
    }
  },
  {
    sku: "SA0019",
    slug: "long-handle-brush-series-l5",
    name: "Long Handle Brush Series - L5",
    category: "Long Handle Brushes",
    summary: "A long-handle studio brush series for larger watercolor movement.",
    description:
      "The L5 Long Handle Series gives artists more reach and movement for larger paper, studio sessions, and expressive watercolor work.",
    priceCents: 2400,
    currency: "USD",
    images: ["/products/long-handle-l5-feature.jpg", "/products/long-handle-l5-thumb.jpg"],
    uses: ["wash", "studio"],
    handle: "long",
    feel: "soft",
    level: "professional",
    variants: [
      { sku: "SA0020", name: "Small", priceCents: 2200 },
      { sku: "SA0021", name: "Medium", priceCents: 2600 },
      { sku: "SA0022", name: "Large", priceCents: 3000 }
    ],
    specs: {
      "Best for": "Studio watercolor and larger paper",
      "Handle": "Long handle",
      "Sizes": "Small, medium, large"
    }
  },
  {
    sku: "SA0023",
    slug: "short-handle-series-s1",
    name: "Short Handle Series - S1",
    category: "Short Handle Brushes",
    summary: "A versatile short-handle brush for controlled watercolor painting.",
    description:
      "The S1 Short Handle Series is a practical all-rounder for artists who want control, comfort, and a reliable brush for repeat studio sessions.",
    priceCents: 1700,
    currency: "USD",
    images: ["/products/short-handle-s1-feature.jpg", "/products/short-handle-s1-thumb.jpg"],
    uses: ["sketching", "wash", "detail"],
    handle: "short",
    feel: "balanced",
    level: "beginner",
    specs: {
      "Best for": "General watercolor control",
      "Handle": "Short handle",
      "Role": "Versatile all-rounder"
    }
  }
];

export const categories = Array.from(new Set(products.map((product) => product.category)));

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(cents / 100);
}
