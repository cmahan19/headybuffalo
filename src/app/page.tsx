import React from "react";

// Import components
// import ProductCarousel from "@/app/components/ProductCarousel";
// import CategorySection from "@/app/components/CategorySection";
import FeaturedProducts from "@/app/components/FeaturedProducts";

// Home page for an eCommerce store
const HomePage: React.FC = () => {
  return (
    <div className="bg-white text-gray-900">
      {/* Main Hero Section */}
      <section
        className="relative h-[200px] sm:h-[300px] bg-cover bg-center"
        style={{ backgroundImage: `url('/heroBanner.webp')` }}
      ></section>

      {/* <div className="text-center px-4 py-6">
        <h1 className="text-xl sm:text-3xl font-bold text-black">Heady Buffalo</h1>
        <p className="text-sm sm:text-lg mt-2 text-black">
          Eco-Friendly Products that Give Back
        </p>
        <p className="text-sm sm:text-lg mt-1 text-black">
          Organic Essentials You'll Love
        </p>
        <button className="mt-4 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary-dark">
          Shop Now
        </button>
      </div> */}

      {/* Featured Products */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center">
            Featured Products
          </h2>
          <FeaturedProducts />
        </div>
      </section>

      {/* Product Categories */}
      {/* <section className="bg-gray-100 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center">
            Shop by Category
          </h2>
          <CategorySection />
        </div>
      </section> */}

      {/* Product Carousel - Popular Products */}
      {/* <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center">
            Popular Products
          </h2>
          <ProductCarousel />
        </div>
      </section> */}
    </div>
  );
};

export default HomePage;
