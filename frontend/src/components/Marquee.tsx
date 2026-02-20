"use client";

import { useEffect, useState } from "react";
import api from "../lib/axios";

export default function Marquee() {
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        const fetchMarquee = async () => {
            try {
                const res = await api.get('/marquee');
                setConfig(res.data);
            } catch (error) {
                console.error("Failed to fetch marquee config", error);
            }
        };
        fetchMarquee();
    }, []);

    if (!config || !config.isActive) return null;

    const bgClass = config.bgColor === 'red' ? 'bg-[#800000]' : 'bg-primary';

    return (
        <div className={`overflow-hidden flex whitespace-nowrap py-3 ${bgClass} text-[#faf8f5] border-y border-white/10`}>
            {/* We run 2 massive identical blocks to ensure gapless infinite scrolling */}
            {[...Array(2)].map((_, i) => (
                <div key={i} className="flex shrink-0 items-center animate-marquee font-serif tracking-widest text-sm uppercase" aria-hidden={i !== 0 ? "true" : "false"}>
                    {/* Map enough items to guarantee it exceeds any screen width */}
                    {[...Array(20)].map((_, j) => (
                        <span key={j} className="flex items-center">
                            <span className="px-8">{config.text}</span>
                            <span>•</span>
                        </span>
                    ))}
                </div>
            ))}
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    /* Speed adapts slightly to text length, keeping it slow and luxurious */
                    animation: marquee 120s linear infinite;
                }
            `}</style>
        </div>
    );
}
