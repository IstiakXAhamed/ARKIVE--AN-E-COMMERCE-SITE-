import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";
import { getProductBySlug, getRelatedProducts } from "@/lib/db/products";
import { generateProductJsonLd, generateBreadcrumbJsonLd, baseUrl } from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const images = product.images?.map((img) => img.url) || [];

  return {
    title: `${product.name} | ARKIVE`,
    description: product.metaDescription || product.shortDesc || product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.metaDescription || product.shortDesc || "",
      url: `${baseUrl}/product/${product.slug}`,
      images: images.length > 0 ? [{ url: images[0] }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.metaDescription || product.shortDesc || "",
      images: images.length > 0 ? [images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categorySlug, product.slug);
  const jsonLd = generateProductJsonLd(product);
  const breadcrumbLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    { name: product.name, url: `/product/${product.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
