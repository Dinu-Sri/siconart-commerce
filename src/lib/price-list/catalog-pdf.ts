import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import type { PriceListProduct } from "@/data/price-list-products";

export type PriceCatalogKind = "artist" | "mini" | "bulk";

export type PriceCatalogValues = Record<
  string,
  Partial<{
    retail: number;
    artist: number;
    miniWholesale: number;
    miniWholesaleMoq: number;
    bulkWholesale: number;
    bulkWholesaleMoq: number;
  }>
>;

type CatalogTheme = {
  accent: string;
  cardBorder: string;
  dark: string;
  filename: string;
  lightBg: string;
  moqField: "miniWholesaleMoq" | "bulkWholesaleMoq" | null;
  priceField: "artist" | "miniWholesale" | "bulkWholesale";
  priceLabel: string;
  rightLines: [string, string];
  subtle: string;
  title: string;
};

const catalogThemes: Record<PriceCatalogKind, CatalogTheme> = {
  artist: {
    accent: "#9b5a35",
    cardBorder: "#ead8c4",
    dark: "#1f1a16",
    filename: "SiconArt_Artist_Price_Catalog.pdf",
    lightBg: "#fdf7ef",
    moqField: null,
    priceField: "artist",
    priceLabel: "Artist Price",
    rightLines: ["Artist partner pricing", "Market price shown for reference."],
    subtle: "#806c5b",
    title: "Artist Price Catalog"
  },
  mini: {
    accent: "#2f7d4f",
    cardBorder: "#d8eadc",
    dark: "#102016",
    filename: "SiconArt_MINI_Wholesale_Catalog.pdf",
    lightBg: "#f1fbf4",
    moqField: "miniWholesaleMoq",
    priceField: "miniWholesale",
    priceLabel: "Mini Wholesale",
    rightLines: ["Mini minimums shown per product", "Packing & shipping calculated separately."],
    subtle: "#68786c",
    title: "Mini Wholesale Price Catalog"
  },
  bulk: {
    accent: "#a56f24",
    cardBorder: "#eadfbd",
    dark: "#2f2118",
    filename: "SiconArt_Bulk_Wholesale_Catalog.pdf",
    lightBg: "#fff7dd",
    moqField: "bulkWholesaleMoq",
    priceField: "bulkWholesale",
    priceLabel: "Bulk Wholesale",
    rightLines: ["Bulk minimums shown per product", "Packing & shipping calculated separately."],
    subtle: "#806c5b",
    title: "Bulk Wholesale Price Catalog"
  }
};

const familyOrder = [
  ["SA-19-S", "SA-19-L"],
  ["SA-13-A", "SA-13-B"],
  ["SA-20-E", "SA-20-ST"],
  ["SA-24", "SA-25", "SA-15"],
  ["SA-11#3", "SA-11#5", "SA-11#7"],
  ["SA-32-S", "SA-32-M", "SA-32-L"],
  ["SA-35-S", "SA-35-M", "SA-35-L"]
];
const familySkus = new Set(familyOrder.flat());
const accessorySkus = new Set(["SA-ACC-01", "SA-ACC-02"]);

const pageWidth = 595.28;
const pageHeight = 841.89;
const margin = 34;
const gap = 11;
const columns = 3;
const rows = 3;
const headerHeight = 62;
const footerHeight = 45;
const cardWidth = (pageWidth - margin * 2 - gap * (columns - 1)) / columns;
const cardHeight = (pageHeight - margin * 2 - headerHeight - footerHeight - gap * (rows - 1)) / rows;

export function getPriceCatalogFilename(kind: PriceCatalogKind) {
  return catalogThemes[kind].filename;
}

export async function generatePriceCatalogPdf({
  kind,
  products,
  values
}: {
  kind: PriceCatalogKind;
  products: PriceListProduct[];
  values?: PriceCatalogValues;
}) {
  const theme = catalogThemes[kind];
  const doc = new PDFDocument({ size: "A4", margin: 0, info: { Title: theme.title, Author: "Sicon Art" } });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const finished = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  registerFonts(doc);
  drawPages(doc, theme, buildCatalogItems(products, values));
  doc.end();

  return finished;
}

function buildCatalogItems(products: PriceListProduct[], values: PriceCatalogValues = {}) {
  const bySku = new Map(products.map((product) => [product.sku, product]));
  const orderedSkus = [
    ...familyOrder.flat(),
    ...products.filter((product) => !familySkus.has(product.sku) && !accessorySkus.has(product.sku)).map((product) => product.sku),
    ...products.filter((product) => accessorySkus.has(product.sku)).map((product) => product.sku)
  ];

  return orderedSkus
    .map((sku) => bySku.get(sku))
    .filter((product): product is PriceListProduct => Boolean(product))
    .map((product) => {
      const current = values[product.sku] ?? {};
      return {
        bulkWholesale: asNumber(current.bulkWholesale, product.bulkWholesaleCents),
        bulkWholesaleMoq: asNumber(current.bulkWholesaleMoq, product.bulkWholesaleMoq),
        imagePath: resolvePublicAsset(product.image),
        market: asNumber(current.retail, product.retailCents),
        artist: asNumber(current.artist, product.artistCents),
        miniWholesale: asNumber(current.miniWholesale, product.miniWholesaleCents),
        miniWholesaleMoq: asNumber(current.miniWholesaleMoq, product.miniWholesaleMoq),
        name: cleanName(product.name),
        sku: product.sku
      };
    });
}

