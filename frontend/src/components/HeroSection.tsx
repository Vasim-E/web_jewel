"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import api from '../lib/axios';
import { HeroSlide } from '../types';

export default function HeroSection() {
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [startAnimation, setStartAnimation] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const { data } = await api.get('/hero');
                if (data.length > 0) {
                    setHeroSlides(data);
                }
            } catch (error) {
                console.error("Failed to fetch hero slides", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSlides();

        // Trigger the split animation after a very short delay so the entrance feels deliberate
        const timer = setTimeout(() => {
            setStartAnimation(true);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    // Automatic product sequencing
    useEffect(() => {
        if (heroSlides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 8000); // 8 seconds per slide

        return () => clearInterval(interval);
    }, [heroSlides]);

    const currentData = heroSlides[currentSlide];

    // Smooth 3D floating effect
    const floatAnimation = {
        y: [0, -15, 0],
        rotateX: [0, 3, -3, 0],
        rotateY: [0, -3, 3, 0],
        transition: {
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    // Animation transition config - Perfect luxury Expo Ease Out
    const luxuryEase = [0.16, 1, 0.3, 1] as any;

    if (isLoading) {
        return (
            <section className="relative h-[80vh] bg-background flex items-center justify-center">
            </section>
        );
    }

    if (!currentData || heroSlides.length === 0) {
        return (
            <section className="relative h-[80vh] bg-background flex flex-col items-center justify-center">
                <Image src="/jewel_logo_color.png" alt="Jewel Logo" width={300} height={150} priority className="object-contain" />
            </section>
        );
    }

    return (
        <section className="relative h-screen bg-background overflow-hidden flex items-center justify-center" style={{ perspective: "1000px" }}>
            {/* Background Elements */}
            <div className="absolute inset-0 bg-secondary/20 z-0"></div>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={startAnimation ? { scale: 1.6, opacity: 0.3 } : { scale: 1.1, opacity: 0 }}
                transition={{ duration: 4, ease: luxuryEase }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/10 rounded-full blur-[120px]"
            ></motion.div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto h-full flex flex-col justify-center items-center px-4 md:px-12 pointer-events-none">

                {/* Text Group 1: Headline & Est (Moves Left) */}
                <motion.div
                    className={`absolute z-30 flex flex-col ${startAnimation && !isMobile ? 'items-start text-left' : 'items-center text-center'}`}
                    initial={{ left: "50%", x: "-50%", top: "50%", y: "-50%", opacity: 0, filter: "blur(4px)" }}
                    animate={startAnimation ?
                        (isMobile ? { top: "20%", y: "-50%", left: "50%", x: "-50%", opacity: 1, filter: "blur(0px)" } : { left: "8%", x: "0%", top: "50%", y: "-50%", opacity: 1, filter: "blur(0px)" })
                        : { left: "50%", x: "-50%", top: "50%", y: "-50%", opacity: 1, filter: "blur(0px)" }
                    }
                    transition={{ duration: 3, ease: luxuryEase }}
                    style={{ width: "350px", maxWidth: "90vw" }} // Fixed width to prevent wrapping issues during move
                >
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={currentData.productCode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="text-primary text-sm md:text-base uppercase tracking-[0.4em] mb-4 block font-medium"
                        >
                            {currentData.productCode}
                        </motion.span>
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={currentData.heading + currentData.subHeading}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                            className="text-2xl md:text-5xl lg:text-5xl font-serif text-foreground leading-tight whitespace-nowrap"
                        >
                            {currentData.heading}<br />
                            <span className="italic text-gray-400">{currentData.subHeading}</span>
                        </motion.h1>
                    </AnimatePresence>
                </motion.div>

                {/* Text Group 2: Paragraph (Moves Right) */}
                <motion.div
                    className={`absolute z-30 flex flex-col pointer-events-auto ${startAnimation && !isMobile ? 'items-end text-right' : 'items-center text-center'}`}
                    initial={{ left: "50%", x: "-50%", top: "50%", y: "-50%", opacity: 0, filter: "blur(4px)" }}
                    animate={startAnimation ?
                        (isMobile ? { top: "80%", y: "-50%", left: "50%", x: "-50%", opacity: 1, filter: "blur(0px)" } : { left: "auto", right: "8%", x: "0%", top: "50%", y: "-50%", opacity: 1, filter: "blur(0px)" })
                        : { left: "50%", x: "-50%", right: "auto", top: "50%", y: "-50%", opacity: 0, filter: "blur(4px)" }
                    }
                    transition={{ duration: 3, ease: luxuryEase, delay: 0.2 }}
                    style={{ width: "280px", maxWidth: "90vw" }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentData.description + "action"} // identifying key
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                            className="flex flex-col items-end"
                        >
                            <p className="text-gray-600 text-xs md:text-sm font-light leading-relaxed tracking-wide mb-4">
                                {currentData.description}
                            </p>

                            {(currentData.type === 'coming_soon') ? (
                                <span className="text-primary font-bold tracking-widest uppercase text-[10px] md:text-xs border-b border-primary pb-0.5">
                                    Coming Soon
                                </span>
                            ) : (
                                <Link
                                    href={currentData.productId ? `/product/${currentData.productId}` : '/shop'}
                                    className="text-primary font-bold tracking-widest uppercase text-[10px] md:text-xs border-b border-primary pb-0.5 hover:text-foreground hover:border-foreground transition-all"
                                >
                                    Grab It
                                </Link>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Buttons (Moves Down to Bottom) */}
                <motion.div
                    className="absolute z-30 bottom-12 w-full flex flex-col items-center gap-6 pointer-events-auto"
                    initial={{ y: 50, opacity: 0 }}
                    animate={startAnimation ? { y: 0, opacity: 1, scale: 0.9 } : { y: 50, opacity: 0, scale: 1 }}
                    transition={{ duration: 2.5, ease: luxuryEase, delay: 0.5 }}
                >
                    {/* Slide Dots */}
                    {heroSlides.length > 1 && (
                        <div className="flex gap-3 mb-2">
                            {heroSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-500 ${currentSlide === index
                                        ? 'w-8 bg-primary'
                                        : 'w-2 bg-gray-300 hover:bg-primary/50'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link href="/shop" className="group px-10 py-4 bg-foreground text-white hover:bg-primary transition-all duration-500 uppercase tracking-widest text-xs font-bold shadow-2xl rounded-full">
                            Shop Collection
                        </Link>
                        <Link href="/about" className="group px-10 py-4 border border-foreground text-foreground hover:border-primary hover:text-primary transition-all duration-500 uppercase tracking-widest text-xs font-bold rounded-full">
                            Our Story
                        </Link>
                    </div>
                </motion.div>

                {/* 3D Hero Image - Center Scale-up & Fade */}
                <AnimatePresence mode="wait">
                    {startAnimation && (
                        <motion.div
                            key={currentData.image}
                            className="absolute z-20 flex items-center justify-center pointer-events-none"
                            initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            transition={{ duration: 3, ease: luxuryEase, delay: 0.1 }}
                        >
                            <motion.div
                                animate={floatAnimation as any}
                                className="relative w-72 h-72 md:w-[600px] md:h-[600px] drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] flex items-center justify-center p-4"
                            >
                                <Image
                                    src={currentData.image?.startsWith('/')
                                        ? `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '')}${currentData.image}`
                                        : (currentData.image || "/hero_ring.png")}
                                    alt="Hero Product"
                                    width={700}
                                    height={700}
                                    className="object-contain w-full h-full"
                                    priority
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
