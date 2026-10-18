import { getStorefrontProducts } from "@/lib/commerce/live-prices";
import { isPurchasable, type Product } from "@/data/products";
import { absoluteUrl } from "@/lib/site-origin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function imageUrl(product: Product, extra?: string) {
  const src = extra || product.images[0];
  if (!src) return "";
  return src.startsWith("http") ? src : absoluteUrl(src);
}

function itemXml(id: string, title: string, product: Product, priceCents: number, link: string, image: string) {
  return `  <item>
    <g:id>${xmlEscape(id)}</g:id>
    <g:title>${xmlEscape(title)}</g:title>
    <g:description>${xmlEscape(product.description)}</g:description>
    <g:link>${xmlEscape(link)}</g:link>
    <g:image_link>${xmlEscape(image)}</g:image_link>
    <g:availability>in stock</g:availability>
    <g:price>${(priceCents / 100).toFixed(2)} USD</g:price>
    <g:brand>Sicon Art</g:brand>
    <g:condition>new</g:condition>
    <g:identifier_exists>no</g:identifier_exists>
  </item>`;
}

export async function GET() {
  const products = await getStorefrontProducts();
  const items: string[] = [];

  for (const product of products) {
    if (!isPurchasable(product)) continue;
    const url = absoluteUrl(`/products/${product.slug}`);
    const variants = product.variants ?? [];
    if (variants.length > 0) {
      for (const variant of variants) {
        if (variant.priceCents <= 0) continue;
        items.push(
          itemXml(
            variant.sku,
            `${product.name} ${variant.name}`,
            product,
            variant.priceCents,
            `${url}?variant=${encodeURIComponent(variant.sku)}`,
            imageUrl(product, variant.image)
          )
        );
      }
      continue;
    }
    if (product.priceCents <= 0) continue;
    items.push(itemXml(product.sku, product.name, product, product.priceCents, url, imageUrl(product)));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Sicon Art products</title>
    <link>${xmlEscape(absoluteUrl("/"))}</link>
    <description>Public retail watercolor brushes from Sicon Art.</description>
${items.join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow"
    }
  });
}