function drawPages(
  doc: PDFKit.PDFDocument,
  theme: CatalogTheme,
  items: ReturnType<typeof buildCatalogItems>
) {
  let pageIndex = 0;

  for (let start = 0; start < items.length; start += columns * rows) {
    if (start > 0) doc.addPage({ size: "A4", margin: 0 });
    pageIndex += 1;

    doc.rect(0, 0, pageWidth, pageHeight).fill("#fffaf1");
    drawHeader(doc, theme);

    items.slice(start, start + columns * rows).forEach((item, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = margin + col * (cardWidth + gap);
      const y = margin + headerHeight + row * (cardHeight + gap);
      drawCard(doc, theme, item, x, y);
    });

    drawFooter(doc, theme, pageIndex, Math.ceil(items.length / (columns * rows)));
  }
}

function drawHeader(doc: PDFKit.PDFDocument, theme: CatalogTheme) {
  const logoPath = path.join(process.cwd(), "public", "brand", "siconart-logo-pdf.jpg");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, margin, margin - 3, { fit: [86, 34] });
  } else {
    doc.font("PoppinsBold").fontSize(13).fillColor(theme.dark).text("Sicon Art", margin, margin);
  }

  doc.font("PoppinsBold").fontSize(16).fillColor(theme.dark).text(theme.title, margin + 110, margin + 1, {
    width: 270
  });
  doc.font("Poppins").fontSize(7.5).fillColor(theme.subtle).text("Handcrafted Chinese brushes for watercolor artists", margin + 110, margin + 24, {
    width: 285
  });
  doc
    .font("PoppinsSemiBold")
    .fontSize(7.5)
    .fillColor(theme.subtle)
    .text(`Updated ${formatDate(new Date())}`, pageWidth - margin - 170, margin - 1, {
      align: "right",
      width: 170
    });
  doc.font("Poppins").fontSize(7.3).text(theme.rightLines.join("\n"), pageWidth - margin - 170, margin + 13, {
    align: "right",
    lineGap: 1.5,
    width: 170
  });
}

function drawCard(
  doc: PDFKit.PDFDocument,
  theme: CatalogTheme,
  item: ReturnType<typeof buildCatalogItems>[number],
  x: number,
  y: number
) {
  doc.roundedRect(x + 2, y + 3, cardWidth, cardHeight, 11).fill("#e7dccf");
  doc.roundedRect(x, y, cardWidth, cardHeight, 11).fillAndStroke("#fffdfa", theme.cardBorder);

  const imagePad = 8;
  const imageHeight = cardHeight * 0.47;
  doc.roundedRect(x + imagePad, y + imagePad, cardWidth - imagePad * 2, imageHeight, 9).fill("#ffffff");
  if (fs.existsSync(item.imagePath)) {
    doc.image(item.imagePath, x + imagePad + 7, y + imagePad + 7, {
      align: "center",
      fit: [cardWidth - imagePad * 2 - 14, imageHeight - 14],
      valign: "center"
    });
  }

  const titleY = y + imagePad + imageHeight + 7;
  doc.font("PoppinsBold").fontSize(9).fillColor(theme.dark).text(item.name, x + 11, titleY, {
    align: "center",
    lineGap: 0,
    width: cardWidth - 22
  });

  const priceY = y + cardHeight - 74;
  drawPriceBox(doc, theme, x + 10, priceY, cardWidth - 20, "Market", formatMoney(item.market), false);
  drawPriceBox(doc, theme, x + 10, priceY + 24, cardWidth - 20, theme.priceLabel, formatMoney(item[theme.priceField]), true);

  if (theme.moqField) {
    drawPriceBox(doc, theme, x + 10, priceY + 48, cardWidth - 20, "Min. Order", `${item[theme.moqField]} pcs`, false);
  }
}

function drawPriceBox(
  doc: PDFKit.PDFDocument,
  theme: CatalogTheme,
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
  highlight: boolean
) {
  doc.roundedRect(x, y, width, 18, 5).fill(highlight ? theme.lightBg : "#fbf1e6");
  doc.font("PoppinsSemiBold").fontSize(7.4).fillColor(theme.subtle).text(label, x + 7, y + 5, { width: width * 0.5 });
  doc
    .font("PoppinsBold")
    .fontSize(9)
    .fillColor(highlight ? theme.accent : theme.dark)
    .text(value, x + width * 0.42, y + 4.5, { align: "right", width: width * 0.52 });
}

function drawFooter(doc: PDFKit.PDFDocument, theme: CatalogTheme, pageIndex: number, pageCount: number) {
  const y = pageHeight - margin - footerHeight + 16;
  doc.moveTo(margin, y - 9).lineTo(pageWidth - margin, y - 9).strokeColor("#ead8c4").lineWidth(0.6).stroke();
  doc.font("Poppins").fontSize(7).fillColor(theme.subtle).text("www.siconart.com", margin, y, { width: 160 });
  doc
    .font("Poppins")
    .fontSize(7)
    .fillColor(theme.subtle)
    .text(`Page ${pageIndex} of ${pageCount}`, pageWidth - margin - 130, y, { align: "right", width: 130 });
}

function registerFonts(doc: PDFKit.PDFDocument) {
  const fontRoot = path.join(process.cwd(), "public", "fonts", "pdf");
  doc.registerFont("Poppins", path.join(fontRoot, "Poppins-Regular.ttf"));
  doc.registerFont("PoppinsSemiBold", path.join(fontRoot, "Poppins-SemiBold.ttf"));
  doc.registerFont("PoppinsBold", path.join(fontRoot, "Poppins-Bold.ttf"));
}

function resolvePublicAsset(publicPath: string) {
  return path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.round(value)) : fallback;
}

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function cleanName(name: string) {
  return name.replace(" ? (Ember)", " Ember").replace(" ? (Still)", " Still");
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
