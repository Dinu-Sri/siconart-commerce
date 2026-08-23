import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const productsFile = path.join(root, "src", "data", "products.ts");
const publicProductsDir = path.join(root, "public", "products");
const photoSetDir = path.join(root, "reference", "elementor-system", "PRODUCTS PHOTO SET");

const IMAGE_EXTENSIONS = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);

function loadProducts() {
  const source = fs.readFileSync(productsFile, "utf8");
  const normalized = source.replaceAll("\r\n", "\n");
  const startToken = "export const products: Product[] = ";
  const endToken = ";\n\nexport const categories";
  const start = normalized.indexOf(startToken);
  const end = normalized.indexOf(endToken);
  if (start === -1 || end === -1) {
    throw new Error("Could not find products array in src/data/products.ts");
  }
  return {
    source,
    products: Function(`"use strict"; return (${normalized.slice(start + startToken.length, end)});`)()
  };
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyIfMissing(from, to) {
  if (!from || !fs.existsSync(from) || fs.existsSync(to)) return false;
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
  return true;
}

function writeGitkeep(dir) {
  const gitkeep = path.join(dir, ".gitkeep");
  if (!fs.existsSync(gitkeep)) fs.writeFileSync(gitkeep, "");
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()));
}

function normalizeName(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function findPhotoSet(matchers) {
  const files = listFiles(photoSetDir);
  const found = files.find((name) => {
    const lower = normalizeName(name);
    return matchers.every((part) => lower.includes(normalizeName(part)));
  });
  return found ? path.join(photoSetDir, found) : null;
}

const rootGalleryCopies = [
  ["chi-ling-travel-thumb.jpg", ["chi-ling-travel-brush"], "close-up.jpg"],
  ["dark-green-short-thumb.jpg", ["dark-green-short-wood-brush"], "close-up.jpg"],
  ["feng-short-sketch-thumb.jpg", ["feng-short-sketch-brush"], "close-up.jpg"],
  ["happiness-travel-feature.jpg", [], null],
  ["long-handle-l5-thumb.jpg", ["sandalwood-handle-brush-series-l5-s", "sandalwood-handle-brush-series-l5-m", "sandalwood-handle-brush-series-l5-l"], "close-up.jpg"],
  ["qin-brush-thumb.jpg", ["sicon-art-qin-brush"], "close-up.jpg"],
  ["qing-yao-detail-thumb.jpg", ["qing-yao-detail-brush"], "close-up.jpg"],
  ["run-hao-short-thumb.jpg", ["run-hao-short-brush"], "close-up.jpg"],
  ["ruyue-short-thumb.jpg", ["ruyue-short-brush"], "close-up.jpg"],
  ["short-handle-s1-thumb.jpg", ["short-handle-series-s1"], "close-up.jpg"],
  ["tai-chi-group-thumb.jpg", ["tai-chi-group-brush-yin-yang-pair-set"], "close-up.jpg"],
  ["tai-chi-yang.jpg", ["tai-chi-group-brush-yin-yang-pair-set"], "yang.jpg"],
  ["tai-chi-yin.jpg", ["tai-chi-group-brush-yin-yang-pair-set"], "yin.jpg"],
  ["travel-series-t3-thumb.jpg", ["travel-series-brush-t3"], "close-up.jpg"],
  ["flat-series-thumb.jpg", ["sicon-art-flat-brush-series-3", "sicon-art-flat-brush-series-5", "sicon-art-flat-brush-series-7"], "close-up.jpg"]
];

const photoSetGallery = [
  { slug: "chi-ling-travel-brush", match: ["ling", "thumbnail", "(2)"], name: "hair-detail.jpg" },
  { slug: "feng-short-sketch-brush", match: ["feng", "sketch", "(2)"], name: "hair-detail.jpg" },
  { slug: "sicon-art-flat-brush-series-3", match: ["flat brush", "thumbnail", "(2)"], name: "series-detail.jpg" },
  { slug: "sicon-art-flat-brush-series-5", match: ["flat brush", "thumbnail", "(2)"], name: "series-detail.jpg" },
  { slug: "sicon-art-flat-brush-series-7", match: ["flat brush", "thumbnail", "(2)"], name: "series-detail.jpg" },
  { slug: "qing-yao-detail-brush", match: ["qing", "thumbnail", "(2)"], name: "hair-detail.jpg" },
  { slug: "run-hao-short-brush", match: ["run", "thumbnail", "(2)"], name: "hair-detail.jpg" },
  { slug: "ruyue-short-brush", match: ["ruyue", "thumbnail", "(2)"], name: "hair-detail.jpg" },
  { slug: "short-handle-series-s1", match: ["short handle", "(2)"], name: "hair-detail.jpg" },
  { slug: "sicon-art-qin-brush", match: ["qin", "thumbnail", "(2)"], name: "hair-detail.jpg" },
  { slug: "travel-series-brush-t3", match: ["t3", "thumbnail", "(2)"], name: "hair-detail.jpg" }
];

const { source, products } = loadProducts();
let nextSource = source;
const created = [];
const copiedFeature = [];
const copiedGallery = [];

for (const product of products) {
  const galleryDir = path.join(publicProductsDir, product.slug, "gallery");
  ensureDir(galleryDir);
  writeGitkeep(galleryDir);

  const currentImage = product.images[0];
  if (!currentImage) continue;

  const currentAbs = path.join(root, "public", currentImage.replace(/^\//, "").replaceAll("/", path.sep));
  const featureName = `feature${path.extname(currentAbs).toLowerCase() || ".jpg"}`;
  const featureAbs = path.join(publicProductsDir, product.slug, featureName);
  const featureUrl = `/products/${product.slug}/${featureName}`;

  if (copyIfMissing(currentAbs, featureAbs) || fs.existsSync(featureAbs)) {
    copiedFeature.push(product.slug);
  }

  const oldNeedle = `images: ["${currentImage}"]`;
  const newNeedle = `images: ["${featureUrl}"]`;
  if (currentImage !== featureUrl && nextSource.includes(oldNeedle)) {
    nextSource = nextSource.replace(oldNeedle, newNeedle);
  }

  created.push(product.slug);
}

for (const [fileName, slugs, destName] of rootGalleryCopies) {
  if (!destName) continue;
  const from = path.join(publicProductsDir, fileName);
  for (const slug of slugs) {
    const to = path.join(publicProductsDir, slug, "gallery", destName);
    if (copyIfMissing(from, to)) copiedGallery.push(`${slug}/${destName}`);
  }
}

for (const item of photoSetGallery) {
  const from = findPhotoSet(item.match);
  const to = path.join(publicProductsDir, item.slug, "gallery", item.name);
  if (copyIfMissing(from, to)) copiedGallery.push(`${item.slug}/${item.name}`);
}

if (nextSource !== source) {
  fs.writeFileSync(productsFile, nextSource);
}

console.log(`Folders ready: ${created.length}`);
console.log(`Feature images present: ${copiedFeature.length}`);
console.log(`Gallery images copied: ${copiedGallery.length}`);
if (copiedGallery.length) {
  for (const item of copiedGallery) console.log(`  + ${item}`);
}
