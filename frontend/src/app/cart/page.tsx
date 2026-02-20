"use client";

import Link from 'next/link';
import { useCartStore } from '../../store/useCartStore';
import { Trash2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { cartItems, removeFromCart, totalPrice, clearCart } = useCartStore();
    const router = useRouter();
    const total = totalPrice();

    const handleCheckout = () => {
        router.push('/login?redirect=/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-background text-foreground pt-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
                <h2 className="text-4xl font-serif text-white mb-6">Your Cart is Empty</h2>
                <p className="text-gray-400 mb-10 font-light text-lg">Looks like you haven't added any items to the cart yet.</p>
                <Link href="/shop" className="group inline-flex items-center px-10 py-4 border border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300 uppercase tracking-widest text-sm font-bold">
                    Start Shopping <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen pt-32 pb-20 text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-serif text-foreground mb-12 border-b border-secondary pb-6">Shopping Cart</h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-16 lg:items-start">
                    <section className="col-span-12 lg:col-span-8">
                        <ul role="list" className="divide-y divide-secondary">
                            {cartItems.map((item) => (
                                <li key={item.product} className="flex py-10">
                                    <div className="flex-shrink-0 border border-secondary rounded-lg overflow-hidden shadow-sm">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-32 h-32 object-center object-cover"
                                        />
                                    </div>

                                    <div className="ml-8 flex-1 flex flex-col justify-between">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-xl font-serif text-foreground">
                                                        <Link href={`/product/${item.product}`} className="hover:text-primary transition-colors">
                                                            {item.name}
                                                        </Link>
                                                    </h3>
                                                </div>
                                                <p className="mt-2 text-lg font-medium text-primary font-serif">${item.price.toFixed(2)}</p>
                                                {item.packaging && (
                                                    <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                                        <p>Packaging: +${item.packaging.packagingPrice.toFixed(2)}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 sm:mt-0 sm:pr-9 flex items-center gap-6">
                                                <div className="flex items-center border border-secondary rounded-md overflow-hidden bg-white">
                                                    {/* Quantity Logic could be improved with buttons */}
                                                    <select
                                                        id={`quantity-${item.product}`}
                                                        name={`quantity-${item.product}`}
                                                        value={item.qty}
                                                        onChange={(e) => { /* Update Qty */ }}
                                                        className="bg-transparent text-foreground border-0 py-2 pl-4 pr-8 focus:ring-0 focus:border-primary sm:text-sm cursor-pointer"
                                                    >
                                                        {[...Array(item.stock).keys()].map(x => (
                                                            <option key={x + 1} value={x + 1} className="bg-white text-foreground">{x + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="absolute top-0 right-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.product)}
                                                        className="-m-2 p-2 inline-flex text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <span className="sr-only">Remove</span>
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Order Summary */}
                    <section
                        aria-labelledby="summary-heading"
                        className="mt-16 bg-card-bg rounded-xl px-8 py-10 lg:mt-0 lg:col-span-4 border border-secondary shadow-lg sticky top-32"
                    >
                        <h2 id="summary-heading" className="text-2xl font-serif text-foreground mb-8">
                            Order Summary
                        </h2>

                        <dl className="space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                                <dt className="text-gray-500">Subtotal</dt>
                                <dd className="text-foreground font-serif font-medium">${total.toFixed(2)}</dd>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <dt className="text-lg font-medium text-foreground">Total</dt>
                                <dd className="text-xl font-medium text-primary font-serif">${total.toFixed(2)}</dd>
                            </div>
                        </dl>

                        <div className="mt-10">
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-primary text-white py-4 px-6 hover:bg-primary-hover shadow-md hover:shadow-lg transition-all duration-300 uppercase tracking-[0.2em] font-bold text-xs rounded-lg"
                            >
                                Checkout
                            </button>
                            <p className="mt-6 text-center text-xs text-gray-400 uppercase tracking-widest">Secure Checkout</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
