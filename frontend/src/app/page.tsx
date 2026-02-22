export const dynamic = "force-dynamic";

import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import HeroSection from '../components/HeroSection';
import Marquee from '../components/Marquee';
import { ArrowRight } from 'lucide-react';

import api from '../lib/axios';

async function getFeaturedProducts() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    const products = await res.json();
    return products.filter((p: any) => p.featured);
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}

async function getCategories() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return [];
  }
}


export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories()
  ]);

  return (
    <div className="bg-background min-h-screen">
      <HeroSection />
      <Marquee />

      {/* Categories Section */}
      <section className="pt-12 pb-12 bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-primary text-xs uppercase tracking-[0.3em] block font-medium">Collections</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 perspective-1000">
            {categories.length > 0 ? categories.map((category: any) => (
              <div key={category._id || category.name} className="w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)] min-w-[260px] max-w-[320px]">
                <CategoryCard category={category} />
              </div>
            )) : (
              <div className="w-full text-center py-12 text-gray-500 font-serif">No categories found. Add some in the Admin panel!</div>
            )}
          </div>
        </div>
      </section >

      {/* Featured Products */}
      <section className="pt-12 pb-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-primary text-xs uppercase tracking-[0.3em] block font-medium">Selected For You</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {featuredProducts.length > 0 ? featuredProducts.map((product: any) => (
              <div key={product._id} className="w-full sm:w-[calc(50%-2rem)] lg:w-[calc(25%-2rem)] min-w-[280px] max-w-[350px]">
                <ProductCard product={product} />
              </div>
            )) : (
              <div className="w-full text-center py-12 text-gray-500 font-serif">No products selected yet.</div>
            )}
          </div>

          <div className="text-center mt-16">
            <Link href="/shop" className="inline-block text-foreground border-b border-primary pb-1 hover:text-primary transition-colors uppercase tracking-widest text-xs font-bold">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div >
  );
}
