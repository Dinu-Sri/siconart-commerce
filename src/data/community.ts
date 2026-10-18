export type Ambassador = {
  slug: string;
  name: string;
  role: string;
  location: string;
  status: "current";
  relationship: string;
  excerpt: string;
  biography: string[];
  portrait: { src: string; alt: string; width: number; height: number };
  eventSlugs: string[];
  productSlugs: string[];
};

export const ambassadors: Ambassador[] = [
  {
    slug: "sanjeewee",
    name: "Sanjeewee Senevirathna",
    role: "Brand ambassador",
    location: "Sri Lanka",
    status: "current",
    relationship: "Sicon Art’s first brand ambassador",
    excerpt:
      "Sri Lankan master artist and Sicon Art’s first brand ambassador. He paints with our handmade Chinese watercolor brushes, including the T1 Soulmate Limited Travel Brush.",
    biography: [
      "Sanjeewee Senevirathna is a Sri Lankan master artist and Sicon Art’s first brand ambassador.",
      "On 7 October 2026 he presented a mini exhibition and live demonstration with students of the Academy of Sicon Art at SiconArt Gallery in Dongguan Zhangmutou.",
      "He paints with our T1 Soulmate Limited Travel Brush, a compact handmade brush for sketchbook watercolor and travel painting."
    ],
    portrait: {
      src: "/media/ambassadors/sanjeewee/gallery-poster.jpg",
      alt: "Poster for Sanjeewee Senevirathna’s mini exhibition and live demonstration at SiconArt Gallery",
      width: 1080,
      height: 1080
    },
    eventSlugs: ["sanjeewee-gallery-demo-2026"],
    productSlugs: ["t1-soulmate-limited-travel-brush"]
  }
];

export function getAmbassador(slug: string) {
  return ambassadors.find((ambassador) => ambassador.slug === slug) ?? null;
}
