import { PrismaClient } from "@prisma/client";
import { products } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
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
      },
      create: {
        sku: product.sku,
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
      }
    });

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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
