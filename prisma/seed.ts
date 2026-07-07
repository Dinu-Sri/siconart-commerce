import { PrismaClient } from "@prisma/client";
import { products } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
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
}

async function upsertProduct(product: (typeof products)[number]) {
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

function productData(product: (typeof products)[number]) {
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

function legacySlug(slug: string, id: string) {
  return `${slug}-legacy-${id.slice(0, 8)}`;
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
