export type EventRecord = {
  slug: string;
  title: string;
  status: "past";
  relationship: string;
  dates: string;
  place: string;
  summary: string;
  body: string[];
  images: Array<{ src: string; alt: string; width: number; height: number }>;
  ambassadorSlugs: string[];
  productSlugs: string[];
};

export const events: EventRecord[] = [
  {
    slug: "saigon-aquarelle-2026",
    title: "Sicon Art at Saigon Aquarelle 2026",
    status: "past",
    relationship: "Co-sponsor and live demonstration",
    dates: "19–28 September 2026; Tina Wang demonstration 19 September 2026, 11:00–12:30",
    place: "Contemporary Art Space, 1 Einstein, Thu Duc, Ho Chi Minh City, Vietnam",
    summary:
      "We co-sponsored Saigon Aquarelle 2026 in Ho Chi Minh City, and founder Tina Wang gave a live watercolor demonstration on 19 September.",
    body: [
      "Saigon Aquarelle 2026, Vibrant Colours, ran from 19 to 28 September 2026 at Contemporary Art Space with the HCMC Fine Arts Association, 01 Einstein, Thu Duc, Ho Chi Minh City.",
      "Sicon Art co-sponsored the exhibition. Founder Tina Wang gave a live watercolor demonstration on 19 September 2026 from 11:00 to 12:30 at the same venue, alongside other invited artists on the demonstration schedule.",
      "We met painters at the Sicon Art booth throughout the exhibition and showed handmade Chinese watercolor brushes made for travel, sketching, and studio work."
    ],
    images: [
      {
        src: "/media/events/saigon-aquarelle-2026/exhibition-poster.jpg",
        alt: "Saigon Aquarelle 2026 exhibition poster with venue dates and supporting organization logos",
        width: 1080,
        height: 1350
      },
      {
        src: "/media/events/saigon-aquarelle-2026/tina-demo-poster.jpg",
        alt: "Poster for Tina Wang’s live watercolor demonstration in Ho Chi Minh City on 19 September 2026",
        width: 1080,
        height: 1080
      },
      {
        src: "/media/events/saigon-aquarelle-2026/demo-schedule.jpg",
        alt: "Saigon Aquarelle demonstration schedule listing Tina Wang among the artists on 19 September 2026",
        width: 1080,
        height: 1350
      },
      {
        src: "/media/events/saigon-aquarelle-2026/tina-at-booth.jpg",
        alt: "Tina Wang showing brushes to visitors at the Sicon Art exhibition booth",
        width: 443,
        height: 590
      }
    ],
    ambassadorSlugs: [],
    productSlugs: []
  },
  {
    slug: "sanjeewee-gallery-demo-2026",
    title: "Sanjeewee at SiconArt Gallery",
    status: "past",
    relationship: "Gallery mini exhibition and academy demonstration",
    dates: "7 October 2026, 09:00–12:00",
    place: "SiconArt Gallery, Dongguan Zhangmutou, China",
    summary:
      "We hosted a mini exhibition and live demonstration with brand ambassador Sanjeewee Senevirathna and students of the Academy of Sicon Art.",
    body: [
      "On 7 October 2026 from 09:00 to 12:00, SiconArt Gallery in Dongguan Zhangmutou presented a mini exhibition and live demonstration with Sri Lankan master artist Sanjeewee Senevirathna, Sicon Art’s first brand ambassador.",
      "Students of the Academy of Sicon Art joined the morning session, painting with handmade Chinese watercolor brushes in the gallery."
    ],
    images: [
      {
        src: "/media/events/sanjeewee-gallery-demo-2026/poster.jpg",
        alt: "SiconArt Gallery poster announcing Sanjeewee Senevirathna’s mini exhibition and live demonstration on 7 October 2026",
        width: 1080,
        height: 1080
      }
    ],
    ambassadorSlugs: ["sanjeewee"],
    productSlugs: ["t1-soulmate-limited-travel-brush"]
  },
  {
    slug: "greater-bay-area-urban-sketching",
    title: "Greater Bay Area Urban Sketching Annual Meeting 2026",
    status: "past",
    relationship: "Supporting brand",
    dates: "3–5 October 2026",
    place: "Sanshui, Greater Bay Area, China",
    summary:
      "We supported the Greater Bay Area Urban Sketching Annual Meeting 2026 in Sanshui, and founder Tina Wang joined the gathering.",
    body: [
      "The Greater Bay Area Urban Sketching Annual Meeting 2026 ran from 3 to 5 October 2026 in Sanshui. Sicon Art supported the meeting, and the organisers thanked us with an official certificate.",
      "Founder Tina Wang attended. Handmade Chinese watercolor brushes from our Dongguan workshop were part of the gathering for urban sketchers painting on location."
    ],
    images: [
      {
        src: "/media/events/greater-bay-area-urban-sketching/certificate.jpg",
        alt: "Thank-you certificate from the Greater Bay Area Urban Sketching Annual Meeting 2026 naming Sicon Art",
        width: 509,
        height: 720
      },
      {
        src: "/media/events/greater-bay-area-urban-sketching/tina-at-backdrop.jpg",
        alt: "Tina Wang standing before the urban sketching event sponsor backdrop",
        width: 443,
        height: 590
      }
    ],
    ambassadorSlugs: [],
    productSlugs: []
  },
  {
    slug: "giresun-watercolor-festival-2026",
    title: "Giresun International Watercolor Festival 2026",
    status: "past",
    relationship: "Official fine art materials partner",
    dates: "9–12 May 2026",
    place: "Giresun, Turkey",
    summary:
      "We were an official fine art materials partner of the Giresun International Watercolor Festival 2026 in Turkey.",
    body: [
      "The Giresun International Watercolor Festival ran from 9 to 12 May 2026 in Giresun, Turkey. Sicon Art was an official fine art materials partner for the edition.",
      "We thank festival coordinator Adem Velioglu and consultant Yasar Birinci, and the painters who worked with handmade Chinese watercolor brushes during the festival."
    ],
    images: [
      {
        src: "/media/events/giresun-watercolor-festival-2026/poster.jpg",
        alt: "Giresun International Watercolor Festival 2026 thank-you poster naming Sicon Art as official fine art materials partner",
        width: 509,
        height: 720
      }
    ],
    ambassadorSlugs: [],
    productSlugs: []
  }
];

export function getEvent(slug: string) {
  return events.find((event) => event.slug === slug) ?? null;
}
