"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../lib/axios';
import { useForm } from 'react-hook-form';

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, totalPrice, clearCart } = useCartStore();
    const { user, isAuthenticated } = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const total = totalPrice();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout');
        }
        if (cartItems.length === 0) {
            router.push('/shop');
        }
    }, [isAuthenticated, cartItems, router]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const orderData = {
                orderItems: cartItems,
                shippingAddress: {
                    address: data.address,
                    city: data.city,
                    postalCode: data.postalCode,
                    country: data.country
                },
                paymentMethod: 'Razorpay',
                itemsPrice: total, // Simplified for demo
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: total
            };

            const res = await api.post('/orders', orderData);

            // Here we would integrate Razorpay
            // For now, assume success and redirect to order details (or home)
            clearCart();
            alert('Order placed successfully!');
            router.push('/'); // Should actully go to /order/[id]
        } catch (error) {
            console.error(error);
            alert('Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-serif text-foreground mb-12 border-b border-secondary pb-6">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-xl font-serif text-foreground mb-8 uppercase tracking-widest text-xs">Shipping Address</h2>
                        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Address</label>
                                <input type="text" {...register('address', { required: true })} className="mt-1 block w-full bg-white border border-secondary text-foreground rounded-lg focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm p-4 placeholder-gray-400 transition-all shadow-sm" placeholder="STREET ADDRESS" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">City</label>
                                    <input type="text" {...register('city', { required: true })} className="mt-1 block w-full bg-white border border-secondary text-foreground rounded-lg focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm p-4 placeholder-gray-400 transition-all shadow-sm" placeholder="CITY" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Postal Code</label>
                                    <input type="text" {...register('postalCode', { required: true })} className="mt-1 block w-full bg-white border border-secondary text-foreground rounded-lg focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm p-4 placeholder-gray-400 transition-all shadow-sm" placeholder="ZIP CODE" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Country</label>
                                <input type="text" {...register('country', { required: true })} className="mt-1 block w-full bg-white border border-secondary text-foreground rounded-lg focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm p-4 placeholder-gray-400 transition-all shadow-sm" placeholder="COUNTRY" />
                            </div>
                        </form>
                    </div>

                    <div className="bg-card-bg p-10 border border-secondary shadow-lg rounded-xl sticky top-32 h-fit">
                        <h2 className="text-xl font-serif text-foreground mb-8 uppercase tracking-widest text-xs">Order Summary</h2>
                        <ul className="space-y-6 mb-8 border-b border-secondary pb-8">
                            {cartItems.map(item => (
                                <li key={item.product} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-secondary">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-foreground font-medium">{item.name}</span>
                                            <span className="text-gray-500 text-xs">Qty: {item.qty}</span>
                                        </div>
                                    </div>
                                    <span className="text-primary font-serif font-medium">${(item.price * item.qty).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between font-serif text-xl text-foreground mb-8">
                            <span>Total</span>
                            <span className="text-primary font-medium">${total.toFixed(2)}</span>
                        </div>

                        <button
                            form="checkout-form"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 px-6 hover:bg-primary-hover shadow-md hover:shadow-lg transition-all duration-300 uppercase tracking-[0.2em] font-bold text-xs rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                        <p className="text-xs text-gray-400 mt-4 text-center uppercase tracking-widest">Secure Payment Processing</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
