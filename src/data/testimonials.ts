export type ArtistVoice = {
  slug: string;
  name: string;
  handle: string;
  quote: string;
  image: { src: string; alt: string; width: number; height: number };
};

export const artistVoices: ArtistVoice[] = [
  {
    slug: "irina-kulemina",
    name: "Irina Kulemina",
    handle: "irina_kulemina_art",
    quote: "Amazing brush.",
    image: {
      src: "/media/artists/irina-kulemina/frame.jpg",
      alt: "Watercolor landscape painted by Irina Kulemina with a Sicon Art brush",
      width: 720,
      height: 1280
    }
  },
  {
    slug: "lenas-art-corner",
    name: "Lena",
    handle: "lenas.art.corner",
    quote: "Thank you @tina.wang88 for the ideal brush for these lines.",
    image: {
      src: "/media/artists/lenas-art-corner/frame.jpg",
      alt: "Blue illustration by Lena painted with a Sicon Art brush",
      width: 720,
      height: 1280
    }
  },
  {
    slug: "pete-sirodom",
    name: "Pete Sirodom",
    handle: "Pete Sirodom",
    quote: "Your travel brush is amazing. I love it.",
    image: {
      src: "/media/artists/pete-sirodom/temple-studio.jpg",
      alt: "Pete Sirodom painting a temple scene in the studio with a Sicon Art travel brush",
      width: 720,
      height: 960
    }
  }
];
