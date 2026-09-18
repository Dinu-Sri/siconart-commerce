import fs from "node:fs";
import path from "node:path";
import { priceListProducts } from "../src/data/price-list-products";
import {
  generatePriceCatalogPdf,
  getPriceCatalogFilename,
  type PriceCatalogKind
} from "../src/lib/price-list/catalog-pdf";

const allowedKinds = new Set<PriceCatalogKind>(["market", "artist", "mini", "bulk"]);
const kind = (process.argv[2] ?? "market") as PriceCatalogKind;

if (!allowedKinds.has(kind)) {
  throw new Error(`Unknown catalog kind "${kind}". Use market, artist, mini, or bulk.`);
}

async function main() {
  const outDir = path.join(process.cwd(), "output", "pdf");
  fs.mkdirSync(outDir, { recursive: true });

  const pdf = await generatePriceCatalogPdf({
    kind,
    products: priceListProducts
  });
  const filename = getPriceCatalogFilename(kind);
  const outPath = path.join(outDir, filename);
  fs.writeFileSync(outPath, pdf);

  console.log(`Wrote ${outPath} (${pdf.length} bytes)`);
}

void main();
