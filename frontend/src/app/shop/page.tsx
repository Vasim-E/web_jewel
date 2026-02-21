import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../types';
import api from '../../lib/axios';

async function getProducts(category?: string) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        // In a real scenario, use absolute URL for server-side fetch or fetch from DB directly if in same repo
        // For now, let's use a mock or try to fetch if backend is up.
        // Since we are generating code, we'll assume the API is reachable or fallback to mock.
        // Use localhost for server fetch
        const res = await fetch(`${API_URL}/products${category ? `?category=${category}` : ''}`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error(error);
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
        console.error(error);
        return [];
    }
}

export default async function Shop({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category } = await searchParams;
    const [productsRaw, categoriesRaw] = await Promise.all([
        getProducts(category),
        getCategories()
    ]);

    let products: Product[] = productsRaw;

    // Fallback mock data if API fails (for demonstration)
    if (products.length === 0) {
        products = [
            {
                _id: '1',
                name: 'Diamond Stud Earrings',
                description: 'Elegant diamond stud earrings suitable for any occasion.',
                price: 899.99,
                stock: 10,
                images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
                category: 'Earrings',
                featured: true,
                createdAt: '',
                updatedAt: ''
            },
            // ... more mock data
        ];
        if (category) {
            products = products.filter(p => p.category === category);
        }
    }

    return (
        <div className="bg-background min-h-screen pt-20">
            {/* Header */}
            <div className="bg-secondary py-16 mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-primary text-xs uppercase tracking-[0.3em] block mb-3 font-medium">The Collection</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-foreground">Fine Jewelry</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Filters Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="sticky top-28 space-y-8">
                            <div>
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6 border-b border-secondary pb-2">Category</h3>
                                <div className="space-y-3">
                                    <Link href="/shop" className={`block text-sm transition-colors duration-300 ${!category ? 'text-primary pl-2 border-l-2 border-primary' : 'text-gray-500 hover:text-foreground'}`}>
                                        View All
                                    </Link>
                                    {categoriesRaw.map((cat: any) => (
                                        <Link
                                            key={cat._id || cat.name}
                                            href={`/shop?category=${cat.name}`}
                                            className={`block text-sm transition-colors duration-300 ${category === cat.name ? 'text-primary pl-2 border-l-2 border-primary' : 'text-gray-500 hover:text-foreground'}`}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                        {products.length === 0 && (
                            <div className="text-center py-20 bg-card-bg rounded-xl shadow-sm border border-secondary">
                                <p className="text-gray-500 font-light mb-4">No products found in this category.</p>
                                <Link href="/shop" className="inline-block text-primary hover:text-foreground transition-colors text-xs uppercase tracking-widest border-b border-primary pb-1 font-bold">clear filters</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
