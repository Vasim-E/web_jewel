"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../lib/axios';
import { useForm } from 'react-hook-form';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const { login, isAuthenticated } = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            router.push(redirect);
        }
    }, [isAuthenticated, redirect, router]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/users/auth', data);
            login(res.data);
            router.push(redirect);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-secondary/20 z-0"></div>
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

            <div className="max-w-md w-full space-y-8 p-10 bg-card-bg shadow-xl rounded-xl relative z-10 animate-fade-in-up">
                <div className="text-center">
                    <span className="text-primary tracking-[0.3em] uppercase text-xs block mb-4 font-bold">Welcome Back</span>
                    <h2 className="text-3xl font-serif text-foreground">Sign In</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email address</label>
                            <input
                                id="email-address"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 placeholder-gray-400 text-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all"
                                placeholder="name@example.com"
                                {...register('email', { required: true })}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none relative block w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 placeholder-gray-400 text-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all"
                                placeholder="Your password"
                                {...register('password', { required: true })}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-xs text-center uppercase tracking-wider font-medium bg-red-50 py-2 rounded">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-xs font-bold uppercase tracking-[0.2em] text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 rounded-lg shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <Link href={`/register?redirect=${redirect}`} className="text-xs text-gray-500 hover:text-primary transition-colors uppercase tracking-widest border-b border-transparent hover:border-primary pb-1">
                            Create an account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
