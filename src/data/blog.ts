export type GuideFigure = {
  src: string;
  alt: string;
  caption?: string;
};

export type GuideSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  figure?: GuideFigure;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  dek: string;
  answer: string;
  publishedAt: string;
  author: string;
  hero: GuideFigure;
  collectionHref: string;
  collectionLabel: string;
  productSlugs: string[];
  relatedSlugs: string[];
  sections: GuideSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "chinese-watercolor-brush-prices",
    title: "Chinese watercolor brush prices: what you pay at Sicon Art",
    description:
      "Current Sicon Art retail prices for handmade Chinese watercolor brushes, from entry Chinese-style handles to travel brushes and master studio pieces.",
    dek: "A clear look at our public USD prices, what the number includes, and how entry, travel, and master brushes sit on the shop.",
    answer:
      "Sicon Art prices are the public retail price of one handmade brush, in US dollars, before shipping. Entry Chinese-style brushes sit at the accessible end of the shop. Travel brushes cost more because of the travel handle. Master studio brushes cost more because of larger forms and longer making. Coming soon brushes have no retail price yet.",
    publishedAt: "2026-10-18",
    author: "Tina Wang",
    hero: {
      src: "/brand/classic-brushes.webp",
      alt: "A group of handmade Sicon Art Chinese watercolor brushes",
      caption: "Handmade brushes from our Dongguan workshop."
    },
    collectionHref: "/shop",
    collectionLabel: "Shop all brushes",
    productSlugs: [
      "pink-youth-glow-brush",
      "sapphire-jade-brush",
      "ivory-flow-brush",
      "chi-ling-travel-brush",
      "travel-series-brush-t3",
      "happiness-short-travel-brush",
      "tai-chi-yin-brush",
      "golden-bamboo-song"
    ],
    relatedSlugs: ["choose-brush-urban-sketching", "travel-vs-short-handle-watercolor-brush"],
    sections: [
      {
        id: "how-to-read-our-prices",
        heading: "How to read a Sicon Art price",
        paragraphs: [
          "Every priced brush on this website shows a public retail price in US dollars. That number is the brush itself. Shipping is added at checkout for countries with a published rate. If your country is not listed, send us a message and we will quote delivery.",
          "The table at the end of this page reads the same live shop prices you see on each product. When a list-page market price changes, this guide follows it.",
          "A Sicon Art price is our catalog, not a survey of every Chinese brush sold online. We do not publish a worldwide average."
        ]
      },
      {
        id: "entry-chinese-style",
        heading: "Entry Chinese-style brushes",
        paragraphs: [
          "Pink Youth Glow, Sapphire Jade, and Ivory Flow are the accessible end of the shop. Each is a short-handle handmade Chinese watercolor brush for sketching, washes, and everyday studio work.",
          "The cards at the end of this page show their live retail prices. They are a practical way to start with a Sicon Art handle without buying a travel mechanism or a master studio brush."
        ],
        figure: {
          src: "/products/pink-youth-glow-brush/gallery/brush details in a beautiful background.jpg",
          alt: "Pink Youth Glow Brush, a handmade Sicon Art Chinese watercolor brush",
          caption: "Pink Youth Glow, an entry Chinese-style brush from the shop."
        }
      },
      {
        id: "travel-and-everyday",
        heading: "Travel and everyday brushes",
        paragraphs: [
          "Chi Ling, T3, and Happiness cost more than the entry Chinese-style brushes because they are built as travel tools. You pay for a compact handle that lives in a kit. T3 and Happiness also include a protective cap.",
          "Open each product page for the current number. This page is about what that number is for: the brush, in USD, before shipping. For which travel shape belongs in a sketch kit, read the urban sketching guide and the travel versus short-handle guide."
        ]
      },
      {
        id: "master-studio",
        heading: "Master studio brushes",
        paragraphs: [
          "Tai Chi Yin and the Song series sit at the high end because they are long-handle studio brushes with more involved making. A higher price is the cost of that form. It is not a score for a better painting.",
          "If a brush is marked Coming soon, it has no retail price. You can look at it. You cannot add it to the cart until we publish a price."
        ],
        figure: {
          src: "/brand/brush-making.jpg",
          alt: "Natural hair and bamboo prepared in the Sicon Art workshop",
          caption: "Hair and handles prepared by hand in Dongguan."
        }
      },
      {
        id: "what-is-included",
        heading: "What is included, and what is not",
        paragraphs: [
          "The listed price is the brush on the product page. It does not include shipping, duties, or local taxes.",
          "Custom handle engraving on the T3 is available by enquiry. There is no extra published USD amount on the product. Write the wording you want; we confirm the details before making it.",
          "Use the live table below when you are comparing cost. Use the other two guides when you are comparing the job or the handle construction."
        ]
      }
    ]
  },
  {
    slug: "choose-brush-urban-sketching",
    title: "Which travel watercolor brush to choose for urban sketching",
    description:
      "Pick a Sicon Art brush for urban sketching by the job: sketchbook, street, architecture, or finishing line.",
    dek: "Match the brush to the sketch in front of you, then pack only what that job needs.",
    answer:
      "For fast street sketches, start with Feng Short. For a kit that lives in a bag, pack Chi Ling. Add Feng Hui Outline or Red Tiny when the page needs architecture, figures, or a finishing line. T1 is the limited sketchbook travel brush Sanjeewee Senevirathna paints with.",
    publishedAt: "2026-10-18",
    author: "Tina Wang",
    hero: {
      src: "/brand/tina-wang-about.webp",
      alt: "Tina Wang painting watercolor outdoors",
      caption: "Urban sketching and plein air are why we make compact Chinese watercolor brushes."
    },
    collectionHref: "/collections/urban-sketching-brushes",
    collectionLabel: "Urban sketching brushes",
    productSlugs: [
      "feng-short-sketch-brush",
      "chi-ling-travel-brush",
      "feng-hui-outline-brush",
      "red-tiny-brush",
      "t1-soulmate-limited-travel-brush"
    ],
    relatedSlugs: ["travel-vs-short-handle-watercolor-brush", "chinese-watercolor-brush-prices"],
    sections: [
      {
        id: "start-from-the-sketch",
        heading: "Start from the sketch, not the catalog",
        paragraphs: [
          "Urban sketching is a set of jobs: a page in a sketchbook, a wall or railing as a desk, a street facade, a figure, a tree. The right brush is the one that serves the job in front of you, in a bag you will actually carry.",
          "We make Chinese watercolor brushes for that kind of painting. This guide names the jobs. The travel versus short-handle guide explains how the handle is built. The prices guide shows what each brush costs today."
        ],
        figure: {
          src: "/media/events/greater-bay-area-urban-sketching/tina-at-backdrop.jpg",
          alt: "Tina Wang at the Greater Bay Area Urban Sketching Annual Meeting",
          caption: "Founder Tina Wang at the Greater Bay Area Urban Sketching Annual Meeting 2026."
        }
      },
      {
        id: "street-and-speed",
        heading: "Street sketches that have to move",
        paragraphs: [
          "Feng Short Sketch Brush is the brush we make for urban sketching as a named category. The short handle keeps your hand close to the page, which helps when you are standing, sitting on a step, or working in a small sketchbook.",
          "Reach for it when the sketch is line plus a small wash: a shopfront, a bicycle, a patch of shadow. It is a working street brush, not a studio wash brush."
        ],
        figure: {
          src: "/products/feng-short-sketch-brush/gallery/close-up.jpg",
          alt: "Close-up of the Feng Short Sketch Brush tip",
          caption: "Feng Short, made for line-and-wash on location."
        }
      },
      {
        id: "sketchbook-in-a-bag",
        heading: "A sketchbook that lives in a bag",
        paragraphs: [
          "When the brush has to survive a packed kit, choose a travel brush. Chi Ling is the compact travel watercolor brush we make for sketchbook painting and plein air. It is the brush to pack when the day is walking, waiting, and painting in short bursts.",
          "T1 Soulmate Limited Travel Brush is the limited sketchbook travel brush our first ambassador, Sanjeewee Senevirathna, paints with. Choose it when you want that compact travel form as a limited piece."
        ],
        figure: {
          src: "/products/chi-ling-travel-brush/gallery/close-up in nice background.jpg",
          alt: "Chi Ling Travel Brush in a still-life setting",
          caption: "Chi Ling, a compact travel brush for sketchbook watercolor."
        }
      },
      {
        id: "architecture-and-line",
        heading: "Architecture, figures, and the last line",
        paragraphs: [
          "Facades, windows, lettering, branches, and figures need a dedicated point. Feng Hui Outline is the detail brush for those marks. It comes in sizes S and L, so you can pick a thinner or heavier outline without changing the rest of the kit.",
          "Red Tiny is the finishing brush: edges, small letters, and the last marks of a sketch. Pack it when the page is already a wash and you still need a sharp line.",
          "A practical outdoor kit is one working brush plus one line brush. Feng Short with Feng Hui covers most street pages. Chi Ling with Red Tiny covers a bag that stays zipped until you sit down."
        ]
      }
    ]
  },
  {
    slug: "travel-vs-short-handle-watercolor-brush",
    title: "Travel or short handle: which watercolor brush belongs in your sketch kit",
    description:
      "Compare Sicon Art travel watercolor brushes and short-handle brushes by construction: protected tip versus a hand close to the paper.",
    dek: "The difference is how the handle is built, not which brush paints better.",
    answer:
      "Choose a travel handle when the brush lives in a bag and the tip needs protection. T3 and Happiness include a cap. Choose a short handle when you want your hand close to the paper at a desk, on a wall, or in a sketchbook you hold. Qin, Ruyue, and Shede are short-handle studio and practice brushes.",
    publishedAt: "2026-10-18",
    author: "Tina Wang",
    hero: {
      src: "/products/travel-series-brush-t3/gallery/close-up.jpg",
      alt: "Close-up of the T3 travel watercolor brush",
      caption: "T3 travel handle with a protected tip for a packed kit."
    },
    collectionHref: "/collections/travel-watercolor-brushes",
    collectionLabel: "Travel watercolor brushes",
    productSlugs: [
      "travel-series-brush-t3",
      "happiness-short-travel-brush",
      "sicon-art-qin-brush",
      "ruyue-short-brush",
      "shede-short-brush",
      "dark-green-short-wood-brush"
    ],
    relatedSlugs: ["choose-brush-urban-sketching", "chinese-watercolor-brush-prices"],
    sections: [
      {
        id: "two-constructions",
        heading: "Two constructions, two jobs",
        paragraphs: [
          "A travel watercolor brush and a short-handle brush are built differently. Travel construction protects the tip while the brush moves. Short-handle construction keeps your hand close to the paper while you paint.",
          "Neither form is a quality rank. Pack the construction that matches how you carry the brush. For which urban-sketching job to give each brush, use the urban sketching guide. For current USD prices, use the prices guide."
        ]
      },
      {
        id: "travel-handle",
        heading: "What a travel handle does",
        paragraphs: [
          "A Sicon Art travel brush uses a compact travel handle so the hair is not left exposed in a pouch. T3 and Happiness add a protective cap. T3 is a pocket travel brush: 1.7 cm tip, 0.5 cm shaft, 13 cm handle, black weasel hair mix, metal sections on the barrel. Happiness is a bamboo travel brush: 2.5 cm tip, 0.65 cm shaft, 13 cm handle, horse and synthetic hair mix.",
          "Choose this construction when the brush spends most of its life in a bag, a roll, or a pocket kit. The extra parts exist to protect the point between sketches."
        ],
        figure: {
          src: "/products/travel-series-brush-t3/gallery/hair-detail.jpg",
          alt: "Hair detail of the T3 pocket travel watercolor brush",
          caption: "T3 hair and travel barrel, made to close in a kit."
        }
      },
      {
        id: "short-handle",
        heading: "What a short handle does",
        paragraphs: [
          "A short handle has no travel cap. Your hand sits closer to the paper, which helps for studies, daily practice, and any page you hold rather than rest on a studio table.",
          "Ruyue, Shede, and Dark Green Short WOOD are short-handle everyday brushes. Qin is a short-handle Chinese watercolor brush with goat, hemp, and synthetic hair, a 3 cm tip, 0.6 cm shaft, and a 15 cm wood handle. It is a studio and line-and-wash brush, not a pocket travel tool."
        ],
        figure: {
          src: "/products/sicon-art-qin-brush/gallery/close-up.jpg",
          alt: "Close-up of the Sicon Art Qin Brush",
          caption: "Qin, a short wood-handle Chinese watercolor brush for the desk."
        }
      },
      {
        id: "how-to-choose",
        heading: "How to choose one, or both",
        paragraphs: [
          "If you carry one brush, ask where it will sit when you are not painting. In a zipped bag, take travel. In the hand or on a desk, take short.",
          "Many painters keep both: a capped travel brush for days away from the studio, and a short handle for the table. That is two constructions, not two copies of the same advice."
        ]
      }
    ]
  }
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
