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
    sku: "SA-14",
    slug: "chi-ling-travel-brush",
    name: "Chi Ling Travel Brush",
    category: "Travel Brushes",
    summary: "A portable handcrafted brush for watercolor sketching, travel kits, and painting away from the studio.",
    description: "Chi Ling Travel Brush is made for artists who paint beyond the studio. It keeps the Sicon Art focus on responsive control, useful water holding, and a compact feel for travel watercolor, urban sketching, and sketchbook painting.",
    priceCents: 1200,
    currency: "USD",
    images: ["/products/price-list/sa-14-chi-ling-travel-brush.jpg"],
    uses: ["travel", "sketching", "line-and-wash"],
    handle: "travel",
    feel: "balanced",
    level: "beginner",
    featured: true,
    specs: {
      "Best for": "Travel watercolor, sketchbooks, plein air",
      "Brush type": "Travel Brushes",
      "Handle": "Travel handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-06",
    slug: "ruyue-short-brush",
    name: "Ruyue Short Brush",
    category: "Short Brushes",
    summary: "A compact short-handle brush for controlled watercolor practice, sketching, and everyday painting.",
    description: "Ruyue Short Brush gives artists a close-to-paper feel for controlled watercolor painting. It is practical for daily practice, sketching, layered studies, and expressive small-format work.",
    priceCents: 1300,
    currency: "USD",
    images: ["/products/price-list/sa-06-ruyue-short-brush.jpg"],
    uses: ["sketching", "detail", "wash"],
    handle: "short",
    feel: "balanced",
    level: "beginner",
    featured: true,
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Short Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-05",
    slug: "travel-series-brush-t3",
    name: "Travel Series Brush - T3",
    category: "Travel Brushes",
    summary: "A portable handcrafted brush for watercolor sketching, travel kits, and painting away from the studio.",
    description: "Travel Series Brush - T3 is made for artists who paint beyond the studio. It keeps the Sicon Art focus on responsive control, useful water holding, and a compact feel for travel watercolor, urban sketching, and sketchbook painting.",
    priceCents: 1300,
    currency: "USD",
    images: ["/products/price-list/sa-05-travel-series-brush-t3.jpg"],
    uses: ["travel", "sketching", "line-and-wash"],
    handle: "travel",
    feel: "balanced",
    level: "beginner",
    featured: true,
    specs: {
      "Best for": "Travel watercolor, sketchbooks, plein air",
      "Brush type": "Travel Brushes",
      "Handle": "Travel handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-12",
    slug: "dark-green-short-wood-brush",
    name: "Dark Green Short WOOD Brush",
    category: "Short Brushes",
    summary: "A compact short-handle brush for controlled watercolor practice, sketching, and everyday painting.",
    description: "Dark Green Short WOOD Brush gives artists a close-to-paper feel for controlled watercolor painting. It is practical for daily practice, sketching, layered studies, and expressive small-format work.",
    priceCents: 2300,
    currency: "USD",
    images: ["/products/price-list/sa-12-dark-green-short-wood-brush.jpg"],
    uses: ["sketching", "detail", "wash"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Short Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-22",
    slug: "feng-short-sketch-brush",
    name: "Feng Short Sketch Brush",
    category: "Urban Sketching Brushes",
    summary: "A lively sketching brush for quick marks, line-and-wash studies, and confident outdoor painting.",
    description: "Feng Short Sketch Brush is built for fast, confident movement between line, small washes, and expressive marks. It suits urban sketchers and watercolor painters who need a brush that responds quickly on location.",
    priceCents: 1350,
    currency: "USD",
    images: ["/products/price-list/sa-22-feng-short-sketch-brush.jpg"],
    uses: ["sketching", "travel", "line-and-wash"],
    handle: "short",
    feel: "springy",
    level: "beginner",
    featured: true,
    specs: {
      "Best for": "Urban sketching, line and wash",
      "Brush type": "Urban Sketching Brushes",
      "Handle": "Short handle",
      "Feel": "Springy"
    }
  },
  {
    sku: "SA-09",
    slug: "happiness-short-travel-brush",
    name: "Happiness Short Travel Brush",
    category: "Travel Brushes",
    summary: "A portable handcrafted brush for watercolor sketching, travel kits, and painting away from the studio.",
    description: "Happiness Short Travel Brush is made for artists who paint beyond the studio. It keeps the Sicon Art focus on responsive control, useful water holding, and a compact feel for travel watercolor, urban sketching, and sketchbook painting.",
    priceCents: 1350,
    currency: "USD",
    images: ["/products/price-list/sa-09-happiness-short-travel-brush.jpg"],
    uses: ["travel", "sketching", "line-and-wash"],
    handle: "travel",
    feel: "balanced",
    level: "beginner",
    specs: {
      "Best for": "Travel watercolor, sketchbooks, plein air",
      "Brush type": "Travel Brushes",
      "Handle": "Travel handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-26",
    slug: "red-tiny-brush",
    name: "Red Tiny Brush",
    category: "Detail Brushes",
    summary: "A fine-control brush for precise lines, finishing marks, edges, and expressive detail work.",
    description: "Red Tiny Brush is designed for fine marks, edges, lettering, branches, figures, and finishing details. It gives watercolor artists a focused point and responsive control for the final moments of a painting.",
    priceCents: 1400,
    currency: "USD",
    images: ["/products/price-list/sa-26-red-tiny-brush.jpg"],
    uses: ["detail", "line-and-wash"],
    handle: "short",
    feel: "springy",
    level: "beginner",
    specs: {
      "Best for": "Fine detail, edges, line work",
      "Brush type": "Detail Brushes",
      "Handle": "Short handle",
      "Feel": "Springy"
    }
  },
  {
    sku: "SA-24",
    slug: "sicon-art-travel-brush-t7",
    name: "Sicon Art Travel Brush T7",
    category: "Travel Brushes",
    summary: "A portable handcrafted brush for watercolor sketching, travel kits, and painting away from the studio.",
    description: "Sicon Art Travel Brush T7 is made for artists who paint beyond the studio. It keeps the Sicon Art focus on responsive control, useful water holding, and a compact feel for travel watercolor, urban sketching, and sketchbook painting.",
    priceCents: 2300,
    currency: "USD",
    images: ["/products/price-list/sa-24-sicon-art-travel-brush-t7.jpg"],
    uses: ["travel", "sketching", "line-and-wash"],
    handle: "travel",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Travel watercolor, sketchbooks, plein air",
      "Brush type": "Travel Brushes",
      "Handle": "Travel handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-25",
    slug: "sicon-art-travel-brush-t8",
    name: "Sicon Art Travel Brush T8",
    category: "Travel Brushes",
    summary: "A portable handcrafted brush for watercolor sketching, travel kits, and painting away from the studio.",
    description: "Sicon Art Travel Brush T8 is made for artists who paint beyond the studio. It keeps the Sicon Art focus on responsive control, useful water holding, and a compact feel for travel watercolor, urban sketching, and sketchbook painting.",
    priceCents: 2300,
    currency: "USD",
    images: ["/products/price-list/sa-25-sicon-art-travel-brush-t8.jpg"],
    uses: ["travel", "sketching", "line-and-wash"],
    handle: "travel",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Travel watercolor, sketchbooks, plein air",
      "Brush type": "Travel Brushes",
      "Handle": "Travel handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-15",
    slug: "sicon-art-travel-brush-t9",
    name: "Sicon Art Travel Brush T9",
    category: "Travel Brushes",
    summary: "A portable handcrafted brush for watercolor sketching, travel kits, and painting away from the studio.",
    description: "Sicon Art Travel Brush T9 is made for artists who paint beyond the studio. It keeps the Sicon Art focus on responsive control, useful water holding, and a compact feel for travel watercolor, urban sketching, and sketchbook painting.",
    priceCents: 2300,
    currency: "USD",
    images: ["/products/price-list/sa-15-sicon-art-travel-brush-t9.jpg"],
    uses: ["travel", "sketching", "line-and-wash"],
    handle: "travel",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Travel watercolor, sketchbooks, plein air",
      "Brush type": "Travel Brushes",
      "Handle": "Travel handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-07",
    slug: "t1-soulmate-limited-travel-brush",
    name: "T1 Soulmate Limited Travel Brush",
    category: "Travel Brushes",
    summary: "A portable handcrafted brush for watercolor sketching, travel kits, and painting away from the studio.",
    description: "T1 Soulmate Limited Travel Brush is made for artists who paint beyond the studio. It keeps the Sicon Art focus on responsive control, useful water holding, and a compact feel for travel watercolor, urban sketching, and sketchbook painting.",
    priceCents: 3900,
    currency: "USD",
    images: ["/products/price-list/sa-07-t1-soulmate-limited-travel-brush.jpg"],
    uses: ["travel", "sketching", "line-and-wash"],
    handle: "travel",
    feel: "balanced",
    level: "professional",
    specs: {
      "Best for": "Travel watercolor, sketchbooks, plein air",
      "Brush type": "Travel Brushes",
      "Handle": "Travel handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-20-E",
    slug: "t10-travel-brush-ember",
    name: "T10 Travel Brush 灼 (Ember)",
    category: "Travel Brushes",
    summary: "A portable handcrafted brush for watercolor sketching, travel kits, and painting away from the studio.",
    description: "T10 Travel Brush 灼 (Ember) is made for artists who paint beyond the studio. It keeps the Sicon Art focus on responsive control, useful water holding, and a compact feel for travel watercolor, urban sketching, and sketchbook painting.",
    priceCents: 1500,
    currency: "USD",
    images: ["/products/price-list/sa-20-e-t10-travel-brush-ember.jpg"],
    uses: ["travel", "sketching", "line-and-wash"],
    handle: "travel",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Travel watercolor, sketchbooks, plein air",
      "Brush type": "Travel Brushes",
      "Handle": "Travel handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-20-ST",
    slug: "t10-travel-brush-still",
    name: "T10 Travel Brush 默 (Still)",
    category: "Travel Brushes",
    summary: "A portable handcrafted brush for watercolor sketching, travel kits, and painting away from the studio.",
    description: "T10 Travel Brush 默 (Still) is made for artists who paint beyond the studio. It keeps the Sicon Art focus on responsive control, useful water holding, and a compact feel for travel watercolor, urban sketching, and sketchbook painting.",
    priceCents: 1400,
    currency: "USD",
    images: ["/products/price-list/sa-20-st-t10-travel-brush-still.jpg"],
    uses: ["travel", "sketching", "line-and-wash"],
    handle: "travel",
    feel: "balanced",
    level: "beginner",
    specs: {
      "Best for": "Travel watercolor, sketchbooks, plein air",
      "Brush type": "Travel Brushes",
      "Handle": "Travel handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-13-A",
    slug: "chi-xiao-qingming-brush-a",
    name: "Chi Xiao & QingMing Brush A",
    category: "Chinese Brushes",
    summary: "A traditional Chinese-style watercolor brush made for smooth release, expressive marks, and brush control.",
    description: "Chi Xiao & QingMing Brush A brings traditional Chinese brush character into modern watercolor painting, with a focus on control, water release, and expressive mark-making for artists who want one beautiful tool to do more.",
    priceCents: 1500,
    currency: "USD",
    images: ["/products/price-list/sa-13-a-chi-xiao-qingming-brush-a.jpg"],
    uses: ["wash", "line-and-wash", "studio"],
    handle: "short",
    feel: "soft",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Chinese Brushes",
      "Handle": "Short handle",
      "Feel": "Soft"
    }
  },
  {
    sku: "SA-13-B",
    slug: "chi-xiao-qingming-brush-b",
    name: "Chi Xiao & QingMing Brush B",
    category: "Chinese Brushes",
    summary: "A traditional Chinese-style watercolor brush made for smooth release, expressive marks, and brush control.",
    description: "Chi Xiao & QingMing Brush B brings traditional Chinese brush character into modern watercolor painting, with a focus on control, water release, and expressive mark-making for artists who want one beautiful tool to do more.",
    priceCents: 1500,
    currency: "USD",
    images: ["/products/price-list/sa-13-b-chi-xiao-qingming-brush-b.jpg"],
    uses: ["wash", "line-and-wash", "studio"],
    handle: "short",
    feel: "soft",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Chinese Brushes",
      "Handle": "Short handle",
      "Feel": "Soft"
    }
  },
  {
    sku: "SA-34",
    slug: "run-hao-short-brush",
    name: "Run Hao Short Brush",
    category: "Short Brushes",
    summary: "A compact short-handle brush for controlled watercolor practice, sketching, and everyday painting.",
    description: "Run Hao Short Brush gives artists a close-to-paper feel for controlled watercolor painting. It is practical for daily practice, sketching, layered studies, and expressive small-format work.",
    priceCents: 1700,
    currency: "USD",
    images: ["/products/price-list/sa-34-run-hao-short-brush.jpg"],
    uses: ["sketching", "detail", "wash"],
    handle: "short",
    feel: "soft",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Short Brushes",
      "Handle": "Short handle",
      "Feel": "Soft"
    }
  },
  {
    sku: "SA-23",
    slug: "early-spring-brush",
    name: "Early Spring Brush",
    category: "Chinese Brushes",
    summary: "A traditional Chinese-style watercolor brush made for smooth release, expressive marks, and brush control.",
    description: "Early Spring Brush brings traditional Chinese brush character into modern watercolor painting, with a focus on control, water release, and expressive mark-making for artists who want one beautiful tool to do more.",
    priceCents: 1950,
    currency: "USD",
    images: ["/products/price-list/sa-23-early-spring-brush.jpg"],
    uses: ["wash", "line-and-wash", "studio"],
    handle: "short",
    feel: "springy",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Chinese Brushes",
      "Handle": "Short handle",
      "Feel": "Springy"
    }
  },
  {
    sku: "SA-19-S",
    slug: "feng-hui-outline-brush-s",
    name: "Feng Hui Outline Brush S",
    category: "Detail Brushes",
    summary: "A fine-control brush for precise lines, finishing marks, edges, and expressive detail work.",
    description: "Feng Hui Outline Brush S is designed for fine marks, edges, lettering, branches, figures, and finishing details. It gives watercolor artists a focused point and responsive control for the final moments of a painting.",
    priceCents: 1000,
    currency: "USD",
    images: ["/products/price-list/sa-19-s-feng-hui-outline-brush-s.jpg"],
    uses: ["detail", "line-and-wash"],
    handle: "short",
    feel: "springy",
    level: "beginner",
    specs: {
      "Best for": "Fine detail, edges, line work",
      "Brush type": "Detail Brushes",
      "Handle": "Short handle",
      "Feel": "Springy"
    }
  },
  {
    sku: "SA-19-L",
    slug: "feng-hui-outline-brush-l",
    name: "Feng Hui Outline Brush L",
    category: "Detail Brushes",
    summary: "A fine-control brush for precise lines, finishing marks, edges, and expressive detail work.",
    description: "Feng Hui Outline Brush L is designed for fine marks, edges, lettering, branches, figures, and finishing details. It gives watercolor artists a focused point and responsive control for the final moments of a painting.",
    priceCents: 1050,
    currency: "USD",
    images: ["/products/price-list/sa-19-l-feng-hui-outline-brush-l.jpg"],
    uses: ["detail", "line-and-wash"],
    handle: "short",
    feel: "springy",
    level: "beginner",
    specs: {
      "Best for": "Fine detail, edges, line work",
      "Brush type": "Detail Brushes",
      "Handle": "Short handle",
      "Feel": "Springy"
    }
  },
  {
    sku: "SA-16",
    slug: "spring-back-brush",
    name: "Spring Back Brush",
    category: "Chinese Brushes",
    summary: "A traditional Chinese-style watercolor brush made for smooth release, expressive marks, and brush control.",
    description: "Spring Back Brush brings traditional Chinese brush character into modern watercolor painting, with a focus on control, water release, and expressive mark-making for artists who want one beautiful tool to do more.",
    priceCents: 1900,
    currency: "USD",
    images: ["/products/price-list/sa-16-spring-back-brush.jpg"],
    uses: ["wash", "line-and-wash", "studio"],
    handle: "short",
    feel: "springy",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Chinese Brushes",
      "Handle": "Short handle",
      "Feel": "Springy"
    }
  },
  {
    sku: "SA-17",
    slug: "green-sprig-spring-brush",
    name: "Green Sprig Spring Brush",
    category: "Chinese Brushes",
    summary: "A traditional Chinese-style watercolor brush made for smooth release, expressive marks, and brush control.",
    description: "Green Sprig Spring Brush brings traditional Chinese brush character into modern watercolor painting, with a focus on control, water release, and expressive mark-making for artists who want one beautiful tool to do more.",
    priceCents: 1900,
    currency: "USD",
    images: ["/products/price-list/sa-17-green-sprig-spring-brush.jpg"],
    uses: ["wash", "line-and-wash", "studio"],
    handle: "short",
    feel: "springy",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Chinese Brushes",
      "Handle": "Short handle",
      "Feel": "Springy"
    }
  },
  {
    sku: "SA-35-S",
    slug: "sandalwood-handle-brush-series-l5-s",
    name: "Sandalwood Handle Brush Series - L5 S",
    category: "Master Grade Brushes",
    summary: "A refined Sicon Art brush for expressive watercolor control, generous water holding, and studio work.",
    description: "Sandalwood Handle Brush Series - L5 S is a refined brush for artists who want expressive range, water control, and a more distinctive traditional brush character. It is suited to studio work, washes, details, and confident watercolor handling.",
    priceCents: 2600,
    currency: "USD",
    images: ["/products/price-list/sa-35-s-sandalwood-handle-brush-series-l5-s.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "balanced",
    level: "professional",
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-35-M",
    slug: "sandalwood-handle-brush-series-l5-m",
    name: "Sandalwood Handle Brush Series - L5 M",
    category: "Master Grade Brushes",
    summary: "A refined Sicon Art brush for expressive watercolor control, generous water holding, and studio work.",
    description: "Sandalwood Handle Brush Series - L5 M is a refined brush for artists who want expressive range, water control, and a more distinctive traditional brush character. It is suited to studio work, washes, details, and confident watercolor handling.",
    priceCents: 2700,
    currency: "USD",
    images: ["/products/price-list/sa-35-m-sandalwood-handle-brush-series-l5-m.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "balanced",
    level: "professional",
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-35-L",
    slug: "sandalwood-handle-brush-series-l5-l",
    name: "Sandalwood Handle Brush Series - L5 L",
    category: "Master Grade Brushes",
    summary: "A refined Sicon Art brush for expressive watercolor control, generous water holding, and studio work.",
    description: "Sandalwood Handle Brush Series - L5 L is a refined brush for artists who want expressive range, water control, and a more distinctive traditional brush character. It is suited to studio work, washes, details, and confident watercolor handling.",
    priceCents: 2800,
    currency: "USD",
    images: ["/products/price-list/sa-35-l-sandalwood-handle-brush-series-l5-l.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "balanced",
    level: "professional",
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-27",
    slug: "purple-dream-brush",
    name: "Purple Dream Brush",
    category: "Chinese Brushes",
    summary: "A traditional Chinese-style watercolor brush made for smooth release, expressive marks, and brush control.",
    description: "Purple Dream Brush brings traditional Chinese brush character into modern watercolor painting, with a focus on control, water release, and expressive mark-making for artists who want one beautiful tool to do more.",
    priceCents: 1500,
    currency: "USD",
    images: ["/products/price-list/sa-27-purple-dream-brush.jpg"],
    uses: ["wash", "line-and-wash", "studio"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Chinese Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-29",
    slug: "qing-yao-detail-brush",
    name: "Qing Yao Detail Brush",
    category: "Detail Brushes",
    summary: "A fine-control brush for precise lines, finishing marks, edges, and expressive detail work.",
    description: "Qing Yao Detail Brush is designed for fine marks, edges, lettering, branches, figures, and finishing details. It gives watercolor artists a focused point and responsive control for the final moments of a painting.",
    priceCents: 1300,
    currency: "USD",
    images: ["/products/price-list/sa-29-qing-yao-detail-brush.jpg"],
    uses: ["detail", "line-and-wash"],
    handle: "short",
    feel: "soft",
    level: "beginner",
    featured: true,
    specs: {
      "Best for": "Fine detail, edges, line work",
      "Brush type": "Detail Brushes",
      "Handle": "Short handle",
      "Feel": "Soft"
    }
  },
  {
    sku: "SA-10",
    slug: "shede-short-brush",
    name: "Shede Short Brush",
    category: "Short Brushes",
    summary: "A compact short-handle brush for controlled watercolor practice, sketching, and everyday painting.",
    description: "Shede Short Brush gives artists a close-to-paper feel for controlled watercolor painting. It is practical for daily practice, sketching, layered studies, and expressive small-format work.",
    priceCents: 1400,
    currency: "USD",
    images: ["/products/price-list/sa-10-shede-short-brush.jpg"],
    uses: ["sketching", "detail", "wash"],
    handle: "short",
    feel: "balanced",
    level: "beginner",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Short Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-11#3",
    slug: "sicon-art-flat-brush-series-3",
    name: "Sicon Art Flat Brush Series #3",
    category: "Flat Brushes",
    summary: "A handcrafted flat brush for crisp edges, broad strokes, and controlled watercolor shapes.",
    description: "Sicon Art Flat Brush Series #3 helps artists build clean edges, broader passages, architectural shapes, and controlled washes. It is a useful Sicon Art option for painters who want a different mark from pointed round brushes.",
    priceCents: 2300,
    currency: "USD",
    images: ["/products/price-list/sa-11-3-sicon-art-flat-brush-series-3.jpg"],
    uses: ["flat", "wash", "sketching"],
    handle: "short",
    feel: "springy",
    level: "enthusiast",
    specs: {
      "Best for": "Flat washes, edges, shapes",
      "Brush type": "Flat Brushes",
      "Handle": "Short handle",
      "Feel": "Springy"
    }
  },
  {
    sku: "SA-11#5",
    slug: "sicon-art-flat-brush-series-5",
    name: "Sicon Art Flat Brush Series #5",
    category: "Flat Brushes",
    summary: "A handcrafted flat brush for crisp edges, broad strokes, and controlled watercolor shapes.",
    description: "Sicon Art Flat Brush Series #5 helps artists build clean edges, broader passages, architectural shapes, and controlled washes. It is a useful Sicon Art option for painters who want a different mark from pointed round brushes.",
    priceCents: 2900,
    currency: "USD",
    images: ["/products/price-list/sa-11-5-sicon-art-flat-brush-series-5.jpg"],
    uses: ["flat", "wash", "sketching"],
    handle: "short",
    feel: "springy",
    level: "enthusiast",
    specs: {
      "Best for": "Flat washes, edges, shapes",
      "Brush type": "Flat Brushes",
      "Handle": "Short handle",
      "Feel": "Springy"
    }
  },
  {
    sku: "SA-11#7",
    slug: "sicon-art-flat-brush-series-7",
    name: "Sicon Art Flat Brush Series #7",
    category: "Flat Brushes",
    summary: "A handcrafted flat brush for crisp edges, broad strokes, and controlled watercolor shapes.",
    description: "Sicon Art Flat Brush Series #7 helps artists build clean edges, broader passages, architectural shapes, and controlled washes. It is a useful Sicon Art option for painters who want a different mark from pointed round brushes.",
    priceCents: 3200,
    currency: "USD",
    images: ["/products/price-list/sa-11-7-sicon-art-flat-brush-series-7.jpg"],
    uses: ["flat", "wash", "sketching"],
    handle: "short",
    feel: "springy",
    level: "enthusiast",
    specs: {
      "Best for": "Flat washes, edges, shapes",
      "Brush type": "Flat Brushes",
      "Handle": "Short handle",
      "Feel": "Springy"
    }
  },
  {
    sku: "SA-08",
    slug: "sicon-art-qin-brush",
    name: "Sicon Art Qin Brush",
    category: "Chinese Brushes",
    summary: "A traditional Chinese-style watercolor brush made for smooth release, expressive marks, and brush control.",
    description: "Sicon Art Qin Brush brings traditional Chinese brush character into modern watercolor painting, with a focus on control, water release, and expressive mark-making for artists who want one beautiful tool to do more.",
    priceCents: 1500,
    currency: "USD",
    images: ["/products/price-list/sa-08-sicon-art-qin-brush.jpg"],
    uses: ["wash", "line-and-wash", "studio"],
    handle: "short",
    feel: "soft",
    level: "enthusiast",
    featured: true,
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Chinese Brushes",
      "Handle": "Short handle",
      "Feel": "Soft"
    }
  },
  {
    sku: "SA-28",
    slug: "zi-tan-brush",
    name: "Zi Tan Brush",
    category: "Chinese Brushes",
    summary: "A traditional Chinese-style watercolor brush made for smooth release, expressive marks, and brush control.",
    description: "Zi Tan Brush brings traditional Chinese brush character into modern watercolor painting, with a focus on control, water release, and expressive mark-making for artists who want one beautiful tool to do more.",
    priceCents: 1950,
    currency: "USD",
    images: ["/products/price-list/sa-28-zi-tan-brush.jpg"],
    uses: ["wash", "line-and-wash", "studio"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Chinese Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-21",
    slug: "deep-glow-brush",
    name: "Deep Glow Brush",
    category: "Master Grade Brushes",
    summary: "A refined Sicon Art brush for expressive watercolor control, generous water holding, and studio work.",
    description: "Deep Glow Brush is a refined brush for artists who want expressive range, water control, and a more distinctive traditional brush character. It is suited to studio work, washes, details, and confident watercolor handling.",
    priceCents: 4200,
    currency: "USD",
    images: ["/products/price-list/sa-21-deep-glow-brush.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "soft",
    level: "professional",
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Soft"
    }
  },
  {
    sku: "SA-33",
    slug: "raging-tide-bear-hair-wild-cursive-brush",
    name: "Raging Tide Bear Hair Wild Cursive Brush",
    category: "Master Grade Brushes",
    summary: "A refined Sicon Art brush for expressive watercolor control, generous water holding, and studio work.",
    description: "Raging Tide Bear Hair Wild Cursive Brush is a refined brush for artists who want expressive range, water control, and a more distinctive traditional brush character. It is suited to studio work, washes, details, and confident watercolor handling.",
    priceCents: 2400,
    currency: "USD",
    images: ["/products/price-list/sa-33-raging-tide-bear-hair-wild-cursive-brush.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "balanced",
    level: "professional",
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-36",
    slug: "short-handle-series-s1",
    name: "Short Handle Series - S1",
    category: "Short Brushes",
    summary: "A compact short-handle brush for controlled watercolor practice, sketching, and everyday painting.",
    description: "Short Handle Series - S1 gives artists a close-to-paper feel for controlled watercolor painting. It is practical for daily practice, sketching, layered studies, and expressive small-format work.",
    priceCents: 2300,
    currency: "USD",
    images: ["/products/price-list/sa-36-short-handle-series-s1.jpg"],
    uses: ["sketching", "detail", "wash"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Short Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-18",
    slug: "snow-shadow-brush",
    name: "Snow Shadow Brush",
    category: "Chinese Brushes",
    summary: "A traditional Chinese-style watercolor brush made for smooth release, expressive marks, and brush control.",
    description: "Snow Shadow Brush brings traditional Chinese brush character into modern watercolor painting, with a focus on control, water release, and expressive mark-making for artists who want one beautiful tool to do more.",
    priceCents: 2400,
    currency: "USD",
    images: ["/products/price-list/sa-18-snow-shadow-brush.jpg"],
    uses: ["wash", "line-and-wash", "studio"],
    handle: "short",
    feel: "soft",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Chinese Brushes",
      "Handle": "Short handle",
      "Feel": "Soft"
    }
  },
  {
    sku: "SA-32-S",
    slug: "suhan-brush-s",
    name: "SuHan Brush  S",
    category: "Master Grade Brushes",
    summary: "A refined Sicon Art brush for expressive watercolor control, generous water holding, and studio work.",
    description: "SuHan Brush  S is a refined brush for artists who want expressive range, water control, and a more distinctive traditional brush character. It is suited to studio work, washes, details, and confident watercolor handling.",
    priceCents: 2400,
    currency: "USD",
    images: ["/products/price-list/sa-32-s-suhan-brush-s.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "balanced",
    level: "professional",
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-32-M",
    slug: "suhan-brush-m",
    name: "SuHan Brush  M",
    category: "Master Grade Brushes",
    summary: "A refined Sicon Art brush for expressive watercolor control, generous water holding, and studio work.",
    description: "SuHan Brush  M is a refined brush for artists who want expressive range, water control, and a more distinctive traditional brush character. It is suited to studio work, washes, details, and confident watercolor handling.",
    priceCents: 2600,
    currency: "USD",
    images: ["/products/price-list/sa-32-m-suhan-brush-m.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "balanced",
    level: "professional",
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-32-L",
    slug: "suhan-brush-l",
    name: "SuHan Brush  L",
    category: "Master Grade Brushes",
    summary: "A refined Sicon Art brush for expressive watercolor control, generous water holding, and studio work.",
    description: "SuHan Brush  L is a refined brush for artists who want expressive range, water control, and a more distinctive traditional brush character. It is suited to studio work, washes, details, and confident watercolor handling.",
    priceCents: 2600,
    currency: "USD",
    images: ["/products/price-list/sa-32-l-suhan-brush-l.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "balanced",
    level: "professional",
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-30-SET",
    slug: "tai-chi-group-brush-yin-yang-pair-set",
    name: "Tai Chi Group Brush (Yin & Yang) Pair set",
    category: "Master Grade Brushes",
    summary: "A refined Sicon Art brush for expressive watercolor control, generous water holding, and studio work.",
    description: "Tai Chi Group Brush (Yin & Yang) Pair set is a refined brush for artists who want expressive range, water control, and a more distinctive traditional brush character. It is suited to studio work, washes, details, and confident watercolor handling.",
    priceCents: 5900,
    currency: "USD",
    images: ["/products/price-list/sa-30-set-tai-chi-group-brush-yin-yang-pair-set.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "balanced",
    level: "professional",
    featured: true,
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-31",
    slug: "yun-tao-large-heavy-brush",
    name: "Yun Tao Large Heavy Brush",
    category: "Master Grade Brushes",
    summary: "A refined Sicon Art brush for expressive watercolor control, generous water holding, and studio work.",
    description: "Yun Tao Large Heavy Brush is a refined brush for artists who want expressive range, water control, and a more distinctive traditional brush character. It is suited to studio work, washes, details, and confident watercolor handling.",
    priceCents: 3800,
    currency: "USD",
    images: ["/products/price-list/sa-31-yun-tao-large-heavy-brush.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "soft",
    level: "professional",
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Soft"
    }
  },
  {
    sku: "SA-39",
    slug: "golden-bamboo-song",
    name: "Golden Bamboo Song",
    category: "Master Grade Brushes",
    summary: "A refined Sicon Art brush for expressive watercolor control, generous water holding, and studio work.",
    description: "Golden Bamboo Song is a refined brush for artists who want expressive range, water control, and a more distinctive traditional brush character. It is suited to studio work, washes, details, and confident watercolor handling.",
    priceCents: 6500,
    currency: "USD",
    images: ["/products/price-list/sa-39-golden-bamboo-song.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "soft",
    level: "professional",
    featured: true,
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Soft"
    }
  },
  {
    sku: "SA-38",
    slug: "song-elegance-golden-umbrella-brush",
    name: "Song Elegance Golden Umbrella Brush",
    category: "Master Grade Brushes",
    summary: "A refined Sicon Art brush for expressive watercolor control, generous water holding, and studio work.",
    description: "Song Elegance Golden Umbrella Brush is a refined brush for artists who want expressive range, water control, and a more distinctive traditional brush character. It is suited to studio work, washes, details, and confident watercolor handling.",
    priceCents: 10500,
    currency: "USD",
    images: ["/products/price-list/sa-38-song-elegance-golden-umbrella-brush.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "soft",
    level: "professional",
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Soft"
    }
  },
  {
    sku: "SA-37",
    slug: "song-mist-azure-lacquer",
    name: "Song Mist Azure Lacquer",
    category: "Master Grade Brushes",
    summary: "A refined Sicon Art brush for expressive watercolor control, generous water holding, and studio work.",
    description: "Song Mist Azure Lacquer is a refined brush for artists who want expressive range, water control, and a more distinctive traditional brush character. It is suited to studio work, washes, details, and confident watercolor handling.",
    priceCents: 12200,
    currency: "USD",
    images: ["/products/price-list/sa-37-song-mist-azure-lacquer.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "soft",
    level: "professional",
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Soft"
    }
  },
  {
    sku: "SA-40",
    slug: "xiang-bamboo-ebony-shadow-song-brush",
    name: "Xiang Bamboo Ebony Shadow Song Brush",
    category: "Master Grade Brushes",
    summary: "A refined Sicon Art brush for expressive watercolor control, generous water holding, and studio work.",
    description: "Xiang Bamboo Ebony Shadow Song Brush is a refined brush for artists who want expressive range, water control, and a more distinctive traditional brush character. It is suited to studio work, washes, details, and confident watercolor handling.",
    priceCents: 12200,
    currency: "USD",
    images: ["/products/price-list/sa-40-xiang-bamboo-ebony-shadow-song-brush.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "soft",
    level: "professional",
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Soft"
    }
  },
  {
    sku: "SA-ACC-01",
    slug: "reusable-calligraphy-water-writing-scroll",
    name: "Reusable Calligraphy Water Writing Scroll",
    category: "Accessories",
    summary: "A practical Sicon Art studio accessory for brush care, storage, or practice.",
    description: "Reusable Calligraphy Water Writing Scroll supports the Sicon Art painting workflow with a practical, studio-ready format. It is selected for artists who want dependable tools around their brushes, paper, and daily watercolor practice.",
    priceCents: 2400,
    currency: "USD",
    images: ["/products/price-list/sa-acc-01-reusable-calligraphy-water-writing-scroll.jpg"],
    uses: ["studio"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Studio setup and watercolor practice",
      "Brush type": "Accessories",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-ACC-02",
    slug: "bamboo-and-linen-brush-roll-10-brush-holder",
    name: "Bamboo and Linen Brush Roll [10 Brush Holder]",
    category: "Accessories",
    summary: "A practical Sicon Art studio accessory for brush care, storage, or practice.",
    description: "Bamboo and Linen Brush Roll [10 Brush Holder] supports the Sicon Art painting workflow with a practical, studio-ready format. It is selected for artists who want dependable tools around their brushes, paper, and daily watercolor practice.",
    priceCents: 2400,
    currency: "USD",
    images: ["/products/price-list/sa-acc-02-bamboo-and-linen-brush-roll-10-brush-holder.jpg"],
    uses: ["studio"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Studio setup and watercolor practice",
      "Brush type": "Accessories",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-41",
    slug: "color-ring-bamboo-brush",
    name: "Color Ring Bamboo Brush",
    category: "Coming Soon Brushes",
    summary: "A new handcrafted Sicon Art brush preparing for release.",
    description: "Color Ring Bamboo Brush is part of the next Sicon Art brush release. Full retail pricing and product guidance will be confirmed soon, but the brush is already prepared for preview in the collection.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/price-list/sa-41-color-ring-bamboo-brush.jpg"],
    uses: ["sketching", "detail", "studio"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Coming Soon Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-42",
    slug: "jade-orb-dark-tip-brush",
    name: "Jade Orb Dark Tip Brush",
    category: "Coming Soon Brushes",
    summary: "A new handcrafted Sicon Art brush preparing for release.",
    description: "Jade Orb Dark Tip Brush is part of the next Sicon Art brush release. Full retail pricing and product guidance will be confirmed soon, but the brush is already prepared for preview in the collection.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/price-list/sa-42-jade-orb-dark-tip-brush.png"],
    uses: ["detail", "sketching", "studio"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Coming Soon Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-43",
    slug: "pink-youth-glow-brush",
    name: "Pink Youth Glow Brush",
    category: "Coming Soon Brushes",
    summary: "A new handcrafted Sicon Art brush preparing for release.",
    description: "Pink Youth Glow Brush is part of the next Sicon Art brush release. Full retail pricing and product guidance will be confirmed soon, but the brush is already prepared for preview in the collection.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/price-list/sa-43-pink-youth-glow-brush.png"],
    uses: ["sketching", "detail", "studio"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Coming Soon Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-44",
    slug: "sapphire-jade-brush",
    name: "Sapphire Jade Brush",
    category: "Coming Soon Brushes",
    summary: "A new handcrafted Sicon Art brush preparing for release.",
    description: "Sapphire Jade Brush is part of the next Sicon Art brush release. Full retail pricing and product guidance will be confirmed soon, but the brush is already prepared for preview in the collection.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/price-list/sa-44-sapphire-jade-brush.png"],
    uses: ["sketching", "wash", "studio"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Coming Soon Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-45",
    slug: "skyward-dragon-brush",
    name: "Skyward Dragon Brush",
    category: "Coming Soon Brushes",
    summary: "A new handcrafted Sicon Art brush preparing for release.",
    description: "Skyward Dragon Brush is part of the next Sicon Art brush release. Full retail pricing and product guidance will be confirmed soon, but the brush is already prepared for preview in the collection.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/price-list/sa-45-skyward-dragon-brush.jpg"],
    uses: ["sketching", "wash", "studio"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Coming Soon Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-46",
    slug: "turquoise-wave-brush",
    name: "Turquoise Wave Brush",
    category: "Coming Soon Brushes",
    summary: "A new handcrafted Sicon Art brush preparing for release.",
    description: "Turquoise Wave Brush is part of the next Sicon Art brush release. Full retail pricing and product guidance will be confirmed soon, but the brush is already prepared for preview in the collection.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/price-list/sa-46-turquoise-wave-brush.png"],
    uses: ["sketching", "wash", "studio"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Coming Soon Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
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

export function formatProductPrice(cents: number, currency = "USD") {
  return cents > 0 ? formatPrice(cents, currency) : "Coming soon";
}

export function isPurchasable(product: Pick<Product, "priceCents">) {
  return product.priceCents > 0;
}
