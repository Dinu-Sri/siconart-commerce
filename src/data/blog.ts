export type BlogSection = {
  heading?: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  productSlugs: string[];
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "chinese-watercolor-brush-prices",
    title: "Chinese watercolor brush prices: what you pay at Sicon Art",
    description:
      "Current Sicon Art retail prices for handmade Chinese watercolor brushes, from compact travel brushes to master studio pieces.",
    publishedAt: "2026-10-18",
    author: "Tina Wang",
    productSlugs: [
      "chi-ling-travel-brush",
      "travel-series-brush-t3",
      "happiness-short-travel-brush",
      "feng-short-sketch-brush",
      "sicon-art-qin-brush",
      "t1-soulmate-limited-travel-brush",
      "tai-chi-yin-brush",
      "pink-youth-glow-brush",
      "ivory-flow-brush"
    ],
    sections: [
      {
        paragraphs: [
          "Sicon Art makes handmade Chinese watercolor brushes in Dongguan. The prices on this page are our current public retail prices in US dollars, before shipping. They update with the shop, so open a product if you are ready to buy.",
          "A brush price reflects hair mix, handle construction, size, and how much of the work is done by hand. A compact travel brush and a long-handle master brush are different tools. We do not treat a higher price as proof of a better painting."
        ]
      },
      {
        heading: "How we price a brush",
        paragraphs: [
          "Entry Chinese-style brushes such as Pink Youth Glow, Sapphire Jade, and Ivory Flow sit at the accessible end of the shop. They are short-handle handmade brushes for sketching, washes, and everyday studio work.",
          "Travel brushes such as Chi Ling, T3, and Happiness cost more because of the travel handle and, on T3 and Happiness, a protective cap. Master brushes such as Tai Chi Yin and the Song series cost more because of larger forms, longer handles, and more involved making.",
          "Coming soon brushes stay visible in the shop without a retail price. You cannot add them to the cart until we publish a price."
        ]
      },
      {
        heading: "What the price includes",
        paragraphs: [
          "The listed retail price is for the brush you see on the product page. Shipping is calculated at checkout for listed countries. If your country is not listed, send us a message and we will quote delivery.",
          "Custom handle engraving is available on the T3 by enquiry. Write to us with the wording you want. We confirm the details before making it.",
          "Use the live prices in the table below. They match the shop on the day you read this guide."
        ]
      }
    ]
  },
  {
    slug: "choose-brush-urban-sketching",
    title: "Which travel watercolor brush to choose for urban sketching",
    description:
      "Choose a Sicon Art travel or short-handle brush for urban sketching, sketchbooks, and painting on location.",
    publishedAt: "2026-10-18",
    author: "Tina Wang",
    productSlugs: [
      "travel-series-brush-t3",
      "chi-ling-travel-brush",
      "happiness-short-travel-brush",
      "t1-soulmate-limited-travel-brush",
      "feng-short-sketch-brush",
      "feng-hui-outline-brush",
      "red-tiny-brush"
    ],
    sections: [
      {
        paragraphs: [
          "Urban sketching asks a brush to work in a sketchbook, on a wall, and in a street scene without a full studio setup. We make travel and short-handle Chinese watercolor brushes for that kind of painting.",
          "Start from the job: line and small washes in a sketchbook, a protected tip in a bag, or a close-to-paper grip for fast marks. Then open the matching brush."
        ]
      },
      {
        heading: "Travel brushes for a kit",
        paragraphs: [
          "Chi Ling is a compact handmade travel brush for sketchbook watercolor and plein air. T3 is our pocket travel brush with a 1.7 cm tip, black weasel hair mix, metal travel sections, and a protective cap. Happiness is a bamboo travel brush with a horse and synthetic hair mix, a 2.5 cm tip, and a cap.",
          "If you want a limited travel brush for sketchbook painting, look at the T1 Soulmate Limited Travel Brush. Brand ambassador Sanjeewee Senevirathna paints with it."
        ]
      },
      {
        heading: "Short handles for speed on location",
        paragraphs: [
          "Feng Short Sketch Brush is made for urban sketching. The short handle sits close to the paper for line, small washes, and fast outdoor marks.",
          "For finishing lines, edges, lettering, and branches, use a detail brush. Feng Hui Outline comes in sizes S and L. Red Tiny is a fine-point brush for the last marks of a sketch."
        ]
      },
      {
        heading: "A simple way to choose",
        paragraphs: [
          "Pack T3 or Happiness when the brush has to live in a kit with a protected tip. Choose Feng Short when you want the handle close to the paper. Add Feng Hui or Red Tiny when the sketch needs a dedicated line.",
          "Current retail prices sit in the table below. They match the shop."
        ]
      }
    ]
  },
  {
    slug: "travel-vs-short-handle-watercolor-brush",
    title: "Travel or short handle: which watercolor brush belongs in your sketch kit",
    description:
      "Compare Sicon Art travel watercolor brushes and short-handle brushes so you can pack the right tool for sketching.",
    publishedAt: "2026-10-18",
    author: "Tina Wang",
    productSlugs: [
      "travel-series-brush-t3",
      "happiness-short-travel-brush",
      "chi-ling-travel-brush",
      "feng-short-sketch-brush",
      "sicon-art-qin-brush",
      "ruyue-short-brush",
      "shede-short-brush"
    ],
    sections: [
      {
        paragraphs: [
          "A travel watercolor brush and a short-handle brush do different jobs in a sketch kit. We make both in Dongguan, and the choice is about how you carry the brush and how close your hand sits to the paper."
        ]
      },
      {
        heading: "Travel handles",
        paragraphs: [
          "A Sicon Art travel brush uses a compact travel handle so the tip is protected in a bag. T3 and Happiness include a protective cap. T3 has a 1.7 cm tip and a 13 cm handle with black weasel hair mix. Happiness has a 2.5 cm tip, a 13 cm bamboo handle, and a horse and synthetic hair mix.",
          "Chi Ling is a handmade travel brush for urban sketching and sketchbook painting when you want a compact kit without a full studio."
        ]
      },
      {
        heading: "Short handles",
        paragraphs: [
          "A short handle sits close to the paper. That is useful for urban sketching, studies, and everyday painting at a table or on a wall. Feng Short is built for fast line-and-wash on location. Ruyue and Shede are short-handle brushes for daily practice and small-format work.",
          "Qin is a short-handle Chinese watercolor brush with goat, hemp, and synthetic hair, a 3 cm tip, and a 15 cm wood handle. It is a studio and line-and-wash brush rather than a pocket travel tool."
        ]
      },
      {
        heading: "Pack one of each if you can",
        paragraphs: [
          "If you carry one brush, choose travel when the tip needs protection in a bag, and short handle when you paint with the hand close to the page. Many sketchers pack a travel brush plus a short sketch brush.",
          "See live retail prices in the table below."
        ]
      }
    ]
  }
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
