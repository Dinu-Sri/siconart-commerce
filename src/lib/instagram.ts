import fs from "node:fs";
import path from "node:path";
import { INSTAGRAM_HIGHLIGHT_URL, INSTAGRAM_PROFILE_URL } from "@/data/instagram";

const IMAGE_EXTENSIONS = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm"]);
const PUBLIC_DIR = path.join(process.cwd(), "public");
const HIGHLIGHTS_DIR = path.join(PUBLIC_DIR, "instagram", "highlights");

export type InstagramMediaKind = "image" | "video";

export type InstagramItem = {
  alt: string;
  href: string;
  kind: InstagramMediaKind;
  poster?: string;
  src: string;
};

function publicUrl(absolutePath: string) {
  return `/${path.relative(PUBLIC_DIR, absolutePath).replaceAll("\\", "/")}`;
}

function findHighlightFolder(hints: string[]) {
  if (!fs.existsSync(HIGHLIGHTS_DIR)) return null;

  const dirs = fs.readdirSync(HIGHLIGHTS_DIR, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  const found = dirs.find((entry) => {
    const name = entry.name.toLowerCase();
    return hints.every((hint) => name.includes(hint));
  });

  return found ? path.join(HIGHLIGHTS_DIR, found.name) : null;
}

function listMedia(dir: string) {
  if (!dir || !fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
    .map((entry) => path.join(dir, entry.name))
    .sort((left, right) => left.localeCompare(right, "en"));
}

function toItems(files: string[], alt: string, href: string): InstagramItem[] {
  const images = new Map(
    files
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .map((file) => [path.parse(file).name, file])
  );
  const items: InstagramItem[] = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const base = path.parse(file).name;
    if (VIDEO_EXTENSIONS.has(ext)) {
      const posterFile = images.get(base);
      items.push({
        alt,
        href,
        kind: "video",
        poster: posterFile ? publicUrl(posterFile) : undefined,
        src: publicUrl(file)
      });
      continue;
    }
    if (
      IMAGE_EXTENSIONS.has(ext) &&
      !files.some((other) => path.parse(other).name === base && VIDEO_EXTENSIONS.has(path.extname(other).toLowerCase()))
    ) {
      items.push({
        alt,
        href,
        kind: "image",
        src: publicUrl(file)
      });
    }
  }

  return items;
}

export function getArtistWorksHighlights(limit = 12): InstagramItem[] {
  const dir = findHighlightFolder(["artist"]);
  return toItems(listMedia(dir ?? ""), "Artist work made with a Sicon Art brush", INSTAGRAM_HIGHLIGHT_URL).slice(0, limit);
}

export function getInternationalDemoHighlights(limit = 12): InstagramItem[] {
  const dir = findHighlightFolder(["international"]);
  return toItems(listMedia(dir ?? ""), "Sicon Art international demonstration", INSTAGRAM_PROFILE_URL).slice(0, limit);
}
