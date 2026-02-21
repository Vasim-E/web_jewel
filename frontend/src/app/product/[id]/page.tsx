import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ProductDetailsClient from './ProductDetailsClient';

async function getProduct(id: string) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
        if (!res.ok) return undefined;
        return res.json();
    } catch (error) {
        // Fallback mock
        return {
            _id: id,
            name: 'Sample Product',
            description: 'This is a sample product description.',
            price: 99.99,
            stock: 5,
            images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908'],
            category: 'Earrings',
            featured: false,
        }
    }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="bg-background min-h-screen pt-28 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/shop" className="inline-flex items-center text-gray-400 hover:text-primary mb-8 transition-colors text-xs uppercase tracking-widest group">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Collection
                </Link>
                <ProductDetailsClient product={product} />
            </div>
        </div>
    );
}
