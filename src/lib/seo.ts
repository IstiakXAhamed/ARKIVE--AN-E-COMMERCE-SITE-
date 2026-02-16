import { Product, SiteSetting } from "@prisma/client";

export const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://arkive.com.bd";

// Generate Product JSON-LD
export function generateProductJsonLd(product: any) {
  const images = product.images?.map((img: any) => img.url) || [];
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images,
    description: product.description || product.shortDesc,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "ARKIVE",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: "BDT",
      price: product.price,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      itemCondition: "https://schema.org/NewCondition",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "ARKIVE",
      },
    },
  };
}

// Generate Breadcrumb JSON-LD
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

// Generate Organization JSON-LD
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ARKIVE",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      "https://facebook.com/ARKIVE",
      "https://instagram.com/arkive_shop_bd",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+880 1339-705214",
      contactType: "customer service",
      areaServed: "BD",
      availableLanguage: "en",
    },
  };
}
