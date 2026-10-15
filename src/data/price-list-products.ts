export type PriceListProduct = {
  sku: string;
  name: string;
  image: string;
  currency: "USD";
  retailCents: number;
  artistCents: number;
  miniWholesaleCents: number;
  miniWholesaleMoq: number;
  bulkWholesaleCents: number;
  bulkWholesaleMoq: number;
};

export type PriceListBrowseId =
  | "all"
  | "everyday"
  | "signature"
  | "collector"
  | "sketch"
  | "master-painter"
  | "rare-collectable";

export type PriceListTag = "sketch" | "master-painter" | "rare-collectable";

export const priceListBrowseCategories: Array<{ id: PriceListBrowseId; label: string }> = [
  { id: "all", label: "All" },
  { id: "everyday", label: "Everyday · Under $20" },
  { id: "signature", label: "Signature · $20–$50" },
  { id: "collector", label: "Collector · $50+" },
  { id: "sketch", label: "Sketch brushes" },
  { id: "master-painter", label: "Master painter" },
  { id: "rare-collectable", label: "Rare & collectable" }
];

export const priceListTagsBySku: Record<string, PriceListTag[]> = {
  "SA-05": ["sketch"],
  "SA-06": ["sketch"],
  "SA-07": ["sketch", "rare-collectable"],
  "SA-09": ["sketch"],
  "SA-10": ["sketch"],
  "SA-12": ["sketch"],
  "SA-14": ["sketch"],
  "SA-15": ["sketch"],
  "SA-19-L": ["sketch"],
  "SA-19-S": ["sketch"],
  "SA-20-E": ["sketch"],
  "SA-20-ST": ["sketch"],
  "SA-21": ["master-painter", "rare-collectable"],
  "SA-22": ["sketch"],
  "SA-24": ["sketch"],
  "SA-25": ["sketch"],
  "SA-26": ["sketch"],
  "SA-30-SET": ["master-painter", "rare-collectable"],
  "SA-31": ["master-painter", "rare-collectable"],
  "SA-32-L": ["master-painter"],
  "SA-32-M": ["master-painter"],
  "SA-32-S": ["master-painter"],
  "SA-33": ["master-painter", "rare-collectable"],
  "SA-34": ["sketch"],
  "SA-35-L": ["master-painter"],
  "SA-35-M": ["master-painter"],
  "SA-35-S": ["master-painter"],
  "SA-36": ["sketch"],
  "SA-37": ["master-painter", "rare-collectable"],
  "SA-38": ["master-painter", "rare-collectable"],
  "SA-39": ["master-painter", "rare-collectable"],
  "SA-40": ["master-painter", "rare-collectable"],
  "SA-41": ["rare-collectable"],
  "SA-42": ["rare-collectable"],
  "SA-45": ["rare-collectable"],
  "SA-46": ["rare-collectable"],
  "SA-48": ["master-painter", "rare-collectable"],
  "SA-49": ["sketch", "master-painter", "rare-collectable"],
  "SA-50": ["sketch", "master-painter", "rare-collectable"],
  "SA-51": ["sketch", "master-painter", "rare-collectable"]
};

export function priceListTagsFor(sku: string): PriceListTag[] {
  return priceListTagsBySku[sku] ?? [];
}

export function priceListBandFor(retailCents: number): "everyday" | "signature" | "collector" | "coming-soon" {
  if (retailCents <= 0) return "coming-soon";
  if (retailCents < 2000) return "everyday";
  if (retailCents < 5000) return "signature";
  return "collector";
}

export function matchesPriceListBrowse(sku: string, retailCents: number, browseId: PriceListBrowseId) {
  if (browseId === "all") return true;
  if (browseId === "everyday" || browseId === "signature" || browseId === "collector") {
    return priceListBandFor(retailCents) === browseId;
  }
  return priceListTagsFor(sku).includes(browseId);
}

