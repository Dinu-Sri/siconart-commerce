const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function loadProducts() {
  const source = fs.readFileSync(path.join(__dirname, "../src/data/products.ts"), "utf8").replaceAll("\r\n", "\n");
  const startToken = "export const products: Product[] = ";
  const endToken = ";\n\nexport const categories";
  const start = source.indexOf(startToken);
  const end = source.indexOf(endToken);

  if (start === -1 || end === -1) {
    throw new Error("Could not find products array in src/data/products.ts");
  }

  const arraySource = source.slice(start + startToken.length, end);
  return Function(`"use strict"; return (${arraySource});`)();
}

const IMAGE_EXTENSIONS = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);

function isImageFile(name) {
  return IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()) && !name.startsWith(".");
}

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isImageFile(entry.name))
    .map((entry) => path.join(dir, entry.name))
    .sort((left, right) => left.localeCompare(right, "en"));
}

function publicUrl(absolutePath) {
  return `/${path.relative(path.join(__dirname, "../public"), absolutePath).replaceAll("\\", "/")}`;
}

function resolveProductImages(product) {
  const folders = product.imageFolders?.length ? product.imageFolders : [product.slug];
  const urls = [];
  for (const folder of folders) {
    const dir = path.join(__dirname, "../public/products", folder);
    const rootImages = listImages(dir);
    const featureFile = rootImages.find((file) => path.parse(file).name.toLowerCase() === "feature");
    if (featureFile) urls.push(publicUrl(featureFile));
    for (const file of rootImages.filter((item) => path.parse(item).name.toLowerCase() !== "feature")) {
      urls.push(publicUrl(file));
    }
    for (const file of listImages(path.join(dir, "gallery"))) urls.push(publicUrl(file));
  }
  if (!urls.length && product.images?.[0]) urls.push(product.images[0]);
  return [...new Set(urls)];
}

async function main() {
  const products = loadProducts().map((product) => ({ ...product, images: resolveProductImages(product) }));
  const categoryNames = Array.from(new Set(products.map((product) => product.category)));

  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { name, active: true },
      create: {
        name,
        slug: slugify(name),
        description: `${name} from the Sicon Art brush collection.`
      }
    });
  }

  const variantSkus = products.flatMap((product) => (product.variants ?? []).map((variant) => variant.sku));
  if (variantSkus.length) {
    const retired = await prisma.product.findMany({ where: { sku: { in: variantSkus } } });
    for (const row of retired) {
      await prisma.product.update({
        where: { id: row.id },
        data: { slug: legacySlug(row.slug, row.id), status: "ARCHIVED" }
      });
    }
  }

  for (const product of products) {
    await upsertProduct(product);

    const dbProduct = await prisma.product.findUniqueOrThrow({
      where: { sku: product.sku }
    });

    for (const variant of product.variants ?? []) {
      await prisma.productVariant.upsert({
        where: { sku: variant.sku },
        update: {
          name: variant.name,
          priceCents: variant.priceCents,
          image: variant.image,
          productId: dbProduct.id
        },
        create: {
          sku: variant.sku,
          name: variant.name,
          priceCents: variant.priceCents,
          image: variant.image,
          productId: dbProduct.id
        }
      });
    }
  }

  await prisma.discountCode.upsert({
    where: { code: "WELCOME10" },
    update: {
      type: "percent",
      value: 10,
      minSubtotalCents: 10000,
      active: true
    },
    create: {
      code: "WELCOME10",
      type: "percent",
      value: 10,
      minSubtotalCents: 10000,
      active: true
    }
  });
}

async function upsertProduct(product) {
  const data = productData(product);
  const existingBySku = await prisma.product.findUnique({ where: { sku: product.sku } });

  if (existingBySku) {
    const slugOwner = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (slugOwner && slugOwner.id !== existingBySku.id) {
      await prisma.product.update({
        where: { id: slugOwner.id },
        data: { slug: legacySlug(slugOwner.slug, slugOwner.id), status: "ARCHIVED" }
      });
    }

    await prisma.product.update({ where: { id: existingBySku.id }, data });
    return;
  }

  const existingBySlug = await prisma.product.findUnique({ where: { slug: product.slug } });
  if (existingBySlug) {
    await prisma.product.update({
      where: { id: existingBySlug.id },
      data: {
        sku: product.sku,
        ...data
      }
    });
    return;
  }

  await prisma.product.create({
    data: {
      sku: product.sku,
      ...data
    }
  });
}

function productData(product) {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    summary: product.summary,
    description: product.description,
    priceCents: product.priceCents,
    currency: product.currency,
    images: product.images,
    uses: product.uses,
    handle: product.handle,
    feel: product.feel,
    level: product.level,
    featured: product.featured ?? false,
    specs: product.specs
  };
}

function legacySlug(slug, id) {
  return `${slug}-legacy-${id.slice(0, 8)}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
