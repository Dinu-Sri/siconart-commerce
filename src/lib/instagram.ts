import fs from "node:fs";
import path from "node:path";
import { INSTAGRAM_HIGHLIGHT_URL, INSTAGRAM_PROFILE_URL } from "@/data/instagram";

const IMAGE_EXTENSIONS = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm"]);
const PUBLIC_DIR = path.join(process.cwd(), "public");
const SHORTCODE_PATTERN = /^[A-Za-z0-9_-]{8,15}$/;

export type InstagramMediaKind = "image" | "video";

export type InstagramItem = {
  alt: string;
  href: string;
  kind: InstagramMediaKind;
  poster?: string;
  src: string;
};

function listMedia(dir: string) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, "en"));
}

function publicUrl(folder: "feed" | "highlights", fileName: string) {
  return `/instagram/${folder}/${fileName}`;
}

function permalinkFor(fileName: string) {
  const shortcode = path.parse(fileName).name;
  return SHORTCODE_PATTERN.test(shortcode) ? `https://www.instagram.com/p/${shortcode}/` : INSTAGRAM_PROFILE_URL;
}

function toItems(folder: "feed" | "highlights", files: string[], alt: string, hrefFor: (fileName: string) => string): InstagramItem[] {
  const images = new Map(
    files.filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase())).map((name) => [path.parse(name).name, name])
  );
  const items: InstagramItem[] = [];

  for (const fileName of files) {
    const ext = path.extname(fileName).toLowerCase();
    const base = path.parse(fileName).name;
    if (VIDEO_EXTENSIONS.has(ext)) {
      const posterName = images.get(base);
      items.push({
        alt,
        href: hrefFor(fileName),
        kind: "video",
        poster: posterName ? publicUrl(folder, posterName) : undefined,
        src: publicUrl(folder, fileName)
      });
      continue;
    }
    if (IMAGE_EXTENSIONS.has(ext) && !files.some((name) => path.parse(name).name === base && VIDEO_EXTENSIONS.has(path.extname(name).toLowerCase()))) {
      items.push({
        alt,
        href: hrefFor(fileName),
        kind: "image",
        src: publicUrl(folder, fileName)
      });
    }
  }

  return items;
}

export function getInstagramHighlights(limit = 12): InstagramItem[] {
  const files = listMedia(path.join(PUBLIC_DIR, "instagram", "highlights"));
  return toItems("highlights", files, "Artist using a Sicon Art brush", () => INSTAGRAM_HIGHLIGHT_URL).slice(0, limit);
}

export function getInstagramFeedItems(limit = 16): InstagramItem[] {
  const files = listMedia(path.join(PUBLIC_DIR, "instagram", "feed"));
  return toItems("feed", files, "Sicon Art on Instagram", permalinkFor)
    .sort((left, right) => right.src.localeCompare(left.src, "en"))
    .slice(0, limit);
}

export function getArtistStories(limit = 8): InstagramItem[] {
  const highlights = getInstagramHighlights(limit);
  if (highlights.length > 0) return highlights;
  return getInstagramFeedItems(limit);
}
