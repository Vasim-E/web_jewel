import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'About Us | Jewel',
    description: 'Learn about the craftsmanship and story behind Jewel.',
};

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen text-foreground">
            {/* Hero Section */}
            <div className="relative h-[70vh] flex items-center justify-center text-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
                <div className="relative z-10 max-w-4xl px-4 animate-fade-in-up">
                    <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium mb-4 block">Since 2026</span>
                    <h1 className="text-6xl md:text-8xl font-serif text-white mb-8">Our Story</h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide text-gray-200">Crafting elegance for the modern soul.</p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-serif text-white">A Legacy of Beauty</h2>
                        <div className="w-16 h-[2px] bg-primary"></div>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            Founded on the belief that jewelry should be more than just an accessory, Jewel was born from a passion for timeless design and exquisite craftsmanship.
                            Each piece in our collection is a testament to the artistry that goes into creating something truly special.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            We source only the finest materials, from ethically mined diamonds to lustrous pearls, ensuring that every creation not only looks beautiful but also stands the test of time.
                        </p>
                    </div>
                    <div className="relative h-[600px] rounded-sm overflow-hidden">
                        <div className="absolute inset-0 border border-primary/30 m-4 z-10 pointer-events-none"></div>
                        <Image src="https://images.unsplash.com/photo-1617038224558-28809c9dc229?auto=format&fit=crop&q=80" alt="Craftsmanship" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    </div>
                </div>

                <div className="mt-32 text-center">
                    <span className="text-primary tracking-[0.2em] uppercase text-xs block mb-4">Philosophy</span>
                    <h2 className="text-4xl font-serif text-white mb-16">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="p-10 border border-white/5 bg-[#141414] hover:border-primary/30 transition-colors duration-300">
                            <h3 className="text-2xl font-serif text-white mb-4">Quality</h3>
                            <p className="text-gray-400 font-light">Uncompromising attention to detail in every piece we create.</p>
                        </div>
                        <div className="p-10 border border-white/5 bg-[#141414] hover:border-primary/30 transition-colors duration-300">
                            <h3 className="text-2xl font-serif text-white mb-4">Sustainability</h3>
                            <p className="text-gray-400 font-light">Committed to ethical sourcing and responsible practices.</p>
                        </div>
                        <div className="p-10 border border-white/5 bg-[#141414] hover:border-primary/30 transition-colors duration-300">
                            <h3 className="text-2xl font-serif text-white mb-4">Elegance</h3>
                            <p className="text-gray-400 font-light">Timeless designs that transcend fleeting trends.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
