"use client";

import { useState } from 'react';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../../../store/useCartStore'; // adjust path
import { Product } from '../../../types'; // adjust path

export default function AddToCartButton({ product }: { product: Product }) {
    const [qty, setQty] = useState(1);
    const { addToCart } = useCartStore();

    const handleAddToCart = () => {
        addToCart({
            product: product._id,
            name: product.name,
            image: product.images[0],
            price: product.price,
            qty,
            stock: product.stock
        });
        alert('Added to cart!');
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center border border-gray-300 rounded-md w-32">
                <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 text-gray-600 hover:text-primary transition-colors"
                >
                    <Minus size={16} />
                </button>
                <div className="flex-1 text-center text-gray-900">{qty}</div>
                <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="p-2 text-gray-600 hover:text-primary transition-colors"
                >
                    <Plus size={16} />
                </button>
            </div>

            <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ShoppingBag size={20} className="mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    );
}
