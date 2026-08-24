import fs from "node:fs";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);
const PUBLIC_DIR = path.join(process.cwd(), "public");

function isImageFile(name: string) {
  return IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()) && !name.startsWith(".");
}

function publicUrl(absolutePath: string) {
  return `/${path.relative(PUBLIC_DIR, absolutePath).replaceAll("\\", "/")}`;
}

function listImages(dir: string) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isImageFile(entry.name))
    .map((entry) => path.join(dir, entry.name))
    .sort((left, right) => left.localeCompare(right, "en"));
}

function unique(urls: Array<string | undefined>) {
  return [...new Set(urls.filter((url): url is string => Boolean(url)))];
}

export function resolveProductImages(product: { slug: string; images: string[] }) {
  const dir = path.join(PUBLIC_DIR, "products", product.slug);
  const rootImages = listImages(dir);
  const featureFile = rootImages.find((file) => path.parse(file).name.toLowerCase() === "feature");
  const galleryFiles = [
    ...rootImages.filter((file) => path.parse(file).name.toLowerCase() !== "feature"),
    ...listImages(path.join(dir, "gallery"))
  ];

  const featureUrl = featureFile ? publicUrl(featureFile) : product.images[0];
  const galleryUrls = galleryFiles.map(publicUrl);
  const fallbackGallery = featureFile ? [] : product.images.slice(1);

  return unique([featureUrl, ...galleryUrls, ...fallbackGallery]);
}

export function withProductImages<T extends { slug: string; images: string[] }>(product: T): T {
  return { ...product, images: resolveProductImages(product) };
}

function isDetailsImage(url: string) {
  const name = url.split("/").pop()?.toLowerCase() ?? "";
  return /detail|details|spec|close-?up|hair/.test(name);
}

export function pickCardThumbnail(images: string[]) {
  const feature = images[0];
  const lifestyle = images.slice(1).filter((url) => !isDetailsImage(url));
  return lifestyle[0] ?? feature ?? "";
}
