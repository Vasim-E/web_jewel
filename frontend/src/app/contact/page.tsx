"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ContactPage() {
    const { register, handleSubmit, reset } = useForm();
    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (data: any) => {
        // Here logic normally send an email or API request
        console.log(data);
        setSubmitted(true);
        reset();
    };

    return (
        <div className="bg-background min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 animate-fade-in-up">
                    <span className="text-primary tracking-[0.3em] uppercase text-xs block mb-4">Assistance</span>
                    <h1 className="text-5xl font-serif text-white mb-6">Get in Touch</h1>
                    <p className="text-lg text-gray-400 font-light">We'd love to hear from you. Send us a message or visit our boutique.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    {/* Contact Info */}
                    <div className="flex flex-col justify-center space-y-12">
                        <div className="border-l border-primary/30 pl-8">
                            <h3 className="text-xl font-serif text-white mb-2">Visit Us</h3>
                            <p className="text-gray-400 font-light leading-relaxed">123 Luxury Lane, Fashion District<br />New York, NY 10001</p>
                        </div>
                        <div className="border-l border-primary/30 pl-8">
                            <h3 className="text-xl font-serif text-white mb-2">Email Us</h3>
                            <p className="text-gray-400 font-light hover:text-primary transition-colors cursor-pointer">concierge@jewel.com</p>
                        </div>
                        <div className="border-l border-primary/30 pl-8">
                            <h3 className="text-xl font-serif text-white mb-2">Call Us</h3>
                            <p className="text-gray-400 font-light">+1 (555) 123-4567</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-[#141414] p-10 border border-white/5 shadow-2xl">
                        {submitted ? (
                            <div className="text-center py-12">
                                <h3 className="text-3xl font-serif text-white mb-4">Thank You</h3>
                                <div className="w-12 h-[1px] bg-primary mx-auto mb-6"></div>
                                <p className="text-gray-400 font-light">Your message has been received. We will get back to you shortly.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-8 text-primary hover:text-white transition-colors uppercase tracking-widest text-xs border-b border-primary pb-1"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        {...register('name', { required: true })}
                                        className="mt-1 block w-full bg-background border border-white/10 text-white rounded-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm p-4 placeholder-gray-600 transition-colors"
                                        placeholder="YOUR NAME"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        {...register('email', { required: true })}
                                        className="mt-1 block w-full bg-background border border-white/10 text-white rounded-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm p-4 placeholder-gray-600 transition-colors"
                                        placeholder="YOUR EMAIL"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        {...register('message', { required: true })}
                                        className="mt-1 block w-full bg-background border border-white/10 text-white rounded-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm p-4 placeholder-gray-600 transition-colors"
                                        placeholder="HOW CAN WE HELP YOU?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary text-black py-4 px-6 hover:bg-white transition-all duration-300 uppercase tracking-[0.2em] font-bold text-xs"
                                >
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
