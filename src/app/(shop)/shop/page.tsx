import { ShopClient } from "./ShopClient";
import { getProducts } from "@/lib/db/products";
import { getCategoriesWithCounts } from "@/lib/db/categories";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategoriesWithCounts(),
  ]);

  return <ShopClient products={products} categories={categories} />;
}
