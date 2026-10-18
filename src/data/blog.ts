export type GuideFigure = {
  src: string;
  alt: string;
  caption?: string;
};

export type GuideTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

export type GuideSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  figure?: GuideFigure;
  table?: GuideTable;
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
  productSelect?: "listed" | "under-20-travel";
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
    relatedSlugs: ["travel-watercolor-brush-under-20", "handmade-chinese-watercolor-brush-value"],
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
    relatedSlugs: ["chinese-vs-western-watercolor-brush", "travel-brush-vs-water-brush"],
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
    relatedSlugs: ["t3-vs-chi-ling-travel-brush", "travel-brush-vs-water-brush"],
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
  },
  {
    slug: "chinese-vs-western-watercolor-brush",
    title: "Chinese brush vs Western watercolor brush for urban sketching",
    description:
      "Compare Chinese-form and Western-form watercolor brushes by construction and the urban-sketching marks each form is built for.",
    dek: "The useful difference is the form of the tool, not a nationality contest.",
    answer:
      "A Chinese-form watercolor brush is built so one tip can open into a wash and close into a line. A Western-form brush is usually a numbered size in a metal ferrule, chosen for a more specific mark. Sicon Art makes Chinese-form brushes for line-and-wash urban sketching. We also make a numbered flat series. We have not published a lab test against a named Western brand.",
    publishedAt: "2026-10-18",
    author: "Tina Wang",
    hero: {
      src: "/products/feng-short-sketch-brush/gallery/close-up.jpg",
      alt: "Feng Short Sketch Brush tip, a Chinese-form urban sketching brush",
      caption: "Feng Short, a Chinese-form brush made for line-and-wash on location."
    },
    collectionHref: "/collections/chinese-watercolor-brushes",
    collectionLabel: "Chinese watercolor brushes",
    productSlugs: ["feng-short-sketch-brush", "sicon-art-qin-brush", "chi-ling-travel-brush", "sicon-art-flat-brush-series"],
    relatedSlugs: ["choose-brush-urban-sketching", "choose-brush-large-watercolor-washes"],
    sections: [
      {
        id: "two-forms",
        heading: "Two forms, two ways of loading",
        paragraphs: [
          "When painters say Chinese brush or Western watercolor brush, they are usually talking about how the hair is shaped and how the handle is built. A Chinese-form brush has a longer hair bundle that tapers to a point. Load it, and the belly holds water while the tip still writes a line. That is why one brush can carry a street sketch from wash to outline.",
          "A Western-form watercolor brush is typically a metal ferrule on a lacquered handle, sold in numbered sizes. You pick a round or a flat for a known width. The system is precise. It is also a kit of several brushes if you want both a wash and a thin line on the same page.",
          "This page compares those forms. It is not a score table of named Western brands. We have not published head-to-head studio tests against another maker."
        ]
      },
      {
        id: "urban-sketching-marks",
        heading: "What urban sketching asks of a brush",
        paragraphs: [
          "On a sketchwalk the page is small, the time is short, and the water is whatever you carried. The useful question is: can this one tip lay a wall of tone and still draw a window bar?",
          "Feng Short is the Chinese-form brush we make for that job. Qin is a short wood-handle Chinese watercolor brush with goat, hemp, and synthetic hair, a 3 cm tip, and a 15 cm handle — a studio and line-and-wash tool with the same Chinese-form idea, used at a desk rather than in a pocket.",
          "Chi Ling is the compact travel version of that Chinese-form idea: a protected tip in a kit, still loaded from a pan, still able to wash and line. Which travel brush to pack for which street job lives in the urban sketching guide. This page is only about form."
        ],
        figure: {
          src: "/products/sicon-art-qin-brush/gallery/close-up.jpg",
          alt: "Sicon Art Qin Brush, a short wood-handle Chinese watercolor brush",
          caption: "Qin, a Chinese-form short handle for line-and-wash at the desk."
        }
      },
      {
        id: "when-western-form-helps",
        heading: "When a numbered Western form helps",
        paragraphs: [
          "If you already think in numbered rounds and flats, keep that language. A flat is a different mark: a straight edge, a graded wash, a building facade. We make that form as the Sicon Art Flat Brush Series in sizes #3, #5, and #7.",
          "Choose a numbered flat when the page needs a ruled edge more than a pointed Chinese tip. Choose a Chinese-form brush when one tool has to move from sky to lettering without a swap.",
          "Neither form is a quality rank. Pack the form that matches the marks you actually paint."
        ]
      }
    ]
  },
  {
    slug: "travel-watercolor-brush-under-20",
    title: "Choosing a travel watercolor brush under $20",
    description:
      "Live Sicon Art travel watercolor brushes priced under $20 USD before shipping, with a clear budget basis and what that price does not include.",
    dek: "Under $20 here means the public USD price of the brush on this website, before shipping.",
    answer:
      "The cards below are travel-handle Sicon Art brushes whose current public retail price is under $20 USD, before shipping. The list follows the live shop. If a market price moves to $20 or above, that brush leaves this page. Shipping, duties, and local taxes are extra.",
    publishedAt: "2026-10-18",
    author: "Tina Wang",
    hero: {
      src: "/products/chi-ling-travel-brush/gallery/close-up in nice background.jpg",
      alt: "Chi Ling Travel Brush, a compact handmade travel watercolor brush",
      caption: "Chi Ling, often the accessible end of our travel handles."
    },
    collectionHref: "/collections/travel-watercolor-brushes",
    collectionLabel: "All travel watercolor brushes",
    productSlugs: [],
    productSelect: "under-20-travel",
    relatedSlugs: ["t3-vs-chi-ling-travel-brush", "chinese-watercolor-brush-prices"],
    sections: [
      {
        id: "what-under-20-means",
        heading: "What under $20 means on this site",
        paragraphs: [
          "The $20 figure is the public retail price of one travel watercolor brush, in US dollars, on siconart.com. It is the brush itself. It is not a delivered total, a set price, or a worldwide average.",
          "Checkout adds shipping for countries with a published rate. If your country is not listed, send a message and we quote delivery. Duties and local taxes are not in the catalog number.",
          "The cards at the end of this page read the same live prices as the shop. When a list-page market price changes, this filter follows it."
        ]
      },
      {
        id: "what-this-budget-buys",
        heading: "What this budget buys",
        paragraphs: [
          "A travel watercolor brush under $20 is a compact handmade handle that lives in a kit. You are paying for a protected tip and a brush you will actually carry, not for a master studio form or a limited edition.",
          "Chi Ling, T3, Happiness, and the T10 pair often sit in this band. T7, T8, and T9 sit above it. T1 Soulmate is a limited sketchbook travel brush and sits well above $20.",
          "This page does not choose the street job for you. The urban sketching guide does that. It also does not explain travel versus short-handle construction. That is a separate guide. Here the only filter is the live USD price of a travel handle."
        ],
        figure: {
          src: "/products/happiness-short-travel-brush/feature.jpg",
          alt: "Happiness Short Travel Brush, a bamboo travel watercolor brush",
          caption: "Happiness, a bamboo travel handle that often sits in this price band."
        }
      },
      {
        id: "what-this-budget-does-not-buy",
        heading: "What this budget does not buy",
        paragraphs: [
          "It does not buy a long-handle studio wash brush. Yun Tao and the Song series are a different job and a different price.",
          "It does not include shipping. A brush at $12 plus delivery can total more than $20 at the door.",
          "If no travel brush is currently under $20, the cards below stay empty and we point you to the full travel collection. That empty state is honest inventory, not a missing page."
        ]
      }
    ]
  },
  {
    slug: "natural-hair-synthetic-brush-blends",
    title: "Natural hair and blended watercolor brushes: when the mix is the point",
    description:
      "Verified Sicon Art hair compositions: black weasel mix, horse and synthetic, goat hemp and synthetic, and published collector blends.",
    dek: "We publish a hair mix only when we have it. A blend is a working recipe, not a quality rank.",
    answer:
      "A blended watercolor brush mixes natural hair with other fibres so water holding, point, and rebound work together. T3 uses a black weasel hair mix. Happiness uses horse and synthetic. Qin uses goat, hemp, and synthetic. Some collector brushes publish exact percentages and are Coming soon until we set a retail price. We do not infer species quality from a mix.",
    publishedAt: "2026-10-18",
    author: "Tina Wang",
    hero: {
      src: "/products/travel-series-brush-t3/gallery/hair-detail.jpg",
      alt: "Hair detail of the T3 travel watercolor brush",
      caption: "T3 hair: a published black weasel mix on a pocket travel brush."
    },
    collectionHref: "/shop",
    collectionLabel: "Shop handmade brushes",
    productSlugs: ["travel-series-brush-t3", "happiness-short-travel-brush", "sicon-art-qin-brush"],
    relatedSlugs: ["handmade-chinese-watercolor-brush-value", "t3-vs-chi-ling-travel-brush"],
    sections: [
      {
        id: "what-a-blend-is-for",
        heading: "What a blend is for",
        paragraphs: [
          "Hair is not decoration. Natural hair holds water and tapers. Synthetic fibre adds spring and keeps a point through repeated wetting. Hemp in a Chinese mix adds structure. A blend is how those jobs share one tip.",
          "We write the mix on the product when we have a verified composition. If a brush page has no Hair line, the mix is not published. This guide does not guess it."
        ]
      },
      {
        id: "priced-brushes-with-published-hair",
        heading: "Priced brushes with published hair",
        paragraphs: [
          "T3 is a black weasel hair mix on a 1.7 cm tip. That is a natural-hair mix. We have not published a percentage split for T3.",
          "Happiness is a horse and synthetic hair mix on a 2.5 cm tip, with a bamboo travel handle and a cap. The synthetic share is why the point recovers after a wet sketchbook page.",
          "Qin is goat, hemp, and synthetic on a 3 cm tip and a 15 cm wood handle. Goat for flow, hemp for body, synthetic for the return of the point. It is a desk brush, not a pocket travel tool."
        ],
        figure: {
          src: "/products/sicon-art-qin-brush/gallery/close-up.jpg",
          alt: "Qin brush tip showing the goat, hemp, and synthetic mix",
          caption: "Qin, a published goat, hemp, and synthetic mix."
        }
      },
      {
        id: "collector-blends",
        heading: "Collector blends without a retail price yet",
        paragraphs: [
          "Some limited brushes publish exact percentages: Xiangfei Scroll is 80% goat and 20% synthetic. Embroidered Prosperity Deer is 50% rabbit, 40% fox, and 10% synthetic. Those pages are Coming soon. They have no retail price, and they cannot go in the cart.",
          "A published percentage is still not a lifespan claim. Choose a priced mix when you want to paint now. Open a Coming soon page when you want to read the recipe and wait for the price."
        ]
      }
    ]
  },
  {
    slug: "t3-vs-chi-ling-travel-brush",
    title: "T3 vs Chi Ling: compare Sicon Art travel brushes",
    description:
      "Side-by-side Sicon Art T3 and Chi Ling travel watercolor brushes, with published T3 measurements and unpublished Chi Ling fields marked clearly.",
    dek: "Two travel handles from the same workshop. Only T3 has published lengths, hair, cap, and engraving terms.",
    answer:
      "T3 is a pocket travel brush with a 1.7 cm tip, 0.5 cm shaft, 13 cm handle, black weasel hair mix, metal sections, a protective cap, and custom engraving by enquiry. Chi Ling is our compact travel watercolor brush for sketchbook painting and plein air. Chi Ling tip length, shaft diameter, handle length, hair mix, and cap are not published. Choose T3 when you want those measured specs and a cap. Choose Chi Ling when you want the compact sketchbook travel form we make for walking days.",
    publishedAt: "2026-10-18",
    author: "Tina Wang",
    hero: {
      src: "/products/travel-series-brush-t3/gallery/close-up.jpg",
      alt: "Close-up of the Sicon Art T3 travel watercolor brush",
      caption: "T3, the pocket travel brush with published measurements and a cap."
    },
    collectionHref: "/collections/travel-watercolor-brushes",
    collectionLabel: "Travel watercolor brushes",
    productSlugs: ["travel-series-brush-t3", "chi-ling-travel-brush"],
    relatedSlugs: ["travel-vs-short-handle-watercolor-brush", "travel-watercolor-brush-under-20"],
    sections: [
      {
        id: "same-workshop-two-jobs",
        heading: "Same workshop, two travel jobs",
        paragraphs: [
          "T3 and Chi Ling are both handmade Sicon Art travel watercolor brushes. They are not the same brush under two names.",
          "T3 is the pocket tool: a short measured tip, a metal travel barrel, a cap, and engraving by enquiry if you want words on the handle. Chi Ling is the compact sketchbook travel brush we pack for urban sketching and plein air when the day is walking and painting in short bursts.",
          "Live USD prices sit on the product cards below. This page compares construction. The under-$20 guide filters by price. The travel versus short-handle guide explains why a travel handle exists at all."
        ]
      },
      {
        id: "published-versus-unpublished",
        heading: "Published facts versus unpublished fields",
        paragraphs: [
          "The table uses only what we publish on each product. T3 has tip length, shaft diameter, handle length, hair, handle material, cap, and engraving. Chi Ling has a travel handle and a job: sketchbook watercolor away from the studio. Where Chi Ling has no published number, the cell reads Not published.",
          "Not published means we have not released the measurement. It does not mean the brush lacks a tip, a handle, or hair."
        ],
        figure: {
          src: "/products/chi-ling-travel-brush/gallery/close-up in nice background.jpg",
          alt: "Chi Ling Travel Brush in a still-life setting",
          caption: "Chi Ling, a compact travel brush for sketchbook watercolor."
        },
        table: {
          caption: "Sicon Art product facts. Chi Ling fields without a published measurement are marked Not published.",
          headers: ["Fact", "T3 (SA-05)", "Chi Ling (SA-14)"],
          rows: [
            ["Form", "Pocket travel watercolor brush", "Compact travel watercolor brush"],
            ["Tip length", "1.7 cm", "Not published"],
            ["Shaft diameter", "0.5 cm", "Not published"],
            ["Handle length", "13 cm", "Not published"],
            ["Hair", "Black weasel hair mix", "Not published"],
            ["Handle", "Metal sections on a travel barrel", "Travel handle"],
            ["Protective cap", "Yes", "Not published"],
            ["Custom engraving", "Available by enquiry", "Not offered on this product"]
          ]
        }
      },
      {
        id: "how-to-choose",
        heading: "How to choose one",
        paragraphs: [
          "Take T3 when the kit is a pocket or a tight pouch and you want a cap plus the published sizes. Write to us if you want the handle engraved; there is no extra published USD amount on the product.",
          "Take Chi Ling when the kit is a sketchbook bag and you want the compact travel form we make for plein air and urban sketching.",
          "If you need a bamboo travel handle with a published horse and synthetic mix, that is Happiness, a third brush, not a T3 or Chi Ling alias."
        ]
      }
    ]
  },
  {
    slug: "choose-brush-large-watercolor-washes",
    title: "Which Chinese brush to choose for larger watercolor washes",
    description:
      "Choose a Sicon Art studio brush for larger watercolor washes: Yun Tao Large Heavy, Tai Chi Yin, and the Song series.",
    dek: "A large wash needs a long handle and a generous tip. A travel brush is a different job.",
    answer:
      "For larger watercolor washes in the studio, start with Yun Tao Large Heavy, the brush we name for heavy washes and a long handle. Tai Chi Yin is the black-hair master brush for expressive studio washes. Golden Bamboo Song sits further into collector studio work. Travel brushes and street sketching brushes are not this job.",
    publishedAt: "2026-10-18",
    author: "Tina Wang",
    hero: {
      src: "/products/yun-tao-large-heavy-brush/feature.jpg",
      alt: "Yun Tao Large Heavy Brush, a long-handle master watercolor brush",
      caption: "Yun Tao Large Heavy, made for generous studio washes."
    },
    collectionHref: "/shop",
    collectionLabel: "Shop studio brushes",
    productSlugs: ["yun-tao-large-heavy-brush", "tai-chi-yin-brush", "golden-bamboo-song"],
    relatedSlugs: ["chinese-vs-western-watercolor-brush", "handmade-chinese-watercolor-brush-value"],
    sections: [
      {
        id: "what-a-large-wash-needs",
        heading: "What a larger wash needs",
        paragraphs: [
          "A larger wash is a sheet of paper, a loaded tip, and a long handle so your hand stays out of the wet. The brush has to hold enough water to cross the page without starving halfway.",
          "That is studio work. It is not the same job as a pocket travel brush on a sketchbook spread. Pack Yun Tao when the page is large. Pack Chi Ling or T3 when the page is a book in a bag.",
          "We do not treat Skyward Dragon as a large-wash demonstration. That brush is Coming soon, with no retail price and no published wash proof on this site."
        ]
      },
      {
        id: "yun-tao",
        heading: "Yun Tao Large Heavy",
        paragraphs: [
          "Yun Tao is the Sicon Art brush named for large, heavy studio work. It is a long-handle master watercolor brush with a soft feel. Use it for generous washes, broader passages, and the kind of studio painting that needs a full load.",
          "If you came here from a travel-brush page, this is the step up in form: longer handle, heavier wash, desk not pocket."
        ],
        figure: {
          src: "/brand/classic-brushes.webp",
          alt: "Handmade Sicon Art Chinese watercolor brushes including studio forms",
          caption: "Studio and travel forms from the same Dongguan workshop."
        }
      },
      {
        id: "expressive-studio",
        heading: "Expressive studio brushes beside Yun Tao",
        paragraphs: [
          "Tai Chi Yin is a black-hair master brush for expressive studio watercolor. It holds water generously and keeps enough spring for washes and detail. Choose it when the page needs a darker, more calligraphic load rather than Yun Tao’s heavy wash character.",
          "Golden Bamboo Song is a long-handle master brush with a golden bamboo form. It sits at the high end of the shop because of that making. A higher price is the cost of the form, not a score for a better painting.",
          "Open each product for the live USD price. Coming soon brushes have no price and cannot be added to the cart."
        ]
      }
    ]
  },
  {
    slug: "travel-brush-vs-water-brush",
    title: "Travel watercolor brush vs water brush: which should you buy",
    description:
      "A travel watercolor brush is a dip brush with a protected tip. A water brush stores water in a reservoir. Sicon Art makes travel watercolor brushes, not water brushes.",
    dek: "They look portable. They load in opposite ways.",
    answer:
      "A water brush has a plastic reservoir in the handle and squeezes water into the hair. A travel watercolor brush is a dip brush: you load it from a pan or a cup, and a travel handle or cap protects the tip in a bag. Sicon Art makes travel watercolor brushes. We do not sell water brushes. Buy a water brush if you cannot carry water. Buy a Sicon Art travel brush if you want a real load and a handmade point on the road.",
    publishedAt: "2026-10-18",
    author: "Tina Wang",
    hero: {
      src: "/products/bamboo-and-linen-brush-roll-10-brush-holder/feature.jpg",
      alt: "Bamboo and linen brush roll for carrying handmade travel watercolor brushes",
      caption: "A roll for dip brushes with protected tips, not reservoir water brushes."
    },
    collectionHref: "/collections/travel-watercolor-brushes",
    collectionLabel: "Travel watercolor brushes",
    productSlugs: [
      "travel-series-brush-t3",
      "happiness-short-travel-brush",
      "chi-ling-travel-brush",
      "bamboo-and-linen-brush-roll-10-brush-holder"
    ],
    relatedSlugs: ["travel-vs-short-handle-watercolor-brush", "choose-brush-urban-sketching"],
    sections: [
      {
        id: "two-different-tools",
        heading: "Two different tools",
        paragraphs: [
          "A water brush is a hollow handle filled with water. You squeeze the barrel and the hair wets from the inside. Most water brushes use synthetic hair and a plastic body. They are useful when you cannot carry a bottle or a cup.",
          "A travel watercolor brush is a dip brush with a compact handle. You wet it from a pan, a tin, or a water cup, the way you would at a desk. The travel parts exist to protect the tip between sketches. T3 and Happiness include a protective cap. Chi Ling uses a compact travel handle for the same job.",
          "Sicon Art does not sell water brushes. If a listing calls our T3, Happiness, or Chi Ling a water brush, that label is wrong."
        ]
      },
      {
        id: "what-each-does-on-the-road",
        heading: "What each does on the road",
        paragraphs: [
          "Take a water brush when the whole kit has to be one tool and a pan, with no extra water. The mark is the squeeze plus the synthetic tip. You trade load and point for that convenience.",
          "Take a Sicon Art travel brush when you can carry a little water and you want the load of handmade hair. T3 is the pocket dip brush with a cap. Happiness is the bamboo travel dip brush with a horse and synthetic mix. Chi Ling is the compact sketchbook travel dip brush.",
          "The bamboo and linen roll holds up to ten dip brushes. It is a carrier, not a reservoir."
        ],
        figure: {
          src: "/products/travel-series-brush-t3/gallery/close-up.jpg",
          alt: "T3 travel watercolor brush, a dip brush with a protective cap",
          caption: "T3: a dip brush that closes in a kit, not a squeeze reservoir."
        }
      },
      {
        id: "how-to-choose",
        heading: "How to choose",
        paragraphs: [
          "If you already own a water brush and like it, keep it for days with no cup. Add a Sicon Art travel brush for days when you want a handmade point and a full load from the pan.",
          "If you are buying the first portable brush from us, you are buying a travel watercolor brush. Construction details live in the travel versus short-handle guide. Street jobs live in the urban sketching guide."
        ]
      }
    ]
  },
  {
    slug: "handmade-chinese-watercolor-brush-value",
    title: "Are handmade Chinese watercolor brushes worth paying more for",
    description:
      "What you pay for in a handmade Sicon Art Chinese watercolor brush: Dongguan workshop making, hair setting, and handle finishing, without a lifespan guarantee.",
    dek: "The extra cost is the making. It is not a promise of how many years the brush will last.",
    answer:
      "A handmade Sicon Art brush costs more than a machine-made commodity brush because we select hair, set the tip, and finish the handle by hand in Dongguan. That making is what the public retail price buys. We do not publish a lifespan or a performance guarantee. Coming soon brushes have no retail price until we set one.",
    publishedAt: "2026-10-18",
    author: "Tina Wang",
    hero: {
      src: "/brand/brush-making.jpg",
      alt: "Natural hair and bamboo prepared by hand in the Sicon Art workshop",
      caption: "Hair and handles prepared by hand in our Dongguan workshop."
    },
    collectionHref: "/about",
    collectionLabel: "About the workshop",
    productSlugs: ["pink-youth-glow-brush", "travel-series-brush-t3", "yun-tao-large-heavy-brush"],
    relatedSlugs: ["chinese-watercolor-brush-prices", "natural-hair-synthetic-brush-blends"],
    sections: [
      {
        id: "what-handmade-means-here",
        heading: "What handmade means in our workshop",
        paragraphs: [
          "Sicon Art is a workshop in Dongguan. We make traditional Chinese brushes for watercolor and urban sketching. Handmade here means a person selects the hair, ties and sets the tip, fits the handle, and inspects the point before the brush leaves us.",
          "That is slower than a fully machine-made brush. It is also why two brushes in the same line can show small natural differences in bamboo, wood, or hair. Those differences are the making, not defects we hide."
        ],
        figure: {
          src: "/brand/experience-craft-1.jpg",
          alt: "Brush making in the Sicon Art workshop",
          caption: "Setting hair and handles by hand."
        }
      },
      {
        id: "what-the-price-pays-for",
        heading: "What the price pays for",
        paragraphs: [
          "The public USD price on a product page is the brush. It pays for the hair, the handle, the making, and the inspection. It does not pay for shipping. It does not buy a numbered Western size chart. It does not buy a written number of years of use.",
          "Entry Chinese-style brushes such as Pink Youth Glow sit at the accessible end because the form is simpler. A travel handle such as T3 costs more because of the travel construction. Yun Tao costs more because it is a large long-handle studio brush. The prices guide is where those bands live. This page is why a handmade brush is not a commodity price.",
          "A higher price is the cost of that form and making. It is not a score that the painting will be better."
        ]
      },
      {
        id: "what-we-do-not-promise",
        heading: "What we do not promise",
        paragraphs: [
          "We do not publish a lifespan. How long a brush lasts depends on water, paint, paper, and how it is washed and dried. Care notes sit on the product pages.",
          "We do not publish a laboratory ranking against other makers. If a brush is Coming soon, it has no retail price. You can read the making. You cannot add it to the cart until we publish a number.",
          "If the question is only “what does this brush cost today?”, use the prices guide and the live product cards. If the question is “what am I paying the workshop for?”, this page is the answer."
        ],
        figure: {
          src: "/brand/experience-craft-3.jpg",
          alt: "Finished handmade Sicon Art brushes in the workshop",
          caption: "Finished brushes after hand inspection."
        }
      }
    ]
  }
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
