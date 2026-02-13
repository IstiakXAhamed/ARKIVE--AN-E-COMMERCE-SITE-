import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";
import { getProductBySlug, getRelatedProducts } from "@/lib/db/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categorySlug, product.slug);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
