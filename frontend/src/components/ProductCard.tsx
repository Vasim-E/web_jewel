"use client";

import Link from 'next/link';
import { Product } from '../types';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCartStore();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({
            product: product._id,
            name: product.name,
            image: product.images[0],
            price: product.price,
            qty: 1,
            stock: product.stock,
        });
    };

    return (
        <div className="group relative flex flex-col items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-[#e5e5e5] hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden z-10 w-full h-[400px]">
            <Link href={`/product/${product._id}`} className="w-full flex-1 flex items-center justify-center relative mb-6 cursor-pointer">
                {product.images[0] ? (
                    <img
                        src={product.images[0]?.startsWith('/')
                            ? `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '')}${product.images[0]}`
                            : product.images[0]}
                        alt={product.name}
                        className="max-w-full max-h-48 object-contain filter drop-shadow-xl transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                ) : (
                    <div className="w-full h-full bg-secondary/10 flex items-center justify-center text-gray-400 rounded-xl">
                        <span className="text-xs uppercase tracking-widest">No Image</span>
                    </div>
                )}
            </Link>

            <div className="w-full text-center flex flex-col items-center">
                <Link href={`/product/${product._id}`}>
                    <h3 className="text-lg font-serif text-foreground mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex justify-center items-center gap-2 mb-5">
                    <span className="text-foreground/80 font-medium text-sm tracking-wide">${product.price.toFixed(2)}</span>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-transparent border border-secondary text-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 rounded-lg flex items-center justify-center gap-2"
                >
                    <ShoppingBag size={14} />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
