import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary text-[#faf8f5] py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="relative mb-6 w-full h-24">
                            <Image
                                src="/jewel_logo_light.png"
                                alt="Jewel Logo"
                                fill
                                className="object-contain brightness-0 invert"
                            />
                        </div>
                        <p className="text-[#faf8f5]/90 text-sm font-medium">
                            Timeless elegance for the modern woman. Discover our exclusive collection of luxury jewelry.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-[#faf8f5]">Shop</h4>
                        <ul className="space-y-2 text-sm text-[#faf8f5]/80 font-medium">
                            <li><Link href="/shop?category=Earrings" className="hover:text-white transition-colors">Earrings</Link></li>
                            <li><Link href="/shop?category=Necklaces" className="hover:text-white transition-colors">Necklaces</Link></li>
                            <li><Link href="/shop?category=Rings" className="hover:text-white transition-colors">Rings</Link></li>
                            <li><Link href="/shop?category=Bracelets" className="hover:text-white transition-colors">Bracelets</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-[#faf8f5]">Company</h4>
                        <ul className="space-y-2 text-sm text-[#faf8f5]/80 font-medium">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-[#faf8f5]">Connect</h4>
                        <div className="flex space-x-4 mb-4 text-[#faf8f5]/80">
                            <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                        </div>
                        <p className="text-sm text-[#faf8f5]/90 font-medium">Subscribe to our newsletter for exclusive offers.</p>
                        {/* Newsletter input could go here */}
                    </div>
                </div>
                <div className="border-t border-[#faf8f5]/30 mt-8 pt-8 text-center text-sm font-medium text-[#faf8f5]/80">
                    &copy; {new Date().getFullYear()} Jewel. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
