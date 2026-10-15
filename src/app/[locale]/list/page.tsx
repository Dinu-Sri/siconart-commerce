import { priceListProducts } from "@/data/price-list-products";
import { getPriceListOverrides } from "@/lib/commerce/live-prices";
import { ProductPriceList } from "@/components/storefront/product-price-list";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ListPage() {
  const listOverrides = await getPriceListOverrides();
  return <ProductPriceList products={priceListProducts} listOverrides={listOverrides} />;
}
