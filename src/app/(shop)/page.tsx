import { HeroSection } from "@/components/store/HeroSection";
import { CategoryGrid } from "@/components/store/CategoryGrid";
import { ProductGrid } from "@/components/store/ProductGrid";
import { FlashSale } from "@/components/store/FlashSale";
import { demoProducts, categories } from "@/lib/data";

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Fatima Rahman",
      location: "Dhaka",
      text: "Amazing quality jewelry! The earrings exceeded my expectations.",
      rating: 5,
    },
    {
      name: "Karim Ahmed",
      location: "Chittagong",
      text: "Beautiful packaging and super fast delivery. Highly recommended!",
      rating: 5,
    },
    {
      name: "Nadia Islam",
      location: "Sylhet",
      text: "Perfect couple rings for our engagement. Thank you ARKIVE!",
      rating: 5,
    },
  ];

  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Customer Reviews
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            Trusted by thousands of happy customers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm"
            >
              <div className="flex gap-0.5 mb-3 md:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-sm md:text-base">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold text-sm md:text-base">
                    {testimonial.name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-xs md:text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-400 text-[10px] md:text-xs">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const featuredProducts = demoProducts
    .filter((p) => p.badge === "new" || p.badge === "sale")
    .slice(0, 8);

  return (
    <>
      <HeroSection />

      <CategoryGrid categories={categories} />

      <FlashSale products={demoProducts} />

      <ProductGrid
        products={featuredProducts}
        title="Featured Products"
        subtitle="Handpicked selections just for you"
      />

      <div className="bg-gray-50">
        <ProductGrid
          products={demoProducts}
          title="New Arrivals"
          subtitle="The latest additions to our collection"
        />
      </div>

      <TestimonialsSection />
    </>
  );
}
