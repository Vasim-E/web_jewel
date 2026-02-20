"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../lib/axios'; // Assuming we have an axios instance setup
import Link from 'next/link';

interface Order {
    _id: string;
    createdAt: string;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    orderItems: Array<{
        name: string;
        qty: number;
        image: string;
        price: number;
        product: string;
    }>;
}

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/profile');
        } else {
            fetchOrders();
        }
    }, [isAuthenticated, router]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/myorders');
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-background min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-foreground">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-serif text-foreground mb-12 border-b border-secondary pb-6">My Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* User Info */}
                    <div className="md:col-span-4">
                        <div className="bg-card-bg p-8 border border-secondary shadow-lg rounded-xl sticky top-32">
                            <h2 className="text-xl font-serif text-foreground mb-6 uppercase tracking-widest text-xs">User Information</h2>
                            <div className="space-y-6 mb-8">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Name</p>
                                    <p className="font-medium text-foreground text-lg">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email</p>
                                    <p className="font-medium text-foreground text-lg">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { logout(); router.push('/'); }}
                                className="w-full bg-transparent border border-gray-300 text-foreground py-3 px-4 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 uppercase tracking-widest text-xs font-bold rounded-lg"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="md:col-span-8">
                        <h2 className="text-2xl font-serif text-foreground mb-8">Order History</h2>
                        {loading ? (
                            <p className="text-gray-500">Loading orders...</p>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-20 bg-card-bg border border-secondary rounded-xl shadow-sm">
                                <p className="text-gray-500 mb-6 font-light">You haven't placed any orders yet.</p>
                                <Link href="/shop" className="text-primary hover:text-foreground transition-colors uppercase tracking-widest text-sm border-b border-primary pb-1 font-bold">Start Shopping</Link>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {orders.map((order) => (
                                    <div key={order._id} className="bg-card-bg border border-secondary rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg shadow-sm">
                                        <div className="px-6 py-5 bg-secondary/30 flex flex-wrap gap-y-4 justify-between items-center text-sm border-b border-secondary">
                                            <div>
                                                <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Order Placed</span>
                                                <span className="text-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total</span>
                                                <span className="text-primary font-serif font-medium">${order.totalPrice.toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Order #</span>
                                                <span className="text-gray-400 font-mono text-xs">{order._id.substring(0, 10)}...</span>
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <div className="flex flex-col sm:flex-row justify-between mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex gap-3">
                                                        <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold border rounded ${order.isPaid ? 'border-green-200 bg-green-50 text-green-700' : 'border-yellow-200 bg-yellow-50 text-yellow-700'}`}>
                                                            {order.isPaid ? 'Paid' : 'Pending Payment'}
                                                        </span>
                                                        <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold border rounded ${order.isDelivered ? 'border-green-200 bg-green-50 text-green-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
                                                            {order.isDelivered ? 'Delivered' : 'Processing'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="divide-y divide-secondary">
                                                {order.orderItems.map((item, idx) => (
                                                    <div key={idx} className="py-6 flex items-center">
                                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden border border-secondary rounded-md">
                                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                                                        </div>
                                                        <div className="ml-6 flex-1">
                                                            <h3 className="text-lg font-serif text-foreground hover:text-primary transition-colors">
                                                                <Link href={`/product/${item.product}`}>{item.name}</Link>
                                                            </h3>
                                                            <p className="mt-1 text-sm text-gray-500">Qty: {item.qty}</p>
                                                        </div>
                                                        <p className="text-lg font-serif text-primary">${item.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
