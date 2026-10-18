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
      "Sicon Art joined the 5th International Watercolor Exhibition in Vietnam as a co-sponsor, with founder Tina Wang giving a live watercolor demonstration on 19 September 2026.",
    body: [
      "Saigon Aquarelle 2026, titled Vibrant Colours, ran from 19 to 28 September 2026 at Contemporary Art Space with the HCMC Fine Arts Association, 01 Einstein, Thu Duc, Ho Chi Minh City.",
      "Sicon Art appears among the co-sponsors on the exhibition poster. Founder Tina Wang gave a live watercolor demonstration on 19 September 2026 from 11:00 to 12:30 at the same venue, listed on the official demonstration schedule with other invited artists.",
      "This page records Sicon Art’s participation. It is not an upcoming ticketed event and does not claim Urban Sketchers affiliation, attendance counts, or sales figures."
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
      "SiconArt Gallery hosted a mini exhibition and live demonstration with brand ambassador Sanjeewee Senevirathna and students of the Academy of Sicon Art.",
    body: [
      "On 7 October 2026 from 09:00 to 12:00, SiconArt Gallery in Dongguan Zhangmutou presented a mini exhibition and live demonstration with Sri Lankan master artist Sanjeewee Senevirathna, Sicon Art’s first brand ambassador.",
      "The session was held with students of the Academy of Sicon Art. This record is based on the gallery’s published poster. Additional demonstration photographs will be added when they are cleared for the website."
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
  }
];

export function getEvent(slug: string) {
  return events.find((event) => event.slug === slug) ?? null;
}
