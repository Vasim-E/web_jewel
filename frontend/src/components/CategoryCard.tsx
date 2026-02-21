"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function CategoryCard({ category }: { category: any }) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top; // y position within the element

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // Reduced to 6 degree max rotation for gentler effect
        const rotateY = ((x - centerX) / centerX) * 6;

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setRotation({ x: 0, y: 0 });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <Link
            href={`/shop?category=${encodeURIComponent(category.name)}`}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-[#e5e5e5] hover:border-primary/30 z-10 group h-72"
            style={{
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.03 : 1})`,
                // Adding a quick ease-out during hover makes the tracking feel fluid and expensive, not jerky
                transition: isHovered ? 'transform 0.15s ease-out, box-shadow 0.15s ease-out' : 'transform 0.5s ease-out, box-shadow 0.5s ease-out',
                boxShadow: isHovered
                    ? `${-rotation.y}px ${rotation.x + 10}px 30px rgba(0, 0, 0, 0.1)`
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                transformStyle: 'preserve-3d',
            }}
        >
            <div
                className="w-full h-32 relative mb-8 flex items-center justify-center pointer-events-none"
                style={{
                    transform: `translateZ(${isHovered ? '50px' : '0px'})`,
                    transition: 'transform 0.1s ease-out'
                }}
            >
                <img
                    src={category.image?.startsWith('/')
                        ? `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '')}${category.image}`
                        : (category.image || `https://source.unsplash.com/random/400x400?jewelry,${category.name.replace(' ', '')}`)}
                    alt={category.name}
                    className="max-w-full max-h-full object-contain filter drop-shadow-xl"
                />
            </div>

            <div
                className="text-center"
                style={{
                    transform: `translateZ(${isHovered ? '30px' : '0px'})`,
                    transition: 'transform 0.1s ease-out'
                }}
            >
                <h3 className="text-xl font-serif text-foreground mb-2">
                    {category.name}
                </h3>

                <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 block">
                    Shop Now
                </span>
            </div>

        </Link>
    );
}
