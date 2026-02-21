"use client";

import { useState, useEffect } from 'react';
import { Product } from '../../../types';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../../../store/useCartStore';
import PackagingSelector from '../../../components/PackagingSelector';

export default function ProductDetailsClient({ product }: { product: Product }) {
    const [qty, setQty] = useState(1);
    const { addToCart } = useCartStore();
    const [packaging, setPackaging] = useState<any>(null);
    const [price, setPrice] = useState(product.price);

    useEffect(() => {
        if (packaging) {
            setPrice(product.price + packaging.packagingPrice);
        } else {
            setPrice(product.price);
        }
    }, [packaging, product.price]);

    const handleAddToCart = () => {
        addToCart({
            product: product._id,
            name: product.name,
            image: product.images[0],
            price: product.price,
            qty,
            stock: product.stock,
            packaging: packaging || undefined
        });
        alert('Added to cart!');
    };

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [zoomStyle, setZoomStyle] = useState({});

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: 'scale(1.6)', // Reduced scaling factor for a smoother, less sensitive luxury zoom effect
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({
            transformOrigin: 'center center',
            transform: 'scale(1)',
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
                {/* Main Image with Zoom */}
                <div
                    className="aspect-square bg-white rounded-2xl overflow-hidden relative cursor-crosshair border border-[#e5e5e5] shadow-sm flex items-center justify-center p-8 group"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {product.images?.[activeImageIndex] ? (
                        <img
                            src={product.images[activeImageIndex]?.startsWith('/')
                                ? `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '')}${product.images[activeImageIndex]}`
                                : product.images[activeImageIndex]}
                            alt={product.name}
                            className="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-200 ease-out"
                            style={zoomStyle}
                        />
                    ) : (
                        <div className="text-gray-400 uppercase tracking-widest text-sm">No Image</div>
                    )}
                </div>

                {/* Thumbnail Slider Dots / Previews */}
                {product.images?.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                        {product.images.map((image, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImageIndex(idx)}
                                className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 bg-white flex items-center justify-center p-2 transition-all duration-300 ${activeImageIndex === idx ? 'border-primary shadow-md' : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'
                                    }`}
                            >
                                <img
                                    src={image?.startsWith('/')
                                        ? `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '')}${image}`
                                        : image}
                                    alt={`${product.name} view ${idx + 1}`}
                                    className="w-full h-full object-contain filter drop-shadow-md"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div>
                <h1 className="text-3xl font-serif text-gray-900 mb-4">{product.name}</h1>
                <p className="text-2xl text-primary font-medium mb-6">${price.toFixed(2)}</p>

                <div className="prose prose-sm text-gray-600 mb-8">
                    <p>{product.description}</p>
                </div>

                <div className="border-t border-gray-200 pt-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-700">Quantity</label>
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
                        </div>

                        <PackagingSelector onChange={setPackaging} />

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="w-full mt-4 flex items-center justify-center bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingBag size={20} className="mr-2" />
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Details</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                        <li>Category: {product.category}</li>
                        <li>Stock: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
