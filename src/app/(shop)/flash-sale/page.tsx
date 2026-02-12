import { FlashSale } from "@/components/store/FlashSale";
import { demoProducts } from "@/lib/data";

export default function FlashSalePage() {
  return (
    <>
      <FlashSale products={demoProducts} />

      {/* All Sale Products */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            All Sale Items
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {demoProducts
              .filter((p) => p.badge === "sale" || p.badge === "flash")
              .map((product) => {
                const discount = product.originalPrice
                  ? Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )
                  : 0;

                return (
                  <a
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 md:top-3 md:left-3 px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-semibold bg-red-500 text-white rounded-md md:rounded-lg">
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400">
                        {product.category}
                      </span>
                      <h3 className="font-semibold text-gray-800 mt-0.5 text-sm md:text-base line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-sm md:text-lg font-bold text-emerald-500">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs md:text-sm text-gray-400 line-through">
                            ৳{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
          </div>
        </div>
      </section>
    </>
  );
}
