'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../types';
import { Search as SearchIcon } from 'lucide-react';

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const keyword = searchParams.get('q') || '';

    const [searchTerm, setSearchTerm] = useState(keyword);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!keyword) {
                setProducts([]);
                return;
            }

            setLoading(true);
            try {
                // In a real app, use the API URL from environment variables
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${API_URL}/products?keyword=${keyword}`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="bg-background min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-serif text-foreground mb-12 text-center">Search Results</h1>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-16">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for jewelry..."
                            className="w-full bg-white border border-secondary text-foreground py-4 pl-6 pr-14 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 bg-primary text-white p-2 rounded-full hover:bg-primary-hover transition-colors"
                        >
                            <SearchIcon size={20} />
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {products.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-xl text-gray-500 mb-4 font-serif">No products found for "{keyword}"</p>
                                <p className="text-gray-400">Try checking your spelling or use different keywords.</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-gray-500 mb-8 uppercase tracking-widest text-center">Found {products.length} result{products.length !== 1 ? 's' : ''}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="bg-background min-h-screen pt-32 pb-20 px-4 flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
            <SearchContent />
        </Suspense>
    );
}