export const priceListProducts: PriceListProduct[] = [
  {
    sku: "SA-14",
    name: "Chi Ling Travel Brush",
    image: "/products/price-list/sa-14-chi-ling-travel-brush.jpg",
    currency: "USD",
    retailCents: 1200,
    artistCents: 850,
    miniWholesaleCents: 240,
    miniWholesaleMoq: 200,
    bulkWholesaleCents: 120,
    bulkWholesaleMoq: 600
  },
  {
    sku: "SA-06",
    name: "Ruyue Short Brush",
    image: "/products/price-list/sa-06-ruyue-short-brush.jpg",
    currency: "USD",
    retailCents: 1300,
    artistCents: 900,
    miniWholesaleCents: 320,
    miniWholesaleMoq: 200,
    bulkWholesaleCents: 160,
    bulkWholesaleMoq: 600
  },
  {
    sku: "SA-05",
    name: "Travel Series Brush - T3",
    image: "/products/price-list/sa-05-travel-series-brush-t3.jpg",
    currency: "USD",
    retailCents: 1300,
    artistCents: 900,
    miniWholesaleCents: 340,
    miniWholesaleMoq: 200,
    bulkWholesaleCents: 170,
    bulkWholesaleMoq: 800
  },
  {
    sku: "SA-12",
    name: "Dark Green Short WOOD Brush",
    image: "/products/price-list/sa-12-dark-green-short-wood-brush.jpg",
    currency: "USD",
    retailCents: 2300,
    artistCents: 1500,
    miniWholesaleCents: 700,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 320,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-22",
    name: "Feng Short Sketch Brush",
    image: "/products/price-list/sa-22-feng-short-sketch-brush.jpg",
    currency: "USD",
    retailCents: 1350,
    artistCents: 950,
    miniWholesaleCents: 400,
    miniWholesaleMoq: 200,
    bulkWholesaleCents: 200,
    bulkWholesaleMoq: 500
  },
  {
    sku: "SA-09",
    name: "Happiness Short Travel Brush",
    image: "/products/price-list/sa-09-happiness-short-travel-brush.jpg",
    currency: "USD",
    retailCents: 1350,
    artistCents: 950,
    miniWholesaleCents: 360,
    miniWholesaleMoq: 200,
    bulkWholesaleCents: 180,
    bulkWholesaleMoq: 500
  },
  {
    sku: "SA-26",
    name: "Red Tiny Brush",
    image: "/products/price-list/sa-26-red-tiny-brush.jpg",
    currency: "USD",
    retailCents: 1400,
    artistCents: 1000,
    miniWholesaleCents: 400,
    miniWholesaleMoq: 200,
    bulkWholesaleCents: 220,
    bulkWholesaleMoq: 500
  },
  {
    sku: "SA-24",
    name: "Sicon Art Travel Brush T7",
    image: "/products/price-list/sa-24-sicon-art-travel-brush-t7.jpg",
    currency: "USD",
    retailCents: 2300,
    artistCents: 1500,
    miniWholesaleCents: 700,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 350,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-25",
    name: "Sicon Art Travel Brush T8",
    image: "/products/price-list/sa-25-sicon-art-travel-brush-t8.jpg",
    currency: "USD",
    retailCents: 2300,
    artistCents: 1500,
    miniWholesaleCents: 700,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 350,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-15",
    name: "Sicon Art Travel Brush T9",
    image: "/products/price-list/sa-15-sicon-art-travel-brush-t9.jpg",
    currency: "USD",
    retailCents: 2300,
    artistCents: 1500,
    miniWholesaleCents: 700,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 350,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-07",
    name: "T1 Soulmate Limited Travel Brush",
    image: "/products/price-list/sa-07-t1-soulmate-limited-travel-brush.jpg",
    currency: "USD",
    retailCents: 3900,
    artistCents: 2500,
    miniWholesaleCents: 1500,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 830,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-20-E",
    name: "T10 Travel Brush ? (Ember)",
    image: "/products/price-list/sa-20-e-t10-travel-brush-ember.jpg",
    currency: "USD",
    retailCents: 1500,
    artistCents: 1050,
    miniWholesaleCents: 440,
    miniWholesaleMoq: 200,
    bulkWholesaleCents: 220,
    bulkWholesaleMoq: 500
  },
  {
    sku: "SA-20-ST",
    name: "T10 Travel Brush ? (Still)",
    image: "/products/price-list/sa-20-st-t10-travel-brush-still.jpg",
    currency: "USD",
    retailCents: 1400,
    artistCents: 1000,
    miniWholesaleCents: 440,
    miniWholesaleMoq: 200,
    bulkWholesaleCents: 210,
    bulkWholesaleMoq: 500
  },
  {
    sku: "SA-13-A",
    name: "Chi Xiao & QingMing Brush A",
    image: "/products/price-list/sa-13-a-chi-xiao-qingming-brush-a.jpg",
    currency: "USD",
    retailCents: 1500,
    artistCents: 1050,
    miniWholesaleCents: 440,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 220,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-13-B",
    name: "Chi Xiao & QingMing Brush B",
    image: "/products/price-list/sa-13-b-chi-xiao-qingming-brush-b.jpg",
    currency: "USD",
    retailCents: 1500,
    artistCents: 1050,
    miniWholesaleCents: 440,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 220,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-34",
    name: "Run Hao Short Brush",
    image: "/products/price-list/sa-34-run-hao-short-brush.jpg",
    currency: "USD",
    retailCents: 1700,
    artistCents: 1200,
    miniWholesaleCents: 560,
    miniWholesaleMoq: 200,
    bulkWholesaleCents: 270,
    bulkWholesaleMoq: 500
  },
  {
    sku: "SA-23",
    name: "Early Spring Brush",
    image: "/products/price-list/sa-23-early-spring-brush.jpg",
    currency: "USD",
    retailCents: 1950,
    artistCents: 1350,
    miniWholesaleCents: 620,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 320,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-19-S",
    name: "Feng Hui Outline Brush S",
    image: "/products/price-list/sa-19-s-feng-hui-outline-brush-s.jpg",
    currency: "USD",
    retailCents: 1000,
    artistCents: 700,
    miniWholesaleCents: 150,
    miniWholesaleMoq: 200,
    bulkWholesaleCents: 80,
    bulkWholesaleMoq: 500
  },
  {
    sku: "SA-19-L",
    name: "Feng Hui Outline Brush L",
    image: "/products/price-list/sa-19-l-feng-hui-outline-brush-l.jpg",
    currency: "USD",
    retailCents: 1050,
    artistCents: 750,
    miniWholesaleCents: 170,
    miniWholesaleMoq: 200,
    bulkWholesaleCents: 90,
    bulkWholesaleMoq: 500
  },
  {
    sku: "SA-16",
    name: "Spring Back Brush",
    image: "/products/price-list/sa-16-spring-back-brush.jpg",
    currency: "USD",
    retailCents: 1900,
    artistCents: 1350,
    miniWholesaleCents: 640,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 310,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-17",
    name: "Green Sprig Spring Brush",
    image: "/products/price-list/sa-17-green-sprig-spring-brush.jpg",
    currency: "USD",
    retailCents: 1900,
    artistCents: 1350,
    miniWholesaleCents: 640,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 310,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-35-S",
    name: "Sandalwood Handle Brush Series - L5 S",
    image: "/products/price-list/sa-35-s-sandalwood-handle-brush-series-l5-s.jpg",
    currency: "USD",
    retailCents: 2600,
    artistCents: 1700,
    miniWholesaleCents: 820,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 410,
    bulkWholesaleMoq: 500
  },
  {
    sku: "SA-35-M",
    name: "Sandalwood Handle Brush Series - L5 M",
    image: "/products/price-list/sa-35-m-sandalwood-handle-brush-series-l5-m.jpg",
    currency: "USD",
    retailCents: 2700,
    artistCents: 1800,
    miniWholesaleCents: 840,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 420,
    bulkWholesaleMoq: 500
  },
  {
    sku: "SA-35-L",
    name: "Sandalwood Handle Brush Series - L5 L",
    image: "/products/price-list/sa-35-l-sandalwood-handle-brush-series-l5-l.jpg",
    currency: "USD",
    retailCents: 2800,
    artistCents: 1800,
    miniWholesaleCents: 860,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 430,
    bulkWholesaleMoq: 500
  },
  {
    sku: "SA-27",
    name: "Purple Dream Brush",
    image: "/products/price-list/sa-27-purple-dream-brush.jpg",
    currency: "USD",
    retailCents: 1500,
    artistCents: 1050,
    miniWholesaleCents: 440,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 220,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-10",
    name: "Shede Short Brush",
    image: "/products/price-list/sa-10-shede-short-brush.jpg",
    currency: "USD",
    retailCents: 1400,
    artistCents: 1000,
    miniWholesaleCents: 420,
    miniWholesaleMoq: 200,
    bulkWholesaleCents: 220,
    bulkWholesaleMoq: 500
  },
  {
    sku: "SA-11#3",
    name: "Sicon Art Flat Brush Series #3",
    image: "/products/price-list/sa-11-3-sicon-art-flat-brush-series-3.jpg",
    currency: "USD",
    retailCents: 2300,
    artistCents: 1500,
    miniWholesaleCents: 450,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 350,
    bulkWholesaleMoq: 200
  },
  {
    sku: "SA-11#5",
    name: "Sicon Art Flat Brush Series #5",
    image: "/products/price-list/sa-11-5-sicon-art-flat-brush-series-5.jpg",
    currency: "USD",
    retailCents: 2900,
    artistCents: 1900,
    miniWholesaleCents: 760,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 650,
    bulkWholesaleMoq: 200
  },
  {
    sku: "SA-11#7",
    name: "Sicon Art Flat Brush Series #7",
    image: "/products/price-list/sa-11-7-sicon-art-flat-brush-series-7.jpg",
    currency: "USD",
    retailCents: 3200,
    artistCents: 2100,
    miniWholesaleCents: 850,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 760,
    bulkWholesaleMoq: 200
  },
  {
    sku: "SA-08",
    name: "Sicon Art Qin Brush",
    image: "/products/price-list/sa-08-sicon-art-qin-brush.jpg",
    currency: "USD",
    retailCents: 1500,
    artistCents: 1050,
    miniWholesaleCents: 440,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 220,
    bulkWholesaleMoq: 500
  },
  {
    sku: "SA-28",
    name: "Zi Tan Brush",
    image: "/products/price-list/sa-28-zi-tan-brush.jpg",
    currency: "USD",
    retailCents: 1950,
    artistCents: 1350,
    miniWholesaleCents: 470,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 320,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-21",
    name: "Deep Glow Brush",
    image: "/products/price-list/sa-21-deep-glow-brush.jpg",
    currency: "USD",
    retailCents: 4200,
    artistCents: 2700,
    miniWholesaleCents: 1720,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 850,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-33",
    name: "Raging Tide Bear Hair Wild Cursive Brush",
    image: "/products/price-list/sa-33-raging-tide-bear-hair-wild-cursive-brush.jpg",
    currency: "USD",
    retailCents: 2400,
    artistCents: 1600,
    miniWholesaleCents: 720,
    miniWholesaleMoq: 200,
    bulkWholesaleCents: 360,
    bulkWholesaleMoq: 500
  },
  {
    sku: "SA-36",
    name: "Short Handle Series - S1",
    image: "/products/price-list/sa-36-short-handle-series-s1.jpg",
    currency: "USD",
    retailCents: 2300,
    artistCents: 1500,
    miniWholesaleCents: 510,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 350,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-18",
    name: "Snow Shadow Brush",
    image: "/products/price-list/sa-18-snow-shadow-brush.jpg",
    currency: "USD",
    retailCents: 2400,
    artistCents: 1600,
    miniWholesaleCents: 720,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 360,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-32-S",
    name: "SuHan Brush  S",
    image: "/products/price-list/sa-32-s-suhan-brush-s.jpg",
    currency: "USD",
    retailCents: 2400,
    artistCents: 1600,
    miniWholesaleCents: 750,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 350,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-32-M",
    name: "SuHan Brush  M",
    image: "/products/price-list/sa-32-m-suhan-brush-m.jpg",
    currency: "USD",
    retailCents: 2600,
    artistCents: 1700,
    miniWholesaleCents: 780,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 360,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-32-L",
    name: "SuHan Brush  L",
    image: "/products/price-list/sa-32-l-suhan-brush-l.jpg",
    currency: "USD",
    retailCents: 2600,
    artistCents: 1700,
    miniWholesaleCents: 820,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 370,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-30-SET",
    name: "Tai Chi Yin Brush",
    image: "/products/price-list/sa-30-set-tai-chi-yin-brush.jpg",
    currency: "USD",
    retailCents: 2950,
    artistCents: 1900,
    miniWholesaleCents: 950,
    miniWholesaleMoq: 50,
    bulkWholesaleCents: 450,
    bulkWholesaleMoq: 250
  },
  {
    sku: "SA-31",
    name: "Yun Tao Large Heavy Brush",
    image: "/products/price-list/sa-31-yun-tao-large-heavy-brush.jpg",
    currency: "USD",
    retailCents: 3800,
    artistCents: 2500,
    miniWholesaleCents: 1800,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 800,
    bulkWholesaleMoq: 300
  },
  {
    sku: "SA-39",
    name: "Golden Bamboo Song",
    image: "/products/price-list/sa-39-golden-bamboo-song.jpg",
    currency: "USD",
    retailCents: 6500,
    artistCents: 3900,
    miniWholesaleCents: 1840,
    miniWholesaleMoq: 5,
    bulkWholesaleCents: 2030,
    bulkWholesaleMoq: 5
  },
  {
    sku: "SA-38",
    name: "Song Elegance Golden Umbrella Brush",
    image: "/products/price-list/sa-38-song-elegance-golden-umbrella-brush.jpg",
    currency: "USD",
    retailCents: 10500,
    artistCents: 6400,
    miniWholesaleCents: 3500,
    miniWholesaleMoq: 5,
    bulkWholesaleCents: 3500,
    bulkWholesaleMoq: 5
  },
  {
    sku: "SA-37",
    name: "Song Mist Azure Lacquer",
    image: "/products/price-list/sa-37-song-mist-azure-lacquer.jpg",
    currency: "USD",
    retailCents: 12200,
    artistCents: 7400,
    miniWholesaleCents: 5200,
    miniWholesaleMoq: 5,
    bulkWholesaleCents: 5200,
    bulkWholesaleMoq: 5
  },
  {
    sku: "SA-40",
    name: "Xiang Bamboo Ebony Shadow Song Brush",
    image: "/products/price-list/sa-40-xiang-bamboo-ebony-shadow-song-brush.jpg",
    currency: "USD",
    retailCents: 12200,
    artistCents: 7400,
    miniWholesaleCents: 5200,
    miniWholesaleMoq: 5,
    bulkWholesaleCents: 5200,
    bulkWholesaleMoq: 5
  },
  {
    sku: "SA-ACC-01",
    name: "Reusable Calligraphy Water Writing Scroll",
    image: "/products/price-list/sa-acc-01-reusable-calligraphy-water-writing-scroll.jpg",
    currency: "USD",
    retailCents: 2400,
    artistCents: 1600,
    miniWholesaleCents: 730,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 360,
    bulkWholesaleMoq: 200
  },
  {
    sku: "SA-ACC-02",
    name: "Bamboo and Linen Brush Roll [10 Brush Holder]",
    image: "/products/price-list/sa-acc-02-bamboo-and-linen-brush-roll-10-brush-holder.jpg",
    currency: "USD",
    retailCents: 2400,
    artistCents: 1600,
    miniWholesaleCents: 730,
    miniWholesaleMoq: 100,
    bulkWholesaleCents: 360,
    bulkWholesaleMoq: 200
  },
  {
    sku: "SA-41",
    name: "Color Ring Bamboo Brush",
    image: "/products/price-list/sa-41-color-ring-bamboo-brush.jpg",
    currency: "USD",
    retailCents: 0,
    artistCents: 0,
    miniWholesaleCents: 0,
    miniWholesaleMoq: 0,
    bulkWholesaleCents: 0,
    bulkWholesaleMoq: 0
  },
  {
    sku: "SA-42",
    name: "Jade Orb Dark Tip Brush",
    image: "/products/price-list/sa-42-jade-orb-dark-tip-brush.png",
    currency: "USD",
    retailCents: 0,
    artistCents: 0,
    miniWholesaleCents: 0,
    miniWholesaleMoq: 0,
    bulkWholesaleCents: 0,
    bulkWholesaleMoq: 0
  },
  {
    sku: "SA-43",
    name: "Pink Youth Glow Brush",
    image: "/products/price-list/sa-43-pink-youth-glow-brush.png",
    currency: "USD",
    retailCents: 800,
    artistCents: 0,
    miniWholesaleCents: 0,
    miniWholesaleMoq: 0,
    bulkWholesaleCents: 0,
    bulkWholesaleMoq: 0
  },
  {
    sku: "SA-44",
    name: "Sapphire Jade Brush",
    image: "/products/price-list/sa-44-sapphire-jade-brush.png",
    currency: "USD",
    retailCents: 800,
    artistCents: 0,
    miniWholesaleCents: 0,
    miniWholesaleMoq: 0,
    bulkWholesaleCents: 0,
    bulkWholesaleMoq: 0
  },
  {
    sku: "SA-47",
    name: "Ivory Flow Brush",
    image: "/products/price-list/sa-47-ivory-flow-brush.png",
    currency: "USD",
    retailCents: 800,
    artistCents: 0,
    miniWholesaleCents: 0,
    miniWholesaleMoq: 0,
    bulkWholesaleCents: 0,
    bulkWholesaleMoq: 0
  },
  {
    sku: "SA-45",
    name: "Skyward Dragon Brush",
    image: "/products/price-list/sa-45-skyward-dragon-brush.jpg",
    currency: "USD",
    retailCents: 0,
    artistCents: 0,
    miniWholesaleCents: 0,
    miniWholesaleMoq: 0,
    bulkWholesaleCents: 0,
    bulkWholesaleMoq: 0
  },
  {
    sku: "SA-46",
    name: "Turquoise Wave Brush",
    image: "/products/price-list/sa-46-turquoise-wave-brush.png",
    currency: "USD",
    retailCents: 0,
    artistCents: 0,
    miniWholesaleCents: 0,
    miniWholesaleMoq: 0,
    bulkWholesaleCents: 0,
    bulkWholesaleMoq: 0
  },
  {
    sku: "SA-48",
    name: "Embroidered Prosperity Deer Brush",
    image: "/products/price-list/sa-48-embroidered-prosperity-deer-brush.jpg",
    currency: "USD",
    retailCents: 0,
    artistCents: 0,
    miniWholesaleCents: 0,
    miniWholesaleMoq: 0,
    bulkWholesaleCents: 0,
    bulkWholesaleMoq: 0
  },
  {
    sku: "SA-49",
    name: "Xiangfei Scroll",
    image: "/products/price-list/sa-49-xiangfei-scroll-brush.jpg",
    currency: "USD",
    retailCents: 0,
    artistCents: 0,
    miniWholesaleCents: 0,
    miniWholesaleMoq: 0,
    bulkWholesaleCents: 0,
    bulkWholesaleMoq: 0
  },
  {
    sku: "SA-50",
    name: "Verdant Hare Point",
    image: "/products/price-list/sa-50-verdant-hare-point-brush.jpg",
    currency: "USD",
    retailCents: 0,
    artistCents: 0,
    miniWholesaleCents: 0,
    miniWholesaleMoq: 0,
    bulkWholesaleCents: 0,
    bulkWholesaleMoq: 0
  },
  {
    sku: "SA-51",
    name: "Verdant Snow Bristle",
    image: "/products/price-list/sa-51-verdant-snow-bristle-brush.jpg",
    currency: "USD",
    retailCents: 0,
    artistCents: 0,
    miniWholesaleCents: 0,
    miniWholesaleMoq: 0,
    bulkWholesaleCents: 0,
    bulkWholesaleMoq: 0
  },
];
