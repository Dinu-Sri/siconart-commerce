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
  /** Fallback image list. Shop and product pages also load `public/products/<slug>/feature.*` plus `gallery/`. */
  images: string[];
  uses: ProductUse[];
  handle: "travel" | "short" | "long";
  feel: "soft" | "springy" | "balanced";
  level: "beginner" | "enthusiast" | "professional";
  featured?: boolean;
  /** ISO date the product was added to the public catalog. Newer dates appear in New Arrivals. */
  addedAt?: string;
  legacySlugs?: string[];
  imageFolders?: string[];
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
    summary: "Handmade travel watercolor brush for urban sketching and sketchbook painting.",
    description: "Chi Ling is our handmade travel watercolor brush for urban sketching, plein air, and sketchbook painting. The compact travel handle protects the tip in a kit, and the hair holds water for washes while keeping a usable point for line-and-wash work away from the studio.",
    priceCents: 1200,
    currency: "USD",
    images: ["/products/chi-ling-travel-brush/feature.jpg"],
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
    summary: "Short-handle handmade watercolor brush for daily practice, sketching, and small studies.",
    description: "Ruyue is a short-handle handmade Sicon Art watercolor brush. The close-to-paper grip suits daily practice, urban sketching, layered studies, and small-format washes.",
    priceCents: 1300,
    currency: "USD",
    images: ["/products/ruyue-short-brush/feature.jpg"],
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
    summary: "Pocket travel watercolor brush with a 1.7 cm tip, protective cap, and black weasel hair mix.",
    description: "The T3 is our pocket travel watercolor brush for urban sketching, fine detail, ink, and controlled washes. Tip length 1.7 cm, shaft diameter 0.5 cm, handle 13 cm, with a protective cap and black weasel hair mix. Custom handle engraving is available by enquiry.",
    priceCents: 1300,
    currency: "USD",
    images: ["/products/travel-series-brush-t3/feature.jpg"],
    uses: ["travel", "sketching", "line-and-wash"],
    handle: "travel",
    feel: "balanced",
    level: "beginner",
    featured: true,
    specs: {
      "Best for": "Travel sketching, urban sketching, fine details, ink work, and controlled washes",
      "Brush type": "Travel Brushes",
      "Handle": "Travel handle with protective cap",
      "Handle length": "13 cm",
      "Tip length": "1.7 cm",
      "Shaft diameter": "0.5 cm",
      "Hair": "Black weasel hair mix",
      "Handle material": "Metal sections on a travel barrel",
      "Feel": "Balanced",
      "Custom engraving": "Available by enquiry"
    }
  },
  {
    sku: "SA-12",
    slug: "dark-green-short-wood-brush",
    name: "Dark Green Short WOOD Brush",
    category: "Short Brushes",
    summary: "Short wood-handle watercolor brush for controlled sketching, detail, and everyday painting.",
    description: "Dark Green Short WOOD is a handmade Sicon Art short brush with a wood handle. It sits close to the paper for sketching, detail, and small washes in the studio or on a sketchwalk.",
    priceCents: 2300,
    currency: "USD",
    images: ["/products/dark-green-short-wood-brush/feature.jpg"],
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
    summary: "Short-handle urban sketching brush for quick line-and-wash marks on location.",
    description: "Feng Short Sketch Brush is our handmade urban sketching brush. The short handle sits close to the paper for fast line, small washes, and confident marks outdoors or in a sketchbook.",
    priceCents: 1350,
    currency: "USD",
    images: ["/products/feng-short-sketch-brush/feature.jpg"],
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
    summary: "Bamboo travel watercolor brush with a horse and synthetic hair mix, 2.5 cm tip, and protective cap.",
    description: "Happiness is a handmade bamboo travel watercolor brush for sketchbooks, plein air, and compact kits. The hair is a horse and synthetic mix. Tip length 2.5 cm, shaft diameter 0.65 cm, handle 13 cm, with a protective cap.",
    priceCents: 1350,
    currency: "USD",
    images: ["/products/happiness-short-travel-brush/feature.jpg"],
    uses: ["travel", "sketching", "line-and-wash"],
    handle: "travel",
    feel: "balanced",
    level: "beginner",
    specs: {
      "Best for": "Travel watercolor, sketchbooks, plein air",
      "Brush type": "Travel Brushes",
      "Handle": "Travel handle with protective cap",
      "Handle length": "13 cm",
      "Tip length": "2.5 cm",
      "Shaft diameter": "0.65 cm",
      "Hair": "Horse and synthetic hair mix",
      "Handle material": "Bamboo wood",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-26",
    slug: "red-tiny-brush",
    name: "Red Tiny Brush",
    category: "Detail Brushes",
    summary: "Fine-point detail watercolor brush for edges, lettering, branches, and finishing marks.",
    description: "Red Tiny is a handmade Sicon Art detail brush for precise lines, edges, lettering, figures, and finishing work. It keeps a focused point for the last marks of a watercolor.",
    priceCents: 1400,
    currency: "USD",
    images: ["/products/red-tiny-brush/feature.jpg"],
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
    summary: "Handmade travel watercolor brush T7 for sketchbooks, plein air, and painting on the move.",
    description: "Travel Brush T7 is a handmade Sicon Art travel watercolor brush for urban sketching and sketchbook painting. The travel handle protects the tip in a kit while the hair holds water for washes and line-and-wash work on location.",
    priceCents: 2300,
    currency: "USD",
    images: ["/products/sicon-art-travel-brush-t7/feature.jpg"],
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
    summary: "Handmade travel watercolor brush T8 for urban sketching and compact watercolor kits.",
    description: "Travel Brush T8 is a handmade Sicon Art travel watercolor brush. Pack it for sketchwalks and travel painting: a protected tip, useful water holding, and a point for line-and-wash.",
    priceCents: 2300,
    currency: "USD",
    images: ["/products/sicon-art-travel-brush-t8/feature.jpg"],
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
    summary: "Handmade travel watercolor brush T9 for plein air, sketchbooks, and travel kits.",
    description: "Travel Brush T9 is a handmade Sicon Art travel watercolor brush for artists who paint away from the studio. Use it for urban sketching, sketchbook washes, and controlled line-and-wash on the road.",
    priceCents: 2300,
    currency: "USD",
    images: ["/products/sicon-art-travel-brush-t9/feature.jpg"],
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
    summary: "Limited handmade travel watercolor brush for sketchbook painting, used by ambassador Sanjeewee Senevirathna.",
    description: "The T1 Soulmate Limited Travel Brush is a compact handmade Sicon Art travel brush for sketchbook watercolor, urban sketching, and painting on the road. Brand ambassador Sanjeewee Senevirathna paints with this brush.",
    priceCents: 3900,
    currency: "USD",
    images: ["/products/t1-soulmate-limited-travel-brush/feature.jpg"],
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
    summary: "T10 Ember travel watercolor brush for sketchbook painting and urban sketching on the move.",
    description: "T10 Ember (灼) is a handmade Sicon Art travel watercolor brush. The travel handle protects the tip in a kit, with enough water holding for washes and a point for sketchbook line-and-wash.",
    priceCents: 1500,
    currency: "USD",
    images: ["/products/t10-travel-brush-ember/feature.jpg"],
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
    summary: "T10 Still travel watercolor brush for quiet sketchbook work and compact travel kits.",
    description: "T10 Still (默) is a handmade Sicon Art travel watercolor brush for sketchbooks and plein air. Pack it when you want a protected tip and a responsive point away from the studio.",
    priceCents: 1400,
    currency: "USD",
    images: ["/products/t10-travel-brush-still/feature.jpg"],
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
    summary: "Handmade Chinese watercolor brush for washes, line-and-wash, and expressive studio painting.",
    description: "Chi Xiao & QingMing Brush A is a handmade Chinese watercolor brush from our Dongguan workshop. Traditional brush form meets modern watercolor: water holding for washes, a living point for line, and enough spring for studio work.",
    priceCents: 1500,
    currency: "USD",
    images: ["/products/chi-xiao-qingming-brush-a/feature.jpg"],
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
    summary: "Handmade Chinese watercolor brush companion to Chi Xiao A, for washes and expressive marks.",
    description: "Chi Xiao & QingMing Brush B is a handmade Chinese watercolor brush for line-and-wash and studio painting. It holds water for washes and keeps a usable point for expressive Chinese-style marks.",
    priceCents: 1500,
    currency: "USD",
    images: ["/products/chi-xiao-qingming-brush-b/feature.jpg"],
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
    summary: "Short-handle handmade watercolor brush for sketching, layered studies, and everyday control.",
    description: "Run Hao is a short-handle handmade Sicon Art watercolor brush. Use it for daily practice, urban sketching, and small-format washes when you want the handle close to the paper.",
    priceCents: 1700,
    currency: "USD",
    images: ["/products/run-hao-short-brush/feature.jpg"],
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
    summary: "Handmade Chinese watercolor brush with a springy feel for washes and line-and-wash.",
    description: "Early Spring is a handmade Chinese watercolor brush from Sicon Art. A springy feel supports washes, line-and-wash, and expressive studio painting.",
    priceCents: 1950,
    currency: "USD",
    images: ["/products/early-spring-brush/feature.jpg"],
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
    sku: "SA-19",
    slug: "feng-hui-outline-brush",
    name: "Feng Hui Outline Brush",
    category: "Detail Brushes",
    summary: "Fine outline watercolor brush in sizes S and L for edges, branches, and finishing lines.",
    description: "Feng Hui Outline is a handmade Sicon Art detail brush for precise lines, edges, lettering, and finishing marks. Choose size S or L for the line weight you want.",
    priceCents: 1000,
    currency: "USD",
    images: ["/products/feng-hui-outline-brush-s/feature.jpg"],
    uses: ["detail", "line-and-wash"],
    handle: "short",
    feel: "springy",
    level: "beginner",
    legacySlugs: ["feng-hui-outline-brush-s", "feng-hui-outline-brush-l"],
    imageFolders: ["feng-hui-outline-brush-s", "feng-hui-outline-brush-l"],
    variants: [
      { sku: "SA-19-S", name: "S", priceCents: 1000, image: "/products/feng-hui-outline-brush-s/feature.jpg" },
      { sku: "SA-19-L", name: "L", priceCents: 1050, image: "/products/feng-hui-outline-brush-l/feature.jpg" }
    ],
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
    summary: "Handmade Chinese watercolor brush with a springy tip for washes and expressive marks.",
    description: "Spring Back is a handmade Chinese watercolor brush for studio watercolor and line-and-wash. The springy tip supports water release, a living point, and confident mark-making.",
    priceCents: 1900,
    currency: "USD",
    images: ["/products/spring-back-brush/feature.jpg"],
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
    summary: "Handmade Chinese watercolor brush for controlled washes, line work, and studio painting.",
    description: "Green Sprig Spring is a handmade Chinese watercolor brush from our Dongguan workshop. It is made for smooth water release, a usable point, and expressive watercolor marks.",
    priceCents: 1900,
    currency: "USD",
    images: ["/products/green-sprig-spring-brush/feature.jpg"],
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
    sku: "SA-35",
    slug: "sandalwood-handle-brush-series-l5",
    name: "Sandalwood Handle Brush Series - L5",
    category: "Master Grade Brushes",
    summary: "Long-handle master watercolor brush in sizes S, M, and L for studio washes and detail.",
    description: "Sandalwood Handle Brush Series L5 is a handmade Sicon Art master brush for studio watercolor. The long handle suits washes, details, and expressive work. Choose size S, M, or L.",
    priceCents: 2600,
    currency: "USD",
    images: ["/products/sandalwood-handle-brush-series-l5-s/feature.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "balanced",
    level: "professional",
    legacySlugs: [
      "sandalwood-handle-brush-series-l5-s",
      "sandalwood-handle-brush-series-l5-m",
      "sandalwood-handle-brush-series-l5-l"
    ],
    imageFolders: [
      "sandalwood-handle-brush-series-l5-s",
      "sandalwood-handle-brush-series-l5-m",
      "sandalwood-handle-brush-series-l5-l"
    ],
    variants: [
      { sku: "SA-35-S", name: "S", priceCents: 2600, image: "/products/sandalwood-handle-brush-series-l5-s/feature.jpg" },
      { sku: "SA-35-M", name: "M", priceCents: 2700, image: "/products/sandalwood-handle-brush-series-l5-m/feature.jpg" },
      { sku: "SA-35-L", name: "L", priceCents: 2800, image: "/products/sandalwood-handle-brush-series-l5-l/feature.jpg" }
    ],
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
    summary: "Handmade Chinese watercolor brush for balanced washes, line-and-wash, and studio painting.",
    description: "Purple Dream is a handmade Chinese watercolor brush for artists who want water holding, a living point, and expressive studio marks in a traditional brush form.",
    priceCents: 1500,
    currency: "USD",
    images: ["/products/purple-dream-brush/feature.jpg"],
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
    sku: "SA-10",
    slug: "shede-short-brush",
    name: "Shede Short Brush",
    category: "Short Brushes",
    summary: "Short-handle handmade watercolor brush for beginners, sketching, and everyday painting.",
    description: "Shede is a short-handle handmade Sicon Art watercolor brush. It is a practical daily brush for sketching, small washes, and controlled practice close to the paper.",
    priceCents: 1400,
    currency: "USD",
    images: ["/products/shede-short-brush/feature.jpg"],
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
    sku: "SA-11",
    slug: "sicon-art-flat-brush-series",
    name: "Sicon Art Flat Brush Series",
    category: "Flat Brushes",
    summary: "Handmade flat watercolor brushes in sizes #3, #5, and #7 for edges, shapes, and washes.",
    description: "The Sicon Art Flat Brush Series is a short-handle flat watercolor brush for clean edges, broader passages, and architectural shapes. Choose size #3, #5, or #7 when you want a different mark from a pointed round.",
    priceCents: 2300,
    currency: "USD",
    images: ["/products/sicon-art-flat-brush-series-3/feature.jpg"],
    uses: ["flat", "wash", "sketching"],
    handle: "short",
    feel: "springy",
    level: "enthusiast",
    legacySlugs: ["sicon-art-flat-brush-series-3", "sicon-art-flat-brush-series-5", "sicon-art-flat-brush-series-7"],
    imageFolders: ["sicon-art-flat-brush-series-3", "sicon-art-flat-brush-series-5", "sicon-art-flat-brush-series-7"],
    variants: [
      { sku: "SA-11#3", name: "#3", priceCents: 2300, image: "/products/sicon-art-flat-brush-series-3/feature.jpg" },
      { sku: "SA-11#5", name: "#5", priceCents: 2900, image: "/products/sicon-art-flat-brush-series-5/feature.jpg" },
      { sku: "SA-11#7", name: "#7", priceCents: 3200, image: "/products/sicon-art-flat-brush-series-7/feature.jpg" }
    ],
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
    summary: "Chinese watercolor brush with a goat, hemp, and synthetic hair mix for soft flow and a controlled tip.",
    description: "Qin is a handmade Chinese watercolor brush for line-and-wash and studio painting. Goat, hemp, and synthetic hair give a soft water flow with a usable point. Tip length 3 cm, shaft diameter 0.6 cm, wood handle 15 cm.",
    priceCents: 1500,
    currency: "USD",
    images: ["/products/sicon-art-qin-brush/feature.jpg"],
    uses: ["wash", "line-and-wash", "studio"],
    handle: "short",
    feel: "soft",
    level: "enthusiast",
    featured: true,
    specs: {
      "Best for": "Soft water flow with tip control, line-and-wash",
      "Brush type": "Chinese Brushes",
      "Handle": "Short handle",
      "Handle length": "15 cm",
      "Tip length": "3 cm",
      "Shaft diameter": "0.6 cm",
      "Hair": "Goat, hemp, and synthetic hair mix",
      "Handle material": "Wood",
      "Feel": "Soft"
    }
  },
  {
    sku: "SA-28",
    slug: "zi-tan-brush",
    name: "Zi Tan Brush",
    category: "Chinese Brushes",
    summary: "Handmade Chinese watercolor brush for washes, expressive marks, and studio watercolor.",
    description: "Zi Tan is a handmade Chinese watercolor brush from Sicon Art. Traditional form, modern watercolor: water holding for washes and a point for line-and-wash in the studio.",
    priceCents: 1950,
    currency: "USD",
    images: ["/products/zi-tan-brush/feature.jpg"],
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
    summary: "Long-handle master watercolor brush with a soft feel for studio washes and detail.",
    description: "Deep Glow is a handmade Sicon Art master brush for studio watercolor. The long handle and soft feel suit generous washes, details, and expressive Chinese-style marks.",
    priceCents: 4200,
    currency: "USD",
    images: ["/products/deep-glow-brush/feature.jpg"],
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
    summary: "Long-handle master brush for wild cursive marks, studio washes, and expressive watercolor.",
    description: "Raging Tide Bear Hair Wild Cursive is a handmade Sicon Art master brush for studio watercolor. It is built for expressive range, water control, and confident handling from wash to detail.",
    priceCents: 2400,
    currency: "USD",
    images: ["/products/raging-tide-bear-hair-wild-cursive-brush/feature.jpg"],
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
    summary: "Short Handle Series S1 watercolor brush for sketching, studies, and everyday control.",
    description: "Short Handle Series S1 is a handmade Sicon Art short brush. The close-to-paper grip suits daily practice, urban sketching, and small-format watercolor.",
    priceCents: 2300,
    currency: "USD",
    images: ["/products/short-handle-series-s1/feature.jpg"],
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
    summary: "Handmade Chinese watercolor brush with a soft feel for washes and delicate line-and-wash.",
    description: "Snow Shadow is a handmade Chinese watercolor brush for studio painting. A soft feel supports water holding, a living point, and quiet, controlled marks.",
    priceCents: 2400,
    currency: "USD",
    images: ["/products/snow-shadow-brush/feature.jpg"],
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
    sku: "SA-32",
    slug: "suhan-brush",
    name: "SuHan Brush",
    category: "Master Grade Brushes",
    summary: "Long-handle master watercolor brush in sizes S, M, and L for studio washes and detail.",
    description: "SuHan is a handmade Sicon Art master brush for studio watercolor. The long handle suits washes, details, and expressive work. Choose size S, M, or L.",
    priceCents: 2400,
    currency: "USD",
    images: ["/products/suhan-brush-s/feature.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "balanced",
    level: "professional",
    legacySlugs: ["suhan-brush-s", "suhan-brush-m", "suhan-brush-l"],
    imageFolders: ["suhan-brush-s", "suhan-brush-m", "suhan-brush-l"],
    variants: [
      { sku: "SA-32-S", name: "S", priceCents: 2400, image: "/products/suhan-brush-s/feature.jpg" },
      { sku: "SA-32-M", name: "M", priceCents: 2600, image: "/products/suhan-brush-m/feature.jpg" },
      { sku: "SA-32-L", name: "L", priceCents: 2600, image: "/products/suhan-brush-l/feature.jpg" }
    ],
    specs: {
      "Best for": "Expressive watercolor and studio work",
      "Brush type": "Master Grade Brushes",
      "Handle": "Long handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-30-SET",
    slug: "tai-chi-yin-brush",
    name: "Tai Chi Yin Brush",
    category: "Master Grade Brushes",
    summary: "Black-hair master watercolor brush for expressive studio washes, detail, and confident handling.",
    description: "Tai Chi Yin is a handmade black-hair Sicon Art brush for studio watercolor. It holds water generously and keeps enough spring for washes, details, and expressive Chinese-style marks.",
    priceCents: 2950,
    currency: "USD",
    images: ["/products/tai-chi-yin-brush/feature.jpg"],
    uses: ["wash", "studio", "detail"],
    handle: "long",
    feel: "balanced",
    level: "professional",
    featured: true,
    legacySlugs: ["tai-chi-group-brush-yin-yang-pair-set"],
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
    summary: "Large long-handle master watercolor brush for heavy washes and studio painting.",
    description: "Yun Tao Large Heavy is a handmade Sicon Art master brush for studio watercolor. The long handle and soft feel suit generous washes, broader passages, and expressive detail.",
    priceCents: 3800,
    currency: "USD",
    images: ["/products/yun-tao-large-heavy-brush/feature.jpg"],
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
    summary: "Long-handle master watercolor brush with a golden bamboo form for studio washes and detail.",
    description: "Golden Bamboo Song is a handmade Sicon Art master brush for studio watercolor. It is made for generous water holding, expressive range, and confident work from wash to line.",
    priceCents: 6500,
    currency: "USD",
    images: ["/products/golden-bamboo-song/feature.jpg"],
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
    summary: "Collector master watercolor brush with a golden umbrella form for studio painting.",
    description: "Song Elegance Golden Umbrella is a handmade Sicon Art master brush for studio watercolor. The long handle suits washes, details, and distinctive traditional brush character.",
    priceCents: 10500,
    currency: "USD",
    images: ["/products/song-elegance-golden-umbrella-brush/feature.jpg"],
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
    summary: "Collector master watercolor brush with azure lacquer for studio washes and expressive marks.",
    description: "Song Mist Azure Lacquer is a handmade Sicon Art master brush for studio watercolor. It is built for generous water holding, a long handle, and confident work from wash to detail.",
    priceCents: 12200,
    currency: "USD",
    images: ["/products/song-mist-azure-lacquer/feature.jpg"],
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
    summary: "Collector master watercolor brush with Xiang bamboo and ebony shadow form for studio painting.",
    description: "Xiang Bamboo Ebony Shadow Song is a handmade Sicon Art master brush for studio watercolor. The long handle and soft feel suit washes, details, and expressive Chinese-style marks.",
    priceCents: 12200,
    currency: "USD",
    images: ["/products/xiang-bamboo-ebony-shadow-song-brush/feature.jpg"],
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
    summary: "Reusable water writing scroll for calligraphy and brush practice without wasting paper.",
    description: "The Reusable Calligraphy Water Writing Scroll is a practice surface for brush work with water. Use it beside your Sicon Art brushes for daily calligraphy and watercolor warm-ups.",
    priceCents: 2400,
    currency: "USD",
    images: ["/products/reusable-calligraphy-water-writing-scroll/feature.jpg"],
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
    summary: "Bamboo and linen roll that holds ten handmade watercolor brushes for travel and studio.",
    description: "The Bamboo and Linen Brush Roll holds ten brushes for sketchwalks and studio days. Bamboo and linen keep handmade Sicon Art tips protected while you move between locations.",
    priceCents: 2400,
    currency: "USD",
    images: ["/products/bamboo-and-linen-brush-roll-10-brush-holder/feature.jpg"],
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
    summary: "Handmade bamboo watercolor brush with colour-ring detail, coming soon.",
    description: "Color Ring Bamboo is a handmade Sicon Art watercolor brush with a bamboo handle and colour-ring detail. It is coming soon.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/color-ring-bamboo-brush/feature.jpg"],
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
    summary: "Handmade watercolor brush with a sculpted orb handle, coming soon.",
    description: "Jade Orb Dark Tip is a handmade Sicon Art watercolor brush with a sculpted handle. It is coming soon.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/jade-orb-dark-tip-brush/feature.png"],
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
    category: "Chinese Brushes",
    summary: "Handmade Chinese watercolor brush with a pink sculpted handle for sketching and studio work.",
    description: "Pink Youth Glow is a handmade Chinese watercolor brush from Sicon Art. The short handle suits sketching, detail, and everyday studio painting.",
    priceCents: 800,
    currency: "USD",
    images: ["/products/pink-youth-glow-brush/feature.png"],
    uses: ["sketching", "detail", "studio"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    addedAt: "2026-09-18",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Chinese Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-44",
    slug: "sapphire-jade-brush",
    name: "Sapphire Jade Brush",
    category: "Chinese Brushes",
    summary: "Handmade Chinese watercolor brush with a sapphire-jade sculpted handle for washes and sketching.",
    description: "Sapphire Jade is a handmade Chinese watercolor brush for sketching, washes, and studio painting. Traditional brush character in a short, everyday handle.",
    priceCents: 800,
    currency: "USD",
    images: ["/products/sapphire-jade-brush/feature.png"],
    uses: ["sketching", "wash", "studio"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    addedAt: "2026-09-18",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Chinese Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-47",
    slug: "ivory-flow-brush",
    name: "Ivory Flow Brush",
    category: "Chinese Brushes",
    summary: "Handmade Chinese watercolor brush with an ivory-flow sculpted handle for washes and sketching.",
    description: "Ivory Flow is a handmade Chinese watercolor brush from our Dongguan workshop. Use it for sketching, washes, and expressive studio marks.",
    priceCents: 800,
    currency: "USD",
    images: ["/products/ivory-flow-brush/feature.png"],
    uses: ["sketching", "wash", "studio"],
    handle: "short",
    feel: "balanced",
    level: "enthusiast",
    addedAt: "2026-09-18",
    specs: {
      "Best for": "Watercolor control and expressive marks",
      "Brush type": "Chinese Brushes",
      "Handle": "Short handle",
      "Feel": "Balanced"
    }
  },
  {
    sku: "SA-45",
    slug: "skyward-dragon-brush",
    name: "Skyward Dragon Brush",
    category: "Coming Soon Brushes",
    summary: "Handmade watercolor brush with a carved dragon handle, coming soon.",
    description: "Skyward Dragon is a handmade Sicon Art watercolor brush with a carved dragon handle. It is coming soon.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/skyward-dragon-brush/feature.jpg"],
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
    sku: "SA-49",
    slug: "xiangfei-scroll-brush",
    name: "Xiangfei Scroll",
    category: "Coming Soon Brushes",
    summary: "A rare Xiangfei bamboo brush with master-made goat hair, unique natural mottling, and a soft, springy point.",
    description:
      "Xiangfei Scroll is crafted from rare Xiangfei bamboo, known as the empress of bamboos. Naturally formed mottled marks make every handle one of a kind. The hair is 80% goat and 20% quality synthetic, hand-finished by a master maker for a full shape, strong water holding, a fine point, and a soft rebound that can wash or flatten into a broader stroke. Xiangfei bamboo carries the old story of empresses Ehuang and Nüying, whose tears stained the bamboo.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/xiangfei-scroll-brush/feature.jpg"],
    uses: ["wash", "sketching", "studio"],
    handle: "short",
    feel: "soft",
    level: "professional",
    featured: true,
    addedAt: "2026-10-13",
    specs: {
      "Best for": "Watercolor sketching, Chinese ink, washes and broader strokes",
      "Brush type": "Limited collector bamboo",
      "Hair": "80% goat, 20% quality synthetic",
      "Tip length": "3 cm",
      "Handle length": "15 cm",
      "Shaft diameter": "0.85 cm",
      "Handle": "Natural Xiangfei bamboo",
      "Feel": "Soft, springy"
    }
  },
  {
    sku: "SA-48",
    slug: "embroidered-prosperity-deer-brush",
    name: "Embroidered Prosperity Deer Brush",
    category: "Coming Soon Brushes",
    summary: "A limited collector’s edition brush with hand embroidery, a sharp point, and generous water holding.",
    description:
      "Embroidered Prosperity Deer Brush is a Sicon Art limited collector’s edition. The middle of the handle is hand embroidered, with a deer stitched against a teal ground. In Chinese culture the deer stands for fortune, blessing, and artistic inspiration. The sculpted handle is smooth and balanced. The hair is a master-blended mix of 50% rabbit, 40% fox, and 10% synthetic fibre, made for a fine point, generous liquid capacity, and lively spring. It is suited to delicate watercolor washes, Chinese line drawing, and fine detail.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/embroidered-prosperity-deer-brush/feature.jpg"],
    uses: ["wash", "detail", "line-and-wash", "studio"],
    handle: "short",
    feel: "springy",
    level: "professional",
    featured: true,
    addedAt: "2026-10-13",
    specs: {
      "Best for": "Delicate washes, Chinese line drawing, fine detail",
      "Brush type": "Limited Collector’s Edition",
      "Hair": "50% rabbit, 40% fox, 10% synthetic",
      "Tip length": "2.3 cm",
      "Handle length": "17 cm",
      "Shaft diameter": "0.9 cm",
      "Handle": "Sculpted short handle",
      "Feel": "Springy"
    }
  },
  {
    sku: "SA-50",
    slug: "verdant-hare-point-brush",
    name: "Verdant Hare Point",
    category: "Coming Soon Brushes",
    summary: "An emerald-green handle with a light, nimble point, made for outdoor watercolor among villages and mountains.",
    description:
      "Verdant Hare Point (翠翎) takes its name from the emerald-green handle, like fresh mountain branches, and a fine tip as light and nimble as a bird’s feather. The hair is 50% Shantu, 30% rabbit, and 20% synthetic fibre. Ergonomic and elegant in the hand, it is made for painting outdoors among ancient villages and mountains, capturing natural light, flowing colour, and quiet poetic moments.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/verdant-hare-point-brush/feature.jpg"],
    uses: ["sketching", "detail", "wash", "travel"],
    handle: "short",
    feel: "soft",
    level: "professional",
    featured: true,
    addedAt: "2026-10-15",
    specs: {
      "Best for": "Outdoor watercolor, landscape sketching, natural light",
      "Brush type": "Limited collector handle",
      "Hair": "50% Shantu, 30% rabbit, 20% synthetic",
      "Tip length": "2 cm",
      "Handle length": "13.8 cm",
      "Shaft diameter": "0.8 cm",
      "Handle": "Emerald-green short handle",
      "Feel": "Light, nimble"
    }
  },
  {
    sku: "SA-51",
    slug: "verdant-snow-bristle-brush",
    name: "Verdant Snow Bristle",
    category: "Coming Soon Brushes",
    summary: "A solid-wood emerald handle with snow-bright goat hair, made for soft washes, blending, and fine lines.",
    description:
      "Verdant Snow Bristle (青雪笔) has a 100% solid wood handle with a fine natural grain and a warm, elegant feel. Master craftsmen make each brush by hand from carefully chosen fine-peak goat hair, trimmed to a clean point. The bristles look pure, bright, and crystal-clear, like fresh snow. They are ultra-soft, with a sure spring-back and generous water holding, so the brush can lay large watercolor blends, transparent washes, and delicate line work. It is suited to watercolor, plein air landscape sketching, and oriental painting.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/verdant-snow-bristle-brush/feature.jpg"],
    uses: ["wash", "sketching", "detail", "studio"],
    handle: "short",
    feel: "soft",
    level: "professional",
    featured: true,
    addedAt: "2026-10-15",
    specs: {
      "Best for": "Large watercolor blends, transparent washes, delicate lines",
      "Brush type": "Limited collector wood handle",
      "Hair": "80% high-quality goat, 20% synthetic",
      "Tip length": "2.2 cm",
      "Handle length": "16 cm",
      "Shaft diameter": "0.85 cm",
      "Handle": "Solid wood, natural grain",
      "Feel": "Ultra-soft, springy"
    }
  },
  {
    sku: "SA-52",
    slug: "little-gourd-sprite-brush",
    name: "Little Gourd Sprite",
    category: "Coming Soon Brushes",
    summary: "A mini line brush with a jade gourd finial, a short handle, and a fine point for precise linework and small studies.",
    description:
      "Little Gourd Sprite (小葫灵) is a mini line brush. A jade gourd sits on top of the handle, like a forest sprite guarding your inspiration. It is lightweight and portable, with a short reddish-wood handle. The fine sharp point holds shape well, so it is suited to precise linework and gentle local washes, plein air sketching, and small watercolor studies. The hair is 50% Shantu, 30% rabbit, and 20% synthetic fibre. Let this little gourd sprite accompany you to record every touching scenery along your journey.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/little-gourd-sprite-brush/feature.jpg"],
    uses: ["detail", "sketching", "travel", "wash"],
    handle: "short",
    feel: "springy",
    level: "professional",
    featured: true,
    addedAt: "2026-10-15",
    specs: {
      "Best for": "Precise linework, plein air sketching, small watercolor studies",
      "Brush type": "Mini line brush",
      "Hair": "50% Shantu, 30% rabbit, 20% synthetic",
      "Tip length": "1.5 cm",
      "Handle length": "12.8 cm",
      "Shaft diameter": "0.5 cm",
      "Handle": "Short reddish wood with jade gourd finial",
      "Feel": "Fine, shape-holding"
    }
  },
  {
    sku: "SA-53",
    slug: "blue-timber-brush",
    name: "Blue Timber Brush",
    category: "Coming Soon Brushes",
    summary: "A solid-wood brush with deep blue fittings, a calm grain, and a springy tip for washes, plein air, and oriental painting.",
    description:
      "Blue Timber Brush is crafted from solid wood, pairing a natural log handle with deep blue wood fittings. The collocation is simple, with a calm and understated texture and a smooth, comfortable grip. The brush tip holds water well and springs back cleanly, so it is suited to watercolor blending, plein air sketching, and oriental painting. It works for large washes as well as fine detailing — a practical, timeless brush for daily studio work. The hair is 70% rabbit and 30% synthetic fibre.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/blue-timber-brush/feature.jpg"],
    uses: ["wash", "sketching", "detail", "studio"],
    handle: "short",
    feel: "springy",
    level: "professional",
    featured: true,
    addedAt: "2026-10-16",
    specs: {
      "Best for": "Watercolor blending, plein air sketching, oriental painting",
      "Brush type": "Solid wood studio brush",
      "Hair": "70% rabbit, 30% synthetic",
      "Tip length": "2.3 cm",
      "Handle length": "16 cm",
      "Shaft diameter": "0.85 cm",
      "Handle": "Natural log with deep blue wood fittings",
      "Feel": "Springy, water-holding"
    }
  },
  {
    sku: "SA-54",
    slug: "coiled-dragon-elegant-brush",
    name: "Coiled Dragon Elegant Brush",
    category: "Coming Soon Brushes",
    summary: "A compact collector brush with a hand-carved coiled dragon shaft, imitation camel bone and ox horn fittings, and a springy tip for washes and freehand linework.",
    description:
      "Coiled Dragon Elegant Brush (盘龙雅笔) carries a 3D coiled dragon pattern, hand-carved with intricate, vivid detail. The imitation camel bone shaft is paired with imitation ox horn fittings for a remarkable texture and classic elegance. Compact and portable, it sits comfortably in the hand. The brush tip holds plenty of liquid and has great elasticity, so it is suited to watercolor washes and Chinese freehand painting, from large washes to delicate linework. It is a brush for art creation, collection, and gifting. The hair is 80% rabbit and 20% synthetic fibre.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/coiled-dragon-elegant-brush/feature.jpg"],
    uses: ["wash", "detail", "line-and-wash", "studio"],
    handle: "short",
    feel: "springy",
    level: "professional",
    featured: true,
    addedAt: "2026-10-16",
    specs: {
      "Best for": "Watercolor washes, Chinese freehand painting, delicate linework",
      "Brush type": "Hand-carved collector brush",
      "Pattern": "Hand-carved coiled dragon",
      "Hair": "80% rabbit, 20% synthetic",
      "Tip length": "2.1 cm",
      "Handle length": "12 cm",
      "Shaft diameter": "0.75 cm",
      "Handle": "Imitation camel bone with imitation ox horn fittings",
      "Feel": "Elastic, liquid-holding"
    }
  },
  {
    sku: "SA-46",
    slug: "turquoise-wave-brush",
    name: "Turquoise Wave Brush",
    category: "Coming Soon Brushes",
    summary: "Handmade watercolor brush with a sculpted turquoise handle, coming soon.",
    description: "Turquoise Wave is a handmade Sicon Art watercolor brush with a sculpted handle. It is coming soon.",
    priceCents: 0,
    currency: "USD",
    images: ["/products/turquoise-wave-brush/feature.png"],
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
  return products.find((product) => product.slug === slug || product.legacySlugs?.includes(slug));
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

export function formatCardPrice(product: Product) {
  const prices = [product.priceCents, ...(product.variants ?? []).map((variant) => variant.priceCents)].filter(
    (cents) => cents > 0
  );
  if (prices.length === 0) return "Coming soon";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatPrice(min, product.currency) : `From ${formatPrice(min, product.currency)}`;
}

export function isPurchasable(product: Pick<Product, "priceCents" | "variants">) {
  if ((product.variants ?? []).some((variant) => variant.priceCents > 0)) return true;
  return product.priceCents > 0;
}

function catalogIndex(sku: string) {
  return products.findIndex((product) => product.sku === sku);
}

function addedRank(product: Product) {
  return product.addedAt || `2026-06-28-${String(catalogIndex(product.sku)).padStart(3, "0")}`;
}

export function getHomepageFeatured(limit = 12, source: Product[] = products) {
  const featured = source.filter((product) => product.featured);
  const extra = source.filter((product) => !product.featured && isPurchasable(product));
  return [...featured, ...extra].slice(0, limit);
}

export function getNewArrivals(limit = 8, source: Product[] = products) {
  const used = new Set(getHomepageFeatured(12, source).map((product) => product.sku));
  return source
    .filter((product) => isPurchasable(product) && !used.has(product.sku))
    .sort((left, right) => addedRank(right).localeCompare(addedRank(left)))
    .slice(0, limit);
}

export function getLatestProducts(limit = 8, source: Product[] = products) {
  return [...source]
    .sort((left, right) => {
      const byDate = addedRank(right).localeCompare(addedRank(left));
      if (byDate !== 0) return byDate;
      return left.name.localeCompare(right.name);
    })
    .slice(0, limit);
}

export function getBrushSets(limit = 8, source: Product[] = products) {
  return source
    .filter((product) => {
      if ((product.variants?.length ?? 0) > 1) return true;
      return /series|set/i.test(`${product.name} ${product.slug}`);
    })
    .slice(0, limit);
}
