const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function loadProducts() {
  const source = fs.readFileSync(path.join(__dirname, "../src/data/products.ts"), "utf8");
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

async function main() {
  const products = loadProducts();
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
